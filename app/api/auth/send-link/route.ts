import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { Resend } from "resend";

const encoder = new TextEncoder();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const allowedEmail = process.env.OPS_ALLOWED_EMAIL;
    const authSecret = process.env.OPS_AUTH_SECRET;
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.OPS_FROM_EMAIL;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    if (!allowedEmail || !authSecret || !resendKey || !fromEmail) {
      console.error("Missing ops auth env vars");
      return NextResponse.json({
        ok: false,
        error: "Missing auth configuration.",
      });
    }

    const allowed = allowedEmail.toLowerCase();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // Silent success for non-allowed email
    if (!normalizedEmail || normalizedEmail !== allowed) {
      return NextResponse.json({ ok: true });
    }

    const token = await new SignJWT({
      email: allowedEmail,
      purpose: "ops_login",
      role: "ops",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("lonestarliving.ops")
      .setAudience("ops-dashboard")
      .setExpirationTime("15m")
      .sign(encoder.encode(authSecret));

    const verifyUrl = `${baseUrl}/ops/verify?token=${encodeURIComponent(token)}`;

    const resend = new Resend(resendKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [allowedEmail],
      subject: "LonestarLiving — Operations Access",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Operations Login</h2>
          <p>Secure access link for your CRM dashboard.</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Open CRM
          </a>
          <p style="font-size:12px;color:#888;">This link expires in 15 minutes.</p>
        </div>
      `,
      text: `Open your CRM: ${verifyUrl}\n\nThis link expires in 15 minutes.`,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return NextResponse.json({
        ok: false,
        error: "Failed to send access link.",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SEND LINK ERROR:", err);
    return NextResponse.json({
      ok: false,
      error: "Unexpected server error.",
    });
  }
}