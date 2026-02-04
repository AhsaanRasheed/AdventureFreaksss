// import { text } from "body-parser";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const runtime = "nodejs";
export async function POST(req) {
  try {
    const { userInfo } = await req.json();

    if (!userInfo) {
      return NextResponse.json(
        { error: "Missing content" },
        { status: 400 }
      );
    }

    // ✅ 1. Send instant thank-you email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const sendToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Assessment Booking",
      text: userInfo
    };

    const sendToDevTeam = {
      from: process.env.ADMIN_EMAIL,
      to: 'ahsenrasheedsh@gmail.com',
      subject: "New Assessment Booking",
      text: userInfo
    };

    await transporter.sendMail(sendToAdmin);
    await transporter.sendMail(sendToDevTeam);


    return NextResponse.json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send Email" },
      { status: 500 }
    );
  }
}
