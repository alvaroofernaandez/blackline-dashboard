import { useFacturas } from "../../hooks/useFacturas";
import { z } from "zod";

const FacturaSchema = z.object({
  id: z.number(),
  cita: z.number().optional(),
});

const InvoiceCard = (props) => {
  const { id, cita } = FacturaSchema.parse(props);
  const { obtenerFacturaPorId } = useFacturas();

  const handleVerFactura = async () => {
    obtenerFacturaPorId(id);
  };

  const handleDescargarFactura = async () => {
    window.location.href = `/api/detalle_facturas?id=${id}&download=1`;
  };

  return (
    <div className="group relative dark:bg-neutral-900 bg-neutral-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 overflow-hidden shadow-lg transition-all duration-500 max-w-sm">
      <h2 className="text-xl font-bold text-neutral-200 tracking-widest text-center group-hover:text-neutral-100">
        Factura #{id} de la cita <a href="/citas" className="text-sky-300 underline">#{cita}</a>
      </h2>

      <div className="grid md:flex gap-4 mt-4">
        <button
          type="button"
          aria-label="Ver factura"
          onClick={handleVerFactura}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-400 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye h-4 w-4"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
          Ver
        </button>
        <button
          type="button"
          aria-label="Descargar factura"
          onClick={handleDescargarFactura}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-400 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line h-4 w-4"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
          Descargar
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;