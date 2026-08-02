import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Protected Page</h1>
      <p>You are signed in as <strong>{session?.user?.email}</strong>.</p>
      <p>This page is only visible to authenticated users.</p>
      <SignOutButton />
    </main>
  );
}
