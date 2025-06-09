import { useState } from "react";
import { toast } from "sonner";
import { navigate } from "astro/virtual-modules/transitions-router.js";

export const useCorreos = () => {
  const [loading, setLoading] = useState(false);

  const enviarCorreosMasivos = async ({ asunto, mensaje, nombre }) => {
    try {
      setLoading(true);
      const token = document.cookie 
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch("/api/enviar_correos_masivos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asunto, mensaje, nombre }),
      });

      if (res.ok) {
        toast.success("Correos masivos enviados con éxito");
        navigate("/");
        return true;
      } else {
        const data = await res.json();
        toast.error(data?.detail || "Error al enviar correos masivos");
        return false;
      }
    } catch (err) {
      toast.error("Error al enviar correos masivos: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const enviarCorreoPersonalizado = async ({ correo, asunto, mensaje, nombre }) => {
    try {
      setLoading(true);
      const token = document.cookie 
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch("/api/enviar_correos_personalizados/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ correo, asunto, mensaje, nombre }),
      });

      if (res.ok) {
        toast.success("Correo personalizado enviado con éxito");
        navigate("/");
        return true;
      } else {
        const data = await res.json();
        toast.error(data?.detail || "Error al enviar correo personalizado");
        return false;
      }
    } catch (err) {
      toast.error("Error al enviar correo personalizado: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    enviarCorreosMasivos,
    enviarCorreoPersonalizado,
  };
};
