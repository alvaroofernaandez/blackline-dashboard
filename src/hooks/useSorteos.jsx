import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import confetti from "canvas-confetti";

const sorteoSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1, "El título es obligatorio."),
  descripcion: z.string().min(1, "La descripción es obligatoria."),
  fecha_inicio: z.string(),
  fecha_fin: z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
    message: "La fecha debe ser válida.",
  }),
  estado: z.string(),
  ganador: z.string().nullable(),
  premios: z.array(z.string()).optional(),
  participantes: z.array(z.any()).optional(),
});

export const useSorteos = () => {
  const [sorteos, setSorteos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSorteos = async () => {
    try {
      const res = await fetch("/api/sorteos");
      if (!res.ok) throw new Error("No autorizado o error de red");
      const raw = await res.json();
      const validados = raw.map((sorteo) => sorteoSchema.parse(sorteo));
      setSorteos(validados);
    } catch (err) {
      toast.error("Error cargando sorteos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerSorteoPorId = async (id) => {
    try {
      const res = await fetch(`/api/sorteos/${id}`);
      if (res.ok) {
        const datos = await res.json();
        return sorteoSchema.parse(datos);
      } else {
        throw new Error("Error al cargar el sorteo.");
      }
    } catch (err) {
      toast.error("No se pudo cargar el sorteo.");
      return null;
    }
  };

  const crearSorteo = async (nuevoSorteo) => {
    try {
      if (!nuevoSorteo.titulo || !nuevoSorteo.descripcion) {
        toast.error("Título y descripción son obligatorios.");
        return false;
      }
      const response = await fetch("/api/sorteos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoSorteo),
      });
      if (response.ok) {
        toast.success("Sorteo creado con éxito.");
        fetchSorteos();
        setTimeout(() => {
          navigate("/sorteos");
        }, 1000);
        return true;
      } else {
        const errorData = await response.json();
        toast.error(
          "Error al crear el sorteo: " +
            (errorData.non_field_errors
              ? errorData.non_field_errors.join(", ")
              : "Error desconocido.")
        );
        return false;
      }
    } catch (err) {
      toast.error("Error al crear el sorteo: " + err.message);
      return false;
    }
  };

  const actualizarSorteo = async (id, sorteo) => {
    try {
      const validation = sorteoSchema.safeParse(sorteo);
      if (!validation.success) {
        const errorMessages = validation.error.errors.map((err) => err.message);
        errorMessages.forEach((msg) => toast.error(msg));
        return false;
      }
      const res = await fetch(`/api/sorteos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      if (res.ok) {
        toast.success("Sorteo actualizado con éxito");
        fetchSorteos();
        return true;
      } else {
        toast.error("Error al actualizar el sorteo");
        return false;
      }
    } catch (err) {
      toast.error("Error al actualizar el sorteo: " + err.message);
      return false;
    }
  };

  const eliminarSorteo = async (id) => {
    try {
      const res = await fetch(`/api/sorteos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Sorteo eliminado con éxito");
        setSorteos((prev) => prev.filter((sorteo) => sorteo.id !== id));
        return true;
      } else {
        toast.error("Error al eliminar el sorteo");
        return false;
      }
    } catch (err) {
      toast.error("Error al eliminar el sorteo");
      return false;
    }
  };

  const asignarPremio = async (id, premio) => {
    try {
      const res = await fetch(`/api/sorteos_asignar_premio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premio }),
      });
      if (res.ok) {
        toast.success("Premio asignado con éxito");
        setTimeout(() => {
          navigate("/sorteos");
        }, 1000);
        fetchSorteos();
        return true;
      } else {
        toast.error("Error al asignar el premio");
        return false;
      }
    } catch (err) {
      toast.error("Error al asignar el premio: " + err.message);
      return false;
    }
  };

  const seleccionarGanador = async (id) => {
    try {
      const res = await fetch(`/api/sorteos_seleccionar_ganador/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        const { ganador } = await res.json();
        toast.success(`Ganador seleccionado con éxito: ${ganador}`);
        confetti({
          particleCount: 150,
          spread: 120,
          angle: 60,
          origin: { x: 0, y: 0.6 },
        });
        confetti({
          particleCount: 150,
          spread: 120,
          angle: 120,
          origin: { x: 1, y: 0.6 },
        });
        setTimeout(() => {
          navigate("/sorteos");
        }, 1200);
        fetchSorteos();
        return true;
      } else {
        toast.error("Error al seleccionar el ganador");
        return false;
      }
    } catch (err) {
      toast.error("Error al seleccionar el ganador: " + err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchSorteos();
  }, []);

  return {
    sorteos,
    loading,
    crearSorteo,
    actualizarSorteo,
    eliminarSorteo,
    obtenerSorteoPorId,
    asignarPremio,
    seleccionarGanador,
  };
};
