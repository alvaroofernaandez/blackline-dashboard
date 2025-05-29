import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../lib/config";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const res = await fetch(`${API_BASE_URL}citas/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};