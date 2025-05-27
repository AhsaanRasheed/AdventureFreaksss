import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

    // ✅ 1. Send instant thank-you email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   const thankYouMailOptions = {
  from: process.env.ADMIN_EMAIL,
  to: email,  // user's email
  subject: "Thank you for your purchase!",
  html: `
    <p>Thank you for purchasing the Ideal Destination Finder. Your report is on the way!</p>
  `,
};

    await transporter.sendMail(thankYouMailOptions);

    // ✅ 2. Schedule the follow-up email
    const { db } = await connectToDatabase();
    const sendAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const emailsToSchedule = [
      {
        email: email,
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
      message: "Instant email sent and follow-up scheduled",
    });
  } catch (error) {
    console.error("Email sending or scheduling failed:", error);
    return NextResponse.json(
      { error: "Failed to send or schedule emails" },
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     const { email, htmlContent } = await req.json();

//     if (!email || !htmlContent) {
//       return NextResponse.json({ error: "Missing email or content" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     // const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
//     const tenMinutesLater = new Date(Date.now() + 5 * 60 * 1000);

//     const emailsToSchedule = [
//       {
//         email: email, // user's email
//         htmlContent,
//         sendAt: tenMinutesLater,
//         sent: false,
//         createdAt: new Date()
//       },
//       {
//         email: process.env.ADMIN_EMAIL, // admin email
//         htmlContent,
//         sendAt: tenMinutesLater,
//         sent: false,
//         createdAt: new Date()
//       }
//     ];

//     await db.collection("scheduledEmails").insertMany(emailsToSchedule);

//     return NextResponse.json({ success: true, message: "Emails scheduled successfully" });
//   } catch (error) {
//     console.error("Scheduling failed:", error);
//     return NextResponse.json({ error: "Failed to schedule emails" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const { email, htmlContent } = await req.json();

//     if (!email || !htmlContent) {
//       return NextResponse.json({ error: "Missing email or answers" }, { status: 400 });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // use app password
//       },
//     });

//     const userMail = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your Destination Recommendations',
//       html: htmlContent,
//     };

//     const adminMail = {
//       from: process.env.EMAIL_USER,
//       to: process.env.ADMIN_EMAIL, // send to admin
//       subject: `New Quiz Submission from ${email}`,
//       html: htmlContent,
//     };

//     // Send to user
//     await transporter.sendMail(userMail);

//     // Send to admin
//     await transporter.sendMail(adminMail);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Failed to send email:", error);
//     return NextResponse.json({ error: "Email send failed" }, { status: 500 });
//   }
// }
