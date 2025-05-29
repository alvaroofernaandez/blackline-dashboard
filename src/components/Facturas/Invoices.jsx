import { useFacturas } from "../../hooks/useFacturas";
import InvoiceCard from "./InvoiceCard";

const TablaFacturas = () => {
  const { facturas, loading } = useFacturas();

  if (loading) return <p className="text-center">Cargando facturas...</p>;
  if (facturas.length === 0)
    return <p className="text-red-500 text-center">No hay facturas actualmente</p>;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white text-neutral-600">
        Listado de Facturas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fade-in-right">
        {facturas.map((factura) => (
          <InvoiceCard key={factura.id} id={factura.id} cita={factura.cita} />
        ))}
      </div>
    </div>
  );
};

export default TablaFacturas;