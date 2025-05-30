// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";
// import { connectToDatabase } from "../../../../lib/mongodb";

// export async function POST(req) {
//   try {
//     const { email, htmlContent } = await req.json();

//     if (!email || !htmlContent) {
//       return NextResponse.json(
//         { error: "Missing email or content" },
//         { status: 400 }
//       );
//     }

//     // ✅ 1. Send instant thank-you email
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or another provider
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const thankYouMailOptions = {
//       from: process.env.ADMIN_EMAIL,
//       to: email,
//       subject: "Thanks for taking the Adventure Freaksss Quiz!",
//       html: `
//         <p>Thank you for purchasing the Ideal Destination Finder. Your report is on the way!</p>
//       `,
//     };

//     await transporter.sendMail(thankYouMailOptions);

//     // ✅ 2. Schedule the follow-up email
//     const { db } = await connectToDatabase();
//     const sendAt = new Date(Date.now() + 1 * 60 * 1000); // 5 minutes from now

//     const emailsToSchedule = [
//       {
//         email: email,
//         htmlContent,
//         sendAt,
//         sent: false,
//         createdAt: new Date(),
//       },
//       {
//         email: process.env.ADMIN_EMAIL,
//         htmlContent,
//         sendAt,
//         sent: false,
//         createdAt: new Date(),
//       },
//     ];

//     await db.collection("scheduledEmails").insertMany(emailsToSchedule);

//     return NextResponse.json({
//       success: true,
//       message: "Instant email sent and follow-up scheduled",
//     });
//   } catch (error) {
//     console.error("Email sending or scheduling failed:", error);
//     return NextResponse.json(
//       { error: "Failed to send or schedule emails" },
//       { status: 500 }
//     );
//   }
// }
