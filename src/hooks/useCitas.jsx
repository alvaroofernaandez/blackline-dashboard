import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useUsuarios } from "./useUsuarios";

const citaSchema = z.object({
  id: z.number().optional(),
  design: z.number().nullable().optional(),
  fecha: z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
    message: "La fecha debe ser válida.",
  }),
  hora: z.enum(["1", "2", "3", "4"], {
    message: "La hora debe ser un valor entre 1 y 4.",
  }),
  estado: z.string().min(1, "El estado es obligatorio."),
  descripcion: z.string().optional(),
  solicitante: z.number().min(1, "El solicitante debe ser un número positivo."),
});

export const useCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarios } = useUsuarios();

  const fetchCitas = async () => {
    try {
      const res = await fetch("/api/citas");
      if (!res.ok) throw new Error("Error al cargar citas");
      const raw = await res.json();
      const validadas = raw.map((cita) => citaSchema.parse(cita));
      setCitas(validadas);
    } catch (err) {
      toast.error("Error cargando citas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerRangoHora = (hora) => {
    const rangos = {
      "1": "09:00 - 11:00",
      "2": "11:00 - 13:00",
      "3": "15:00 - 17:00",
      "4": "17:00 - 19:00",
    };
    return rangos[hora] || "Hora no válida";
  };

  const obtenerNombreSolicitante = (solicitanteId) => {
    const usuario = usuarios.find((user) => user.id === solicitanteId);
    return usuario ? usuario.username : "Desconocido";
  };

  const obtenerCitaPorId = async (id) => {
    try {
      const res = await fetch(`/api/citas/${id}`);
      if (!res.ok) throw new Error("Error al cargar la cita.");
      const datos = await res.json();
      return citaSchema.parse(datos);
    } catch (err) {
      toast.error("No se pudo cargar la cita.");
      return null;
    }
  };

  const eliminarCita = async (id) => {
    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Cita eliminada con éxito");
        setCitas((prev) => prev.filter((cita) => cita.id !== id));
        return true;
      } else {
        toast.error("Error al eliminar la cita");
        return false;
      }
    } catch (err) {
      toast.error("Error al eliminar la cita");
      return false;
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return {
    citas,
    loading,
    eliminarCita,
    obtenerCitaPorId,
    obtenerNombreSolicitante,
    obtenerRangoHora,
  };
};

