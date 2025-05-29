import { format } from "date-fns";
import { useState } from "react";
import Modal from "../General/Modal";
import { useNoticias } from "../../hooks/useNoticias";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const TablaNoticias = () => {
  const { noticias, loading, eliminarNoticia } = useNoticias();
  const [showModal, setShowModal] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const abrirModal = (id) => {
    setIdSeleccionado(id);
    setShowModal(true);
  };

  const formatearFecha = (fecha) =>
    format(new Date(fecha), "dd 'de' MMMM 'de' yyyy");

  if (loading) return <p className="text-center">Cargando noticias...</p>;
  if (noticias.length === 0)
    return <p className="text-red-500 text-center">No hay noticias actualmente</p>;

  return (
    <div className="w-full mx-auto">
      <h2 className="text-2xl font-semibold dark:text-white text-neutral-600 mb-4 text-center">Lista de Noticias</h2>
      <div className="max-h-[700px] overflow-y-auto rounded-xl animate-zoom-in duration-300">
        <table className="w-full border border-gray-200 shadow-lg rounded-lg overflow-hidden ">
          <thead className="bg-neutral-500 dark:bg-neutral-950 text-white sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left border dark:border-neutral-700 border-neutral-400">Título</th>
              <th className="p-3 text-left border dark:border-neutral-700 border-neutral-400">Descripción</th>
              <th className="p-3 text-left border dark:border-neutral-700 border-neutral-400">Fecha</th>
              <th className="p-3 text-left border dark:border-neutral-700 border-neutral-400">Imagen</th>
              <th className="p-3 text-center border dark:border-neutral-700 border-neutral-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {noticias.map((fila, index) => (
              <tr
                key={fila.id}
                className={`hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="p-3 border text-gray-700">{fila.titulo}</td>
                <td className="p-3 border text-gray-600 truncate max-w-xs">{fila.descripcion}</td>
                <td className="p-3 border text-gray-600">{formatearFecha(fila.fecha)}</td>
                <td className="p-3 border">
                  <img
                    src={fila.imagen_url}
                    alt="Imagen de noticia"
                    className="max-w-full h-auto rounded-lg border"
                    style={{ maxHeight: "40px", objectFit: "contain" }}
                  />
                </td>
                <td className="flex gap-3 justify-center items-center p-2">
                  <button
                    type="button"
                    aria-label="Editar noticia"
                    className="bg-neutral-400 size-10 hover:scale-105 transition-all duration-500 text-white rounded-lg justify-items-center"
                    onClick={() => navigate(`/actualizar-noticia/${fila.id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen w-4 h-4"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Eliminar noticia"
                    className="bg-neutral-600 dark:bg-neutral-800 size-10 hover:scale-105 transition-all duration-500 text-white rounded-lg justify-items-center"
                    onClick={() => abrirModal(fila.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2 w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          eliminarObjeto={eliminarNoticia}
          id={idSeleccionado}
        />
      )}
    </div>
  );
};

export default TablaNoticias;
