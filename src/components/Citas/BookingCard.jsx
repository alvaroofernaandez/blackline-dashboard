import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Modal from "../General/Modal";
import { useCitas } from "../../hooks/useCitas";
import { useFacturas } from "../../hooks/useFacturas";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { toast } from "sonner";

const BookingCard = ({ id, design, fecha, hora, estado, descripcion, solicitante }) => {
  const { eliminarCita, obtenerNombreSolicitante, obtenerRangoHora } = useCitas();
  const { crearFactura } = useFacturas(); 
  const [showModal, setShowModal] = useState(false);

  const formatDate = (fecha) =>
    format(new Date(fecha), "dd/MM/yyyy", { locale: es });

  const handleEliminarCita = async (id) => {
    const success = await eliminarCita(id);
    if (success) {
      setShowModal(false);
      setTimeout(() => {
        navigate("/citas");
      }, 200);
    }
  };

  const handleCrearFactura = async () => {
    const factura = {
      cliente: solicitante,
      cita: id,
      fecha_emision: new Date().toISOString(),
      total: "0.00", 
    };

    const success = await crearFactura(factura);
    if (success) {
      toast.loading("Factura creada con éxito, redirigiendo a facturas...");
      setTimeout(() => {
        navigate("/facturas");
      }, 1800);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br border border-neutral-600/50 from-neutral-600 to-neutral-500 dark:from-neutral-900 dark:to-neutral-800 hover:-translate-y-1 shadow-lg transition-transform duration-300 text-white rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Cita #{id}</h2>
        <p className="text-sm text-gray-400">{descripcion}</p>
        <div className="text-sm text-gray-400">
          <p>
            Fecha:{" "}
            <span className="text-gray-200">{formatDate(fecha)}</span>
          </p>
          <p>
            Hora: <span className="text-gray-200">{obtenerRangoHora(hora)}</span>
          </p>
          <p>
            Estado:{" "}
            <span className="text-green-400 font-extrabold">{estado}</span>
          </p>
          <p>
            Solicitante:{" "}
            <span className="text-gray-200">
              {obtenerNombreSolicitante(solicitante)}
            </span>
          </p>
          <p>
            Diseño:{" "}
            <span className="text-gray-200">
              {design ? `Diseño #${design}` : "No asignado"}
            </span>
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            aria-label="Realizar factura"
            onClick={handleCrearFactura} 
            className="flex-1 bg-red-500 hover:bg-red-600 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-plus2-icon lucide-file-plus-2 w-4 h-4"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M6 12v6"/></svg>
          </button>
          <button
            type="button"
            aria-label="Eliminar cita"
            onClick={() => setShowModal(true)}
            className="flex-1 bg-neutral-700 hover:bg-neutral-600 transition-colors duration-300 text-white py-2 rounded-md flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2 w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          eliminarObjeto={handleEliminarCita}
          id={id}
          fullScreen={true} 
        />
      )}
    </>
  );
};

export default BookingCard;
