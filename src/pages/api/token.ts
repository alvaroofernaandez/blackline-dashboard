import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../lib/config";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return new Response("Tipo de contenido no soportado", { status: 415 });
  }

  const body = await request.json();

  const res = await fetch(`${API_BASE_URL}token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};