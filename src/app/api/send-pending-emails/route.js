import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const dueEmails = await db.collection("scheduledEmails").find({
      sendAt: { $lte: new Date() },
      sent: false
    }).toArray();

    if (dueEmails.length === 0) {
      return NextResponse.json({ message: "No emails to send." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const emailData of dueEmails) {
      const { _id, email, htmlContent } = emailData;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Destination Recommendations",
        html: htmlContent
      });

      await db.collection("scheduledEmails").updateOne(
        { _id },
        { $set: { sent: true, sentAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true, sent: dueEmails.length });
  } catch (error) {
    console.error("Sending failed:", error);
    return NextResponse.json({ error: "Failed to send pending mails" }, { status: 500 });
  }
}
