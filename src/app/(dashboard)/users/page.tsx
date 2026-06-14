import { getAllUsers } from "@/app/actions/userActions";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: Awaited<ReturnType<typeof getAllUsers>> = [];
  try {
    users = await getAllUsers();
  } catch (err) {
    console.warn("[users] DB unavailable:", err instanceof Error ? err.message : err);
  }

  return <UsersClient users={users} />;
}
