import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function cleanText(value: unknown, max = 500): string | null {
  const s = String(value ?? "").trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;

  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const path = cleanText(body?.path, 1000) || "/";
    const referrer = cleanText(body?.referrer, 2000);

    const rawVisitSource = cleanText(body?.visitSource, 80)?.toLowerCase();
    const allowedVisitSources = ["website", "organic", "direct", "referral", "campaign"];
    const visitSource = allowedVisitSources.includes(rawVisitSource || "")
      ? rawVisitSource
      : "website";

    const ip = getClientIp(req);
    const userAgent = cleanText(req.headers.get("user-agent"), 1000);

    const country = cleanText(req.headers.get("x-vercel-ip-country"), 50);
    const region = cleanText(req.headers.get("x-vercel-ip-country-region"), 50);
    const city = cleanText(req.headers.get("x-vercel-ip-city"), 120);

    const supabase = createSupabaseServiceClient();

    let knownLabel: string | null = null;

    if (ip) {
      const { data: knownIp, error: knownIpError } = await supabase
        .from("known_ips")
        .select("label")
        .eq("ip", ip)
        .eq("active", true)
        .maybeSingle();

      if (knownIpError) {
        console.error("known_ips lookup failed:", knownIpError);
      } else {
        knownLabel = cleanText(knownIp?.label, 120);
      }
    }

    const { error } = await supabase.from("site_visits").insert({
      path,
      referrer,
      ip,
      user_agent: userAgent,
      country,
      region,
      city,
      known_label: knownLabel,
      visit_source: visitSource,
    });

    if (error) {
      console.error("visit logging failed:", error);
      return NextResponse.json({ ok: true, logged: false });
    }

    return NextResponse.json({ ok: true, logged: true });
  } catch (error) {
    console.error("visit route error:", error);
    return NextResponse.json({ ok: true, logged: false });
  }
}