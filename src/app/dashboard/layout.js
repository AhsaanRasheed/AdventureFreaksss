import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
console.log("session", session); // Debugging line

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
