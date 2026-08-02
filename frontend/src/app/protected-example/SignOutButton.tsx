"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Sign Out
    </button>
  );
}
