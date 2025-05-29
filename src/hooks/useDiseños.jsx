import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const diseñoSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(1, "El título es obligatorio."),
  descripcion: z.string().min(1, "La descripción es obligatoria."),
  precio: z.string().optional(),
  image: z.string().optional(),
  alto: z.number().min(1, "El alto debe ser un número positivo."),
  ancho: z.number().min(1, "El ancho debe ser un número positivo."),
  duracion: z.number().min(1, "La duración debe ser un número positivo."), 
});

export const useDiseños = () => {
  const [diseños, setDiseños] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiseños = async () => {
    try {
      const res = await fetch(`/api/diseños`);
      if (!res.ok) throw new Error("No autorizado o error en la carga");
      const raw = await res.json();
      const validados = raw.map((diseño) => diseñoSchema.parse(diseño));
      setDiseños(validados);
    } catch (err) {
      toast.error("Error cargando diseños: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerDiseñoPorId = async (id) => {
    try {
      const res = await fetch(`/api/diseños/${id}`);
      if (res.ok) {
        const datos = await res.json();
        return diseñoSchema.parse(datos);
      } else {
        throw new Error("Error al cargar el diseño.");
      }
    } catch (err) {
      toast.error("No se pudo cargar el diseño.");
      return null;
    }
  };

  const crearDiseño = async (diseño) => {
    try {
      let body = diseño;
      let headers = {};

      if (!(diseño instanceof FormData)) {
        const validation = diseñoSchema.safeParse(diseño);
        if (!validation.success) {
          const errorMessages = validation.error.errors.map((err) => err.message);
          errorMessages.forEach((msg) => toast.error(msg));
          return false;
        }
        body = JSON.stringify(validation.data);
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`/api/diseños`, {
        method: "POST",
        headers,
        body,
      });

      if (res.ok) {
        toast.success("Diseño creado con éxito");
        fetchDiseños();
        setTimeout(() => {
          navigate("/diseños");
        }, 800);  
        return true;
      } else {
        const errorData = await res.json();
        console.error("Error detalle:", errorData);
        toast.error("Error al crear el diseño");
        return false;
      }
    } catch (err) {
      toast.error("Error al crear el diseño: " + err.message);
      return false;
    }
  };

  const actualizarDiseño = async (id, diseño) => {
    try {
      const validation = diseñoSchema.safeParse(diseño);
      if (!validation.success) {
        const errorMessages = validation.error.errors.map((err) => err.message);
        errorMessages.forEach((msg) => toast.error(msg));
        return false;
      }

      const res = await fetch(`/api/diseños/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (res.ok) {
        toast.success("Diseño actualizado con éxito");
        fetchDiseños();
        setTimeout(() => {
          navigate("/diseños");
        }, 800);  
        return true;
      } else {
        toast.error("Error al actualizar el diseño");
        return false;
      }
    } catch (err) {
      toast.error("Error al actualizar el diseño: " + err.message);
      return false;
    }
  };

  const eliminarDiseño = async (id) => {
    try {
      const res = await fetch(`/api/diseños/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Diseño eliminado con éxito");
        setDiseños((prev) => prev.filter((diseño) => diseño.id !== id));
        return true;
      } else {
        toast.error("Error al eliminar el diseño");
        return false;
      }
    } catch (err) {
      toast.error("Error al eliminar el diseño");
      return false;
    }
  };

  useEffect(() => {
    fetchDiseños();
  }, []);

  return {
    diseños,
    loading,
    crearDiseño,
    actualizarDiseño,
    eliminarDiseño,
    obtenerDiseñoPorId,
  };
};
