import { useEffect, useState } from "react";
import { useDiseños } from "../../hooks/useDiseños";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const EditarDiseño = ({ id }) => {
  const { obtenerDiseñoPorId, actualizarDiseño } = useDiseños();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    alto: "",
    ancho: "",
    duracion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const obtenerDiseño = async () => {
    const diseño = await obtenerDiseñoPorId(id);
    if (diseño) {
      setFormData({
        titulo: diseño.titulo || "",
        descripcion: diseño.descripcion || "",
        precio: diseño.precio || "",
        alto: diseño.alto?.toString() || "",
        ancho: diseño.ancho?.toString() || "",
        duracion: diseño.duracion?.toString() || "",
      });
    }
  };

  useEffect(() => {
    if (id) {
      obtenerDiseño();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const diseño = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      precio: formData.precio.trim(),
      alto: parseFloat(formData.alto),
      ancho: parseFloat(formData.ancho),
      duracion: formData.duracion ? parseFloat(formData.duracion) : 0,
    };

    const success = await actualizarDiseño(id, diseño);
    if (success) {
      navigate("/diseños");
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20">
        <label htmlFor="titulo" className="block mb-2">
          Título:
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
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
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        ></textarea>

        <label htmlFor="precio" className="block mb-2">
          Precio:
        </label>
        <input
          type="text"
          id="precio"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
        />

        <label htmlFor="alto" className="block mb-2">
          Alto (cm):
        </label>
        <input
          type="number"
          id="alto"
          name="alto"
          value={formData.alto}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="ancho" className="block mb-2">
          Ancho (cm):
        </label>
        <input
          type="number"
          id="ancho"
          name="ancho"
          value={formData.ancho}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <button
          type="submit"
          aria-label="Editar diseño"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 transition-all w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cargando..." : "Editar Diseño"}
        </button>
      </form>
    </div>
  );
};

export default EditarDiseño;
