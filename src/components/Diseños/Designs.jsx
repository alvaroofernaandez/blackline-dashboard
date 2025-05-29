import { useDiseños } from "../../hooks/useDiseños";
import CardDiseño from "./DesignCard";

const TablaDiseños = () => {
  const { diseños, loading} = useDiseños();

  if (loading) return <p className="text-center">Cargando diseños...</p>;
  if (diseños.length === 0)
    return <p className="text-red-500 text-center">No hay diseños actualmente, añade un diseño</p>;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white text-neutral-600">
        Listado de Diseños
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fade-in-right">
        {diseños.map((diseño) => (
          <CardDiseño key={diseño.id} {...diseño} />
        ))}
      </div>
    </div>
  );
};

export default TablaDiseños;
