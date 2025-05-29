import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const noticiaSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  fecha: z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
    message: "La fecha debe ser válida",
  }),
  imagen_url: z.string().url("La URL de la imagen debe ser válida").optional().nullable(),
  imagen_original_name: z.string().optional(),
});

export const useNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNoticias = async () => {
    try {
      const res = await fetch(`/api/noticias`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const raw = await res.json();
      const validadas = raw.map((n) => {
        try {
          return noticiaSchema.parse(n);
        } catch (error) {
          console.error("Error validando noticia:", n, error);
          return {
            id: n.id,
            titulo: n.titulo || "Sin título",
            descripcion: n.descripcion || "Sin descripción",
            fecha: n.fecha || new Date().toISOString(),
            imagen_url: n.imagen_url || null,
            imagen_original_name: n.imagen_original_name || null,
          };
        }
      });
      setNoticias(validadas);
    } catch (err) {
      console.error("Error completo:", err);
      toast.error("Error cargando noticias: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNoticiaPorId = async (id) => {
    try {
      const respuesta = await fetch(`/api/noticias/${id}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        return datos;
      } else {
        throw new Error("Error al cargar la noticia.");
      }
    } catch (error) {
      toast.error("No se pudo cargar la noticia.");
      return null;
    }
  };

  const crearNoticia = async (data, isFormData = false) => {
    try {
      if (!isFormData) {
        const validation = noticiaSchema.safeParse(data);
        if (!validation.success) {
          const errorMessages = validation.error.errors.map((err) => err.message);
          errorMessages.forEach((msg) => toast.error(msg));
          return false;
        }
      }

      const headers = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`/api/noticias`, {
        method: "POST",
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Noticia creada con éxito");
        fetchNoticias();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error del servidor:", errorData);
        toast.error("Error al crear la noticia: " + (errorData.detail || res.statusText));
        return false;
      }
    } catch (err) {
      console.error("Error al crear noticia:", err);
      toast.error("Error al crear la noticia: " + err.message);
      return false;
    }
  };

  const actualizarNoticia = async (id, data, isFormData = false) => {
    try {
      if (!isFormData) {
        const validation = noticiaSchema.safeParse(data);
        if (!validation.success) {
          const errorMessages = validation.error.errors.map((err) => err.message);
          errorMessages.forEach((msg) => toast.error(msg));
          return false;
        }
      }

      const headers = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`/api/noticias/${id}`, {
        method: "PUT",
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Noticia actualizada con éxito");
        fetchNoticias();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error del servidor:", errorData);
        toast.error("Error al actualizar la noticia: " + (errorData.detail || res.statusText));
        return false;
      }
    } catch (err) {
      console.error("Error al actualizar noticia:", err);
      toast.error("Error al actualizar la noticia: " + err.message);
      return false;
    }
  };

  const eliminarNoticia = async (id) => {
    try {
      const res = await fetch(`/api/noticias/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success("Noticia eliminada con éxito");
        setNoticias((prev) => prev.filter((n) => n.id !== id));
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error del servidor:", errorData);
        toast.error("Error al eliminar la noticia: " + (errorData.detail || res.statusText));
        return false;
      }
    } catch (err) {
      console.error("Error al eliminar noticia:", err);
      toast.error("Error al eliminar la noticia: " + err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  return { noticias, loading, crearNoticia, actualizarNoticia, eliminarNoticia, obtenerNoticiaPorId };
};
