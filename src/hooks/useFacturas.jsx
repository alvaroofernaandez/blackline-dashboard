import { useEffect, useState } from "react";
import { toast } from "sonner";
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

export const useFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacturas = async () => {
    try {
      const res = await fetch("/api/facturas");
      if (!res.ok) throw new Error("No autorizado o error en la API");
      const raw = await res.json();
      setFacturas(raw);
    } catch (err) {
      toast.error("Error cargando facturas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerFacturaPorId = async (id) => {
    try {
      const res = await fetch(`/api/detalle_facturas/?id=${id}`);
      if (!res.ok) throw new Error("No autorizado o error en la API");
      window.open(`/api/detalle_facturas/?id=${id}`, "_blank");
    } catch (err) {
      toast.error("No se pudo obtener la factura.");
      return null;
    }
  };

  const crearFactura = async (factura) => {
    try {
      const validation = facturaSchema.safeParse(factura);
      if (!validation.success) {
        const errorMessages = validation.error.errors.map((err) => err.message);
        errorMessages.forEach((msg) => toast.error(msg));
        return false;
      }

      const res = await fetch("/api/facturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (res.ok) {
        fetchFacturas();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(
          errorData?.errors?.join(", ") ||
            errorData?.message ||
            "Error al crear la factura"
        );
        return false;
      }
    } catch (err) {
      toast.error("Error al crear la factura: " + err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return {
    facturas,
    loading,
    crearFactura,
    obtenerFacturaPorId,
  };
};
