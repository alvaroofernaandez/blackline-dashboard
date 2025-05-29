import { useState } from "react";
import { useCorreos } from "../../hooks/useCorreos";

const MasiveEmailForm = () => {
  const { enviarCorreosMasivos } = useCorreos();
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setCargando(true);

    const emailData = {
      asunto: e.target.asunto.value,
      mensaje: e.target.mensaje.value,
    };

    const exito = await enviarCorreosMasivos(emailData);
    if (!exito) {
      setCargando(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={enviar} className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20 animate-fade-in">
        <label htmlFor="asunto" className="block mb-2">
          Asunto:
        </label>
        <input
          type="text"
          id="asunto"
          placeholder="Escribe el asunto..."
          name="asunto"
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="mensaje" className="block mb-2">
          Mensaje:
        </label>
        <textarea
          id="mensaje"
          placeholder="Escribe el mensaje..."
          name="mensaje"
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        ></textarea>

        <button
          type="submit"
          aria-label="Enviar correo masivo"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 transition-all mt-10 w-full"
          disabled={cargando}
        >
          {cargando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default MasiveEmailForm;