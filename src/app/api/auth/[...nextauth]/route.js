import NextAuth from "next-auth";
import { authOptions } from "./options"; // Import the auth options from options.js

export const runtime = "nodejs";
const handler = NextAuth(authOptions); // Initialize NextAuth with the provided options

export { handler as GET, handler as POST }; // Export GET and POST methods for API routes
