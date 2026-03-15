import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;

  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const path =
      typeof body?.path === "string" && body.path.trim()
        ? body.path.trim()
        : "/";

    const referrer =
      typeof body?.referrer === "string" && body.referrer.trim()
        ? body.referrer.trim()
        : null;

    const visitSource =
      typeof body?.visitSource === "string" && body.visitSource.trim()
        ? body.visitSource.trim()
        : "website";

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent");

    const country = req.headers.get("x-vercel-ip-country");
    const region = req.headers.get("x-vercel-ip-country-region");
    const city = req.headers.get("x-vercel-ip-city");

    const supabase = createSupabaseServiceClient();

    let knownLabel: string | null = null;

    if (ip) {
      const { data: knownIp } = await supabase
        .from("known_ips")
        .select("label")
        .eq("ip", ip)
        .eq("active", true)
        .maybeSingle();

      knownLabel = knownIp?.label ?? null;
    }

    const { error } = await supabase.from("site_visits").insert({
      path,
      referrer,
      ip,
      user_agent: userAgent,
      country: country ?? null,
      region: region ?? null,
      city: city ?? null,
      known_label: knownLabel,
      visit_source: visitSource,
    });

    if (error) {
      console.error("visit logging failed:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("visit route error:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}