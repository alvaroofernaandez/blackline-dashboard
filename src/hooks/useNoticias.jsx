import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useEffect, useRef, useState } from "react";
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
  const fetchedRef = useRef(false);

  const fetchNoticias = async (force = false) => {
    if (fetchedRef.current && !force) return; 
    setLoading(true);
    try {
      const res = await fetch(`/api/noticias`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const raw = await res.json();
      const validadas = raw.map((n) => {
        const result = noticiaSchema.safeParse(n);
        if (!result.success) {
          console.warn("Error validando noticia:", n, result.error);
          return {
            id: n.id,
            titulo: n.titulo || "Sin título",
            descripcion: n.descripcion || "Sin descripción",
            fecha: n.fecha || new Date().toISOString(),
            imagen_url: n.imagen_url || null,
            imagen_original_name: n.imagen_original_name || null,
          };
        }
        return result.data;
      });

      setNoticias(validadas);
      fetchedRef.current = true;
    } catch (err) {
      console.error("Error al cargar noticias:", err);
      toast.error("Error cargando noticias: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNoticiaPorId = async (id) => {
    const local = noticias.find((n) => n.id === id);
    if (local) return local;
    try {
      const res = await fetch(`/api/noticias/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar la noticia.");

      const data = await res.json();
      const noticia = Array.isArray(data) ? data[0] : data;
      const result = noticiaSchema.safeParse(noticia);
      if (!result.success) {
        toast.error("Los datos de la noticia están corruptos.");
        console.error("Validación fallida:", result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      console.error("Error al obtener noticia:", err);
      toast.error("No se pudo cargar la noticia.");
      return null;
    }
  };

  const crearNoticia = async (nuevaNoticia, isFormData = false) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
      if (!token) throw new Error("Token no encontrado");
      if (!isFormData) {
        if (!nuevaNoticia.titulo || !nuevaNoticia.descripcion) {
          toast.error("Título y descripción son obligatorios.");
          return false;
        }
        const validation = noticiaSchema.safeParse(nuevaNoticia);
        if (!validation.success) {
          validation.error.errors.forEach((err) => toast.error(err.message));
          return false;
        }
      }
      const headers = !isFormData
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { Authorization: `Bearer ${token}` };
      const body = isFormData ? nuevaNoticia : JSON.stringify(nuevaNoticia);

      const response = await fetch("/api/noticias/", {
        method: "POST",
        headers,
        body,
      });

      if (response.ok) {
        toast.success("Noticia creada con éxito.");
        fetchedRef.current = false; 
        setTimeout(() => {
          navigate("/noticias");
        }, 1200);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(
          "Error al crear la noticia: " +
            (errorData.non_field_errors
              ? errorData.non_field_errors.join(", ")
              : errorData.detail || "Error desconocido.")
        );
        return false;
      }
    } catch (err) {
      toast.error("Error al crear la noticia: " + err.message);
      return false;
    }
  };

  const actualizarNoticia = async (id, data, isFormData = false) => {
    try {
      const token = document.cookie 
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];
      if (!token) throw new Error("Token no encontrado");
      if (!isFormData) {
        const validation = noticiaSchema.safeParse(data);
        if (!validation.success) {
          validation.error.errors.forEach((err) => toast.error(err.message));
          return false;
        }
      }

      const headers = !isFormData ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : {};
      const body = isFormData ? data : JSON.stringify(data);

      const res = await fetch(`/api/noticias/${id}/`, {
        method: "PUT",
        headers,
        body,
      });

      if (res.ok) {
        toast.success("Noticia actualizada con éxito");
        fetchedRef.current = false; 
        setTimeout(() => {
          navigate("/noticias");
        }, 1200);
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
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
      const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];
      if (!token) throw new Error("Token no encontrado");
      const res = await fetch(`/api/noticias/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Noticia eliminada con éxito");
        setNoticias((prev) => prev.filter((n) => n.id !== id));
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
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

  return {
    noticias,
    loading,
    fetchNoticias,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    obtenerNoticiaPorId,
  };
};
