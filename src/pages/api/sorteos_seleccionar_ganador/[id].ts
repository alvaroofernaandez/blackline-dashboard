import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../../lib/config";

export const PATCH: APIRoute = async ({ params, cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const res = await fetch(
    `${API_BASE_URL}sorteos_seleccionar_ganador/${params.id}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseData = await res.json();
  return new Response(JSON.stringify(responseData), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};