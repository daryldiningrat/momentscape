import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Momentscape</h1>
      <p>Welcome to the full-stack monorepo.</p>

      {session ? (
        <div style={{ marginTop: "2rem" }}>
          <p>
            Signed in as <strong>{session.user?.email}</strong>
          </p>
          <nav style={navStyle}>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          <SignOutButton />
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <nav style={navStyle}>
            <Link href="/login">Sign In</Link>
            <Link href="/signup">Create Account</Link>
          </nav>
        </div>
      )}
    </main>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
};
