import { useState } from "react";
import { useCorreos } from "../../hooks/useCorreos";

const IndividualEmailForm = () => {
  const { enviarCorreoPersonalizado } = useCorreos();
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setCargando(true);

    const correoData = {
      nombre: e.target.nombre.value,
      correo: e.target.correo.value,
      asunto: e.target.asunto.value,
      mensaje: e.target.mensaje.value,
    };

    const exito = await enviarCorreoPersonalizado(correoData);
    if (exito) {
      e.target.reset();
    }
    setCargando(false);
  };

  return (
    <div className="p-4">
      <form
        onSubmit={enviar}
        className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20 animate-fade-in"
      >
        <label htmlFor="nombre" className="block mb-2">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Escribe el nombre..."
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="correo" className="block mb-2">
          Correo:
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          placeholder="Escribe el correo..."
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="asunto" className="block mb-2">
          Asunto:
        </label>
        <input
          type="text"
          id="asunto"
          name="asunto"
          placeholder="Escribe el asunto..."
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="mensaje" className="block mb-2">
          Mensaje:
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          placeholder="Escribe el mensaje..."
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        ></textarea>

        <button
          type="submit"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 transition-all mt-10 w-full"
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default IndividualEmailForm;
