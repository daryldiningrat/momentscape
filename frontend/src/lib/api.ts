const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
