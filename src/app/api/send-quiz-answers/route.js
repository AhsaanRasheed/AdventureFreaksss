import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, htmlContent } = await req.json();

    if (!email || !htmlContent) {
      return NextResponse.json({ error: "Missing email or answers" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use app password
      },
    });

    const userMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Destination Recommendations',
      html: htmlContent,
    };

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // send to admin
      subject: `New Quiz Submission from ${email}`,
      html: htmlContent,
    };

    // Send to user
    await transporter.sendMail(userMail);

    // Send to admin
    await transporter.sendMail(adminMail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}
