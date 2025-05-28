// app/api/send-thankyou-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const thankYouMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Thank you for your purchase!",
      html: `
        <p>Thank you for purchasing the Ideal Destination Finder. Your report is on the way!</p>
      `,
    };

    await transporter.sendMail(thankYouMailOptions);

    return NextResponse.json({ success: true, message: "Instant email sent" });
  } catch (error) {
    console.error("Failed to send thank-you email:", error);
    return NextResponse.json({ error: "Email sending failed" }, { status: 500 });
  }
}
