import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options"; // Adjust the path as necessary
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
