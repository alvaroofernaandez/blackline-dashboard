import { useSorteos } from "../../hooks/useSorteos";
import { useCorreos } from "../../hooks/useCorreos"; 
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { format, isAfter, parseISO } from "date-fns";

const CrearSorteo = () => {
  const { crearSorteo } = useSorteos();
  const { enviarCorreosMasivos } = useCorreos();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_fin: "",
    premios: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setCargando(true);

    const sorteo = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      fecha_inicio: format(new Date(), "yyyy-MM-dd") + " 00:00:00",
      fecha_fin: formData.fecha_fin + " 23:59:00",
      estado: "activo",
      premios: formData.premios
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
    };

    const sorteoSchema = z.object({
      titulo: z.string().min(1, "El título es obligatorio."),
      descripcion: z.string().min(1, "La descripción es obligatoria."),
      fecha_inicio: z.string(),
      fecha_fin: z.string().refine(
        (fecha_fin) => isAfter(parseISO(fecha_fin), new Date()),
        { message: "La fecha de fin debe ser posterior a la fecha actual." }
      ),
      estado: z.string(),
      premios: z.array(z.string()),
    });

    try {
      sorteoSchema.parse(sorteo);
      const exito = await crearSorteo(sorteo);
      if (exito) {
        const asunto = `Nuevo sorteo: ${sorteo.titulo}`;
        const mensaje = `¡Hola! Se ha creado un nuevo sorteo: ${sorteo.titulo}. Descripción: ${sorteo.descripcion}. Participa antes del ${formData.fecha_fin}.`;
        const nombre = "Sistema de Sorteos";

        const correoExito = await enviarCorreosMasivos({ asunto, mensaje, nombre });
        if (correoExito) {
          toast.success("Correos masivos enviados con éxito.");
        }

        setFormData({ titulo: "", descripcion: "", fecha_fin: "", premios: "" });
        setTimeout(() => setCargando(false), 1000);
      } else {
        setCargando(false);
      }
    } catch (error) {
      setCargando(false);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Error al crear el sorteo.");
      }
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={enviar} className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20 animate-fade-in">
        <label htmlFor="titulo" className="block mb-2">
          Título:
        </label>
        <input
          type="text"
          id="titulo"
          placeholder="Escribe el título aquí..."
          value={formData.titulo}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg text-black w-full mb-4"
          required
        />

        <label htmlFor="descripcion" className="block mb-2">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          placeholder="Escribe la descripción aquí..."
          onChange={handleChange}
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        ></textarea>

        <label htmlFor="fecha_fin" className="block mb-2">
          Fecha de fin:
        </label>
        <input
          type="date"
          id="fecha_fin"
          value={formData.fecha_fin}
          placeholder="Fecha de fin, formato: YYYY-MM-DD"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="premios" className="block mb-2">
          Premios (uno por línea):
        </label>
        <textarea
          id="premios"
          value={formData.premios}
          onChange={handleChange}
          placeholder="Escribe los premios aquí..."
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
        ></textarea>

        <button
          type="submit"
          aria-label="Crear Sorteo"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 transition-all w-full"
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Crear Sorteo"}
        </button>
      </form>
    </div>
  );
};

export default CrearSorteo;
