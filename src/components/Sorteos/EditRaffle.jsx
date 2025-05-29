import { useEffect, useState } from "react";
import { useSorteos } from "../../hooks/useSorteos";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const EditarSorteo = ({ id }) => {
  const { obtenerSorteoPorId, actualizarSorteo } = useSorteos();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_fin: "",
    estado: "",
    ganador: "",
    premios: [],
    participantes: [],
  });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchSorteo = async () => {
      const sorteo = await obtenerSorteoPorId(id);
      if (sorteo) {
        setFormData({
          ...sorteo,
          premios: Array.isArray(sorteo.premios) ? sorteo.premios : [],
        });
      }
    };

    if (id) fetchSorteo();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "premios" ? value.split("\n") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const success = await actualizarSorteo(id, formData);
    if (success) {
      setTimeout(() => {
        navigate("/sorteos");
      }, 1000);
    } else {
      setCargando(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20  animate-fade-in">
        <label htmlFor="titulo" className="block mb-2">
          Título:
        </label>
        <input
          type="text"
          value={formData.titulo}
          id="titulo"
          className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
          required
          onChange={handleChange}
        />

        <label htmlFor="descripcion" className="block mb-2">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
          required
          onChange={handleChange}
        ></textarea>

        <label htmlFor="fecha_fin" className="block mb-2">
          Fecha de fin:
        </label>
        <input
          type="date"
          id="fecha_fin"
          value={formData.fecha_fin ? formData.fecha_fin.split("T")[0] : ""}
          className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
          required
          onChange={handleChange}
        />

        <label htmlFor="premios" className="block mb-2">
          Premios (uno por línea):
        </label>
        <textarea
          id="premios"
          value={formData.premios.join("\n")}
          className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
          onChange={handleChange}
        ></textarea>

        <button
          type="submit"
          aria-label="Editar Sorteo"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 transition-all w-full"
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Editar Sorteo"}
        </button>
      </form>
    </div>
  );
};

export default EditarSorteo;
