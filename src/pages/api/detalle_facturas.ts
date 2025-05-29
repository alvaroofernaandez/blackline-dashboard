import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../lib/config";

export const GET: APIRoute = async ({ url, cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });
  const id = url.searchParams.get("id");
  const download = url.searchParams.get("download");
  if (!id) return new Response("ID requerido", { status: 400 });

  try {
    const response = await fetch(`${API_BASE_URL}detalle_facturas/?id=${id}${download ? `&download=${download}` : ""}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Si es descarga, forzar Content-Disposition
    if (download) {
      const blob = await response.blob();
      return new Response(blob, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "application/pdf",
          "Content-Disposition": `attachment; filename="factura_${id}.pdf"`,
        },
      });
    }

    // Si no, mostrar HTML
    const html = await response.text();
    return new Response(html, {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err) {
    return new Response("Error al obtener la factura", { status: 500 });
  }
};