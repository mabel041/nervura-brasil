import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user && (session.user as { role?: string }).role === "admin") {
    redirect("/admin");
  }

  return <LoginForm />;
}
