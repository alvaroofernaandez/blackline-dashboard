import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const usuarioSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  email: z.string().email("El correo debe ser válido"),
  role: z.string().min(1, "El rol es obligatorio"),
  instagram_username: z.string().nullable().optional(),
  can_receive_emails: z.boolean().optional(),
});

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("No autorizado o error en la carga");
      const raw = await res.json();
      const validados = raw.map((usuario) => usuarioSchema.parse(usuario));
      setUsuarios(validados);
    } catch (err) {
      toast.error("Error cargando usuarios: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuarioPorId = async (id) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`);
      if (!res.ok) throw new Error("Error al cargar el usuario.");
      const datos = await res.json();
      return usuarioSchema.parse(datos);
    } catch (err) {
      toast.error("No se pudo cargar el usuario.");
      return null;
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Usuario eliminado con éxito");
        setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
        return true;
      } else {
        toast.error("Error al eliminar el usuario");
        return false;
      }
    } catch (err) {
      toast.error("Error al eliminar el usuario");
      return false;
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    eliminarUsuario,
    obtenerUsuarioPorId,
  };
};
