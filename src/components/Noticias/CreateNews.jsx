import { useState } from "react";
import { format } from "date-fns";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useNoticias } from "../../hooks/useNoticias";
import { useCorreos } from "../../hooks/useCorreos";

const AnadirNoticia = () => {
  const { crearNoticia } = useNoticias();
  const { enviarCorreosMasivos } = useCorreos();
  const [cargando, setCargando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(archivo.type)) {
        alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WEBP)');
        return;
      }

      // Validar tamaño (10MB máximo)
      if (archivo.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 10MB permitido.');
        return;
      }

      setArchivoImagen(archivo);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target.result);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const limpiarImagen = () => {
    setArchivoImagen(null);
    setImagenPreview(null);
    // Limpiar el input file
    const inputFile = document.getElementById('imagen');
    if (inputFile) {
      inputFile.value = '';
    }
  };

  const enviar = async (e) => {
    e.preventDefault();
    setCargando(true);

    const formData = new FormData();
    formData.append('titulo', e.target.titulo.value);
    formData.append('descripcion', e.target.descripcion.value);
    formData.append('fecha', format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    
    if (archivoImagen) {
      formData.append('imagen', archivoImagen);
    }

    const exito = await crearNoticia(formData, true); // true indica que es FormData
    if (exito) {
      const asunto = `Nueva noticia: ${e.target.titulo.value}`;
      const mensaje = `Se ha publicado una nueva noticia: ${e.target.titulo.value}\n\nDescripción: ${e.target.descripcion.value}`;
      const nombre = "Administrador";

      enviarCorreosMasivos({ asunto, mensaje, nombre })
        .finally(() => {
          setTimeout(() => navigate("/noticias"), 1000);
        });
    } else {
      setCargando(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={enviar} className="max-w-[90%] md:max-w-[70%] lg:max-w-[30%] mx-auto mt-20 animate-fade-in">
        <label htmlFor="titulo" className="block mb-2">
          Título:
        </label>
        <input
          type="text"
          id="titulo"
          placeholder="Escribe el título..."
          name="titulo"
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        />

        <label htmlFor="descripcion" className="block mb-2">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          placeholder="Escribe la descripción..."
          className="border border-gray-300 rounded-lg text-black p-2 w-full mb-4"
          required
        ></textarea>

        <label htmlFor="imagen" className="block mb-2">
          Imagen:
        </label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept="image/*"
          onChange={manejarCambioImagen}
          className="border border-gray-300 bg-white rounded-lg text-gray-400 p-2 w-full mb-4"
        />

        {imagenPreview && (
          <div className="mb-4">
            <p className="text-sm dark:text-white mb-2">Vista previa:</p>
            <div className="relative inline-block">
              <img
                src={imagenPreview}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg"
              />
              <button
                type="button"
                onClick={limpiarImagen}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          aria-label="Enviar noticia"
          className="dark:bg-neutral-900 bg-neutral-600 text-white rounded-lg p-2 dark:hover:bg-neutral-950 hover:bg-neutral-500 transition-all mt-10 w-full"
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default AnadirNoticia;