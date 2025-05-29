import { useCitas } from "../../hooks/useCitas";
import BookingCard from "./BookingCard";

const TablaCitas = () => {
  const { citas, loading } = useCitas();

  if (loading) return <p className="text-center">Cargando citas...</p>;
  if (citas.length === 0)
    return <p className="text-red-500 text-center">No hay citas actualmente, añade una cita</p>;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white text-neutral-600">
        Listado de Citas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-right">
        {citas.map((cita) => (
          <BookingCard key={cita.id} {...cita} />
        ))}
      </div>
    </div>
  );
};

export default TablaCitas;