import { useState } from "react";
import { useNoticias } from "../../hooks/useNoticias";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const ActualizarNoticia = ({ id }) => {
  const { actualizarNoticia, obtenerNoticiaPorId } = useNoticias();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (id && !formData.titulo) {
    obtenerNoticiaPorId(id).then((noticia) => {
      if (noticia) {
        setFormData(noticia);
      }
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actualizar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const exito = await actualizarNoticia(id, formData);
    if (exito) {
      setTimeout(() => {
        navigate("/noticias");
      }, 500);
    } else {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={actualizar} className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20 animate-fade-in">
        <label htmlFor="titulo" className="block mb-2">
          Título:
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
          required
        />

        <label htmlFor="descripcion" className="block mb-2">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
          required
        ></textarea>

        <button
          type="submit"
          aria-label="Actualizar noticia"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 w-full mt-10 transition-all"
          disabled={isSubmitting} 
        >
          {isSubmitting ? "Cargando..." : "Actualizar"} 
        </button>
      </form>
    </div>
  );
};

export default ActualizarNoticia;
