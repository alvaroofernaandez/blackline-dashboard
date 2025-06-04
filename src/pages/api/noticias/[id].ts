import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../../lib/config";

export const GET: APIRoute = async ({ params, cookies }) => {
  const res = await fetch(`${API_BASE_URL}noticias_por_id/${params.id}/`);

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request, params, cookies }) => {
  const contentType = request.headers.get("content-type");
  const body = await (contentType?.includes("application/json") ? request.json() : request.formData());

  const res = await fetch(`${API_BASE_URL}noticias/${params.id}/`, {
    method: "PUT",
    headers: {
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

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const res = await fetch(`${API_BASE_URL}noticias/${params.id}/`, {
    method: "DELETE",
    headers: {
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
