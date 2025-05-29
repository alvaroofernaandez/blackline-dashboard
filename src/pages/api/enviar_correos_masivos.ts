import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../lib/config";

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const contentType = request.headers.get("content-type");
  const body = await (contentType?.includes("application/json") ? request.json() : request.formData());

  const res = await fetch(`${API_BASE_URL}enviar_correos_masivos/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(contentType?.includes("application/json") && { "Content-Type": "application/json" }),
    },
    body: contentType?.includes("application/json") ? JSON.stringify(body) : body,
  });

  const responseData = await res.json();
  return new Response(JSON.stringify(responseData), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};