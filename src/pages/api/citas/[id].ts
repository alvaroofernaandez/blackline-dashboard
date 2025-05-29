import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../../lib/config";

export const GET: APIRoute = async ({ params, cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const res = await fetch(`${API_BASE_URL}cita_por_id/${params.id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const res = await fetch(`${API_BASE_URL}cita_por_id/${params.id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 204) {
    return new Response(null, {
      status: 204,
      headers: { "Content-Type": "application/json" },
    });
  }
  const responseData = await res.json().catch(() => ({}));
  return new Response(JSON.stringify(responseData), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};