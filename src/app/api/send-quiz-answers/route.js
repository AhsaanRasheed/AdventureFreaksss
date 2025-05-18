import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, answers } = await req.json();

    if (!email || !answers) {
      return NextResponse.json({ error: "Missing email or answers" }, { status: 400 });
    }

    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `<p><strong>${question}</strong>: ${answer}</p>`)
      .join("");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Quiz Answers',
      html: `<div><h2>Your Quiz Answers</h2>${formattedAnswers}</div>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}
