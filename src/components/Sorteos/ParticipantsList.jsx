import { useState, useEffect } from "react";
import { useSorteos } from "../../hooks/useSorteos";

const TablaParticipantes = ({ id }) => {
  const { obtenerSorteoPorId } = useSorteos();
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantes = async () => {
      setLoading(true);
      const sorteo = await obtenerSorteoPorId(id);
      if (sorteo) {
        setParticipantes(sorteo.participantes || []);
      } else {
        setParticipantes([]);
      }
      setLoading(false);
    };

    fetchParticipantes();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center">
        <button onClick={() => window.history.back()} className="text-white p-2 rounded" aria-label="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg>
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Cargando participantes...</p>
      ) : participantes.length === 0 ? (
        <p className="text-red-500 text-center mt-10">No hay participantes actualmente.</p>
      ) : (
        <div className="max-h-[700px] overflow-y-auto rounded-xl mt-10 animate-zoom-in">
          <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="dark:bg-neutral-800 bg-neutral-500 text-white sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">Instagram</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participantes.map((participante, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 text-gray-600">{participante.instagram_username || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaParticipantes;
