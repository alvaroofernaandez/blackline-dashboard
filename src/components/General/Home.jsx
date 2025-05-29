import { useCitas } from "../../hooks/useCitas";
import { useSorteos } from "../../hooks/useSorteos";
import { useNoticias } from "../../hooks/useNoticias";
import HomeLoginButton from "../General/HomeLoginButton";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const Home = () => {
  const { citas, loading: loadingCitas, obtenerNombreSolicitante } = useCitas();
  const { sorteos, loading: loadingSorteos } = useSorteos();
  const { noticias, loading: loadingNoticias } = useNoticias();

  const handleNavigate = (path) => navigate(path);

  const Card = ({ title, children, path }) => (
    <div className="dark:bg-neutral-900 animate-slide-in-top duration-300 bg-white rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-neutral-500 dark:text-white">{title}</h3>
        <div className="grid gap-4 justify-center lg:justify-start grid-cols-[repeat(auto-fit,minmax(250px,max-content))]">
          {children}
        </div>
      </div>
      <button
        onClick={() => handleNavigate(path)}
        className="mt-6 px-4 py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-400 text-white rounded-md hover:bg-neutral-500 transition"
      >
        Ver más
      </button>
    </div>
  );

  const SorteoMiniCard = ({ sorteo }) => (
    <div className="dark:bg-neutral-950 bg-neutral-100 animate-blurred-fade-in hover:scale-105 transition-transform duration-300 shadow-lg shadow-neutral-300 dark:shadow-neutral-800 p-4 rounded-xl">
      <h4 className="text-lg font-bold dark:text-white text-gray-700">{sorteo.titulo}</h4>
      <p className="text-sm dark:text-gray-300 text-gray-500">{sorteo.descripcion}</p>
      <p className="text-xs mt-2 text-gray-400">
        {new Date(sorteo.fecha_inicio).toLocaleDateString()} - {new Date(sorteo.fecha_fin).toLocaleDateString()}
      </p>
      <p className="text-xs mt-1 text-gray-400">Estado: <strong className="text-green-400">{sorteo.estado}</strong></p>
    </div>
  );

  const CitaMiniCard = ({ cita }) => (
    <div className="dark:bg-neutral-950 bg-neutral-100 animate-blurred-fade-in hover:scale-105 transition-transform duration-300 shadow-lg shadow-neutral-300 dark:shadow-neutral-800 p-4 rounded-xl">
      <h4 className="text-lg font-bold dark:text-white text-gray-700">Cita #{cita.id}</h4>
      <p className="text-sm dark:text-gray-300 text-gray-500">
        <strong>Solicitante: </strong>{obtenerNombreSolicitante(cita.solicitante)}
      </p>
      <p className="text-xs mt-2 text-gray-400">
        Fecha: {new Date(cita.fecha).toLocaleDateString()} - Hora: {cita.hora}
      </p>
      <p className="text-xs mt-1 text-gray-400">Estado: <strong className="text-green-400">{cita.estado}</strong></p>
    </div>
  );

  const NoticiaMiniCard = ({ noticia }) => {
    const truncateText = (text, maxLength) => {
      return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
      <div className="dark:bg-neutral-950 bg-neutral-100 animate-blurred-fade-in hover:scale-105 transition-transform duration-300 shadow-lg shadow-neutral-300 dark:shadow-neutral-800 p-4 rounded-xl">
        {noticia.imagen_url && (
          <img
            src={noticia.imagen_url}
            alt={noticia.titulo}
            className="w-full h-36 object-cover rounded mb-2"
            loading="eager"
          />
        )}
        <img
          src={noticia.imagen_url}
          alt={noticia.titulo}
          className="w-full h-36 object-cover rounded mb-2"
          loading="eager"
        />
        <h4 className="font-bold dark:text-white text-gray-700">
          {truncateText(noticia.titulo, 25)}
        </h4>
        <p className="text-sm dark:text-gray-300 text-gray-500">
          {truncateText(noticia.descripcion, 35)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(noticia.fecha).toLocaleDateString()}
        </p>
      </div>
    );
  };

  return (
    <div className="p-8 text-white ">  
      <div className="justify-center flex items-center mb-4">
        <HomeLoginButton client:only="react" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <Card title="Citas" path="/citas">
          {loadingCitas ? (
            <p>Cargando...</p>
          ) : (
            citas.slice(0, 2).map((c) => (
              <CitaMiniCard key={c.id} cita={c} />
            ))
          )}
        </Card>
        <Card title="Sorteos" path="/sorteos">
          {loadingSorteos ? (
            <p>Cargando...</p>
          ) : (
            sorteos.slice(0, 2).map((s) => (
              <SorteoMiniCard key={s.id} sorteo={s} />
            ))
          )}
        </Card>
      </div>

      <div> 
        <Card title="Noticias" path="/noticias">
          {loadingNoticias ? (
            <p>Cargando...</p>
          ) : (
            noticias.slice(0, 4).map((n) => (
              <NoticiaMiniCard key={n.id} noticia={n} />
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default Home;
