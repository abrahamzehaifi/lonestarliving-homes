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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!allowedEmail || !authSecret || !resendKey || !fromEmail || !baseUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing auth environment variables." },
        { status: 500 }
      );
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || normalizedEmail !== allowedEmail.toLowerCase()) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized email." },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      email: allowedEmail,
      purpose: "ops_login",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(encoder.encode(authSecret));

    const verifyUrl = `${baseUrl}/auth/verify?token=${encodeURIComponent(token)}`;

    const resend = new Resend(resendKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [allowedEmail],
      subject: "Your LonestarLiving ops access link",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Operations Login</h2>
          <p>Click the secure link below to access your CRM dashboard.</p>
          <p>
            <a
              href="${verifyUrl}"
              style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;"
            >
              Open CRM
            </a>
          </p>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
      text: `Open your CRM: ${verifyUrl}\n\nThis link expires in 15 minutes.`,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}