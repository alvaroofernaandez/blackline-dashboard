import { useSorteos } from "../../hooks/useSorteos";
import CardSorteo from "./RaffleCard";

const TablaSorteos = () => {
  const { sorteos, loading} = useSorteos();

  if (loading) return <p className="text-center">Cargando sorteos...</p>;
  if (sorteos.length === 0)
    return <p className="text-red-500 text-center">No hay sorteos actualmente, añade un sorteo</p>;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white text-neutral-600">
        Listado de Sorteos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-right">
        {sorteos.map((sorteo) => (
          <CardSorteo key={sorteo.id} {...sorteo} />
        ))}
      </div>
    </div>
  );
};

export default TablaSorteos;
