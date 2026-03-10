import { redirect } from "next/navigation";

import { getSessionFromCookies } from "@/lib/auth";

export async function requireAdminPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");
  return session;
}
