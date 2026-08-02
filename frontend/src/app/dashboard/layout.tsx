import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header style={headerStyle}>
        <Link href="/dashboard" style={logoStyle}>Momentscape</Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/dashboard/new" style={linkStyle}>+ New Project</Link>
          <span style={{ color: "#aaa", fontSize: "0.875rem" }}>{session.user?.email}</span>
          <SignOutButton />
        </nav>
      </header>
      <main style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  borderBottom: "1px solid #333",
  backgroundColor: "#111",
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#fafafa",
  textDecoration: "none",
};

const linkStyle: React.CSSProperties = {
  color: "#60a5fa",
  textDecoration: "none",
  fontSize: "0.875rem",
};
