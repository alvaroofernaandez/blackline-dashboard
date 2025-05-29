import type { APIRoute } from "astro";
import { API_BASE_URL } from "../../lib/config";
import { z } from "zod";

const facturaSchema = z.object({
  id: z.number().optional(),
  cliente: z.number().min(1, "El cliente es obligatorio."),
  cita: z.number().min(1, "La cita es obligatoria."),
  fecha_emision: z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
    message: "La fecha de emisión debe ser válida.",
  }),
  total: z.string().refine((total) => !isNaN(parseFloat(total)), {
    message: "El total debe ser un número válido.",
  }),
});

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const res = await fetch(`${API_BASE_URL}facturas/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  try {
    const validadas = data.map((factura: unknown) => facturaSchema.parse(factura));
    return new Response(JSON.stringify(validadas), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Error validando facturas", { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("accessToken")?.value;
  if (!token) return new Response("No autorizado", { status: 401 });

  const contentType = request.headers.get("content-type");
  const body = await (contentType?.includes("application/json") ? request.json() : request.formData());

  const validation = facturaSchema.safeParse(body);
  if (!validation.success) {
    return new Response(
      JSON.stringify({ errors: validation.error.errors.map((e) => e.message) }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await fetch(`${API_BASE_URL}facturas/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(contentType?.includes("application/json") && { "Content-Type": "application/json" }),
    },
    body: contentType?.includes("application/json") ? JSON.stringify(validation.data) : body,
  });

  const responseData = await res.json();
  return new Response(JSON.stringify(responseData), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};