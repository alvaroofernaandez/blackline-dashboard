import { useState } from "react";
import Modal from "../General/Modal";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useSorteos } from "../../hooks/useSorteos";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const SorteoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  estado: z.string(),
  ganador: z.string().nullable(),
  premios: z.array(z.string()).optional(),
  participantes: z.array(z.any()).optional(),
});

const CardSorteo = (props) => {
  const {
    id,
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    ganador,
    premios = [],
    participantes = [],
  } = SorteoSchema.parse(props);

  const { eliminarSorteo, seleccionarGanador } = useSorteos();
  const [showModal, setShowModal] = useState(false);
  const formatDate = (fecha) =>
    format(new Date(fecha), "dd/MM/yyyy", { locale: es });

  const handleEliminarSorteo = async () => {
    const success = await eliminarSorteo(id);
    if (success) window.location.reload();
  };

const handleSeleccionarGanador = async () => {
  seleccionarGanador(id);
};

  return (
    <>
      <div className="bg-gradient-to-br from-neutral-600 to-neutral-500 dark:from-neutral-900 dark:to-neutral-800 hover:-translate-y-1 shadow-lg transition-transform duration-300 text-white rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-3xl font-semibold">{titulo}</h2>
        <p className="text-sm text-gray-400">{descripcion}</p>
        <div className="text-sm text-gray-400">
          <p>Inicio: <span className="text-gray-200">{formatDate(fecha_inicio)}</span></p>
          <p>Fin: <span className="text-gray-200">{formatDate(fecha_fin)}</span></p>
          <p>Estado: <span className="text-green-400 font-extrabold">{estado}</span></p>
          <p>Ganador: <span className="text-green-400 font-extrabold">{ganador || "Pendiente"}</span></p>
          <p>Premios: <span className="text-gray-200">{premios.length || "Ninguno"}</span></p>
          <p>Participantes: <span className="text-gray-200">{participantes.length}</span></p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            aria-label="Editar sorteo"
            onClick={() => navigate(`/actualizar-sorteo/${id}`)}
            className="flex-1 bg-neutral-500 hover:bg-neutral-400 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen w-4 h-4"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
          </button>
          <button
            type="button"
            aria-label="Eliminar sorteo"
            onClick={() => setShowModal(true)}
            className="flex-1 bg-neutral-700 hover:bg-neutral-600 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2 w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
          <button
            type="button"
            aria-label="Ver participantes"
            onClick={() => navigate(`/participantes-sorteo/${id}`)}
            className="flex-1 bg-blue-500 hover:bg-blue-400 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round-icon lucide-users-round w-4 h-4"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
          </button>
          <button
            type="button"
            aria-label="Seleccionar ganador"
            onClick={handleSeleccionarGanador}
            className="flex-1 bg-green-600 hover:bg-green-500 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown-icon lucide-crown w-4 h-4"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
          </button>
          <button
            onClick={() => navigate(`/asignar-premio/${id}`)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award-icon lucide-award w-4 h-4"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          eliminarObjeto={handleEliminarSorteo}
          id={id}
        />
      )}
    </>
  );
};

export default CardSorteo;
