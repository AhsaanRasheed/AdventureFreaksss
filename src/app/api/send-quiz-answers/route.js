// app/api/schedule-followup-email/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { email, htmlContent } = await req.json();

    if (!email || !htmlContent) {
      return NextResponse.json(
        { error: "Missing email or content" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const sendAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes later

    const emailsToSchedule = [
      {
        email,
        htmlContent,
        sendAt,
        sent: false,
        createdAt: new Date(),
      },
      {
        email: process.env.ADMIN_EMAIL,
        htmlContent,
        sendAt,
        sent: false,
        createdAt: new Date(),
      },
    ];

    await db.collection("scheduledEmails").insertMany(emailsToSchedule);

    return NextResponse.json({
      success: true,
      message: "Follow-up email scheduled",
    });
  } catch (error) {
    console.error("Failed to schedule follow-up email:", error);
    return NextResponse.json(
      { error: "Scheduling failed" },
      { status: 500 }
    );
  }
}
