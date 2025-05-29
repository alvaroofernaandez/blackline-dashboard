import { useState } from "react";
import Modal from "../General/Modal";
import { useUsuarios } from "../../hooks/useUsuarios";

const TablaUsuarios = () => {
  const { usuarios, loading, eliminarUsuario } = useUsuarios();
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const abrirModal = (id) => {
    setUsuarioSeleccionado(id);
    setShowModal(true);
  };

  const handleEliminarUsuario = async (id) => {
    const success = await eliminarUsuario(id);
    if (success) {
      setShowModal(false);
    }
  };

  if (loading) return <p className="text-center">Cargando usuarios...</p>;
  if (usuarios.length === 0)
    return <p className="text-red-500 text-center">No hay usuarios actualmente, añade un usuario</p>;

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-semibold dark:text-white text-neutral-600 mb-4 text-center">Lista de Usuarios</h2>
      <div className="max-h-[700px] overflow-y-auto rounded-xl animate-zoom-in duration-300">
        <table className="w-full border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <thead className="dark:bg-neutral-950 bg-neutral-500 text-white sticky top-0 z-10">
            <tr>
              <th className="p-3 border dark:border-neutral-700 border-neutral-400 text-left">Nombre de Usuario</th>
              <th className="p-3 border dark:border-neutral-700 border-neutral-400 text-left">Correo</th>
              <th className="p-3 border dark:border-neutral-700 border-neutral-400 text-left">Rol</th>
              <th className="p-3 border dark:border-neutral-700 border-neutral-400 text-left">Instagram</th>
              <th className="p-3 border dark:border-neutral-700 border-neutral-400 text-left">Recibe Correos</th>
              <th className="p-3 border dark:border-neutral-700 border-neutral-400 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {usuarios.map((fila, index) => (
              <tr
                key={fila.id}
                className={`hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="p-3 border text-gray-700">{fila.username}</td>
                <td className="p-3 border text-gray-600">{fila.email}</td>
                <td className="p-3 border text-gray-600">{fila.role}</td>
                <td className="p-3 border text-gray-600">{fila.instagram_username || "N/A"}</td>
                <td className="p-3 border text-gray-600">{fila.can_receive_emails ? "Sí" : "No"}</td>
                <td className="flex gap-3 justify-center items-center p-1">
                  <button
                    type="button"
                    aria-label="Eliminar usuario"
                    className="dark:bg-neutral-800 bg-neutral-600 size-10 justify-items-center hover:scale-105 transition-all duration-500 text-white rounded-lg"
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
          eliminarObjeto={handleEliminarUsuario}
          id={usuarioSeleccionado}
        />
      )}
    </div>
  );
};

export default TablaUsuarios;
