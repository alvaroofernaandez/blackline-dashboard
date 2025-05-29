import { useState } from "react";
import Modal from "../General/Modal";
import { z } from "zod";
import { useDiseños } from "../../hooks/useDiseños";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const DiseñoSchema = z.object({
  id: z.number(),
  image: z.string().optional(),
  titulo: z.string(),
  descripcion: z.string(),
  precio: z.string().optional(),
  alto: z.number(),
  ancho: z.number(),
  duracion: z.number().optional(),
});

const CardDiseño = (props) => {
  const {
    id,
    image,
    titulo,
    descripcion,
    precio,
    alto,
    ancho,

    duracion,
  } = DiseñoSchema.parse(props);

  const [showModal, setShowModal] = useState(false);
  const { eliminarDiseño } = useDiseños();

  const handleEliminarDiseño = async (id) => {
    const success = await eliminarDiseño(id);
    if (success) {
      setShowModal(false);
      setTimeout(() => { navigate("/diseños"); }, 200);
    }
  };

  return (
    <div className="group relative dark:bg-neutral-900 bg-neutral-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 overflow-hidden shadow-lg transition-all duration-500 cursor-pointer after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:-translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-0">
      <img
        src={image}
        alt={titulo}
        className="w-40 h-40 object-contain rounded-full bg-[#abd373] p-2 transition-all duration-500 group-hover:-translate-y-2"
      />
      
      <h2 className="text-xl font-bold text-neutral-200 tracking-widest text-center group-hover:text-neutral-100">
        {titulo} ({alto} x {ancho} cm)
      </h2>

      <p className="text-neutral-300 text-sm text-center font-medium px-2 group-hover:text-neutral-200 transition-colors">
        {descripcion}
      </p>

      <p className="text-neutral-300 text-sm text-center font-medium px-2 group-hover:text-neutral-200 transition-colors">
        {duracion ? <strong>Duración:</strong> : "Duración: N/A"} {duracion} horas
      </p>

      <div className="flex flex-row justify-between items-center w-full mt-4 ">
        <p className="text-[#abd373] font-semibold">
          {precio} €
        </p>
        
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Editar diseño"
            onClick={() => (navigate(`/actualizar-diseño/${id}`))}
            className="bg-[#abd373] text-gray-900 font-bold py-2 px-4 rounded-lg text-sm hover:bg-[#d2ff85] transition-all duration-300"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen w-4 h-4"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
          </button>
          <button
            type="button"
            aria-label="Eliminar diseño"
            onClick={() => setShowModal(true)}
            className="bg-neutral-600 dark:bg-neutral-800 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-all duration-300"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2 w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          eliminarObjeto={handleEliminarDiseño}
          id={id}
        />
      )}
    </div>
  );
};

export default CardDiseño;
