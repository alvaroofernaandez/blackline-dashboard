import { createPortal } from "react-dom";

const Modal = ({ setShowModal, eliminarObjeto, id }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-300/10">
        <h2 className="text-xl font-semibold mb-4">¿Estás seguro de eliminar?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              eliminarObjeto(id);
              setShowModal(false);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
