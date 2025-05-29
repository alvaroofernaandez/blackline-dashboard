import { useState, useEffect } from 'react';
import { navigate } from 'astro/virtual-modules/transitions-router.js';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';

const schema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

const InicioSesionUsuario = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoggedIn, user, hydrate, isHydrated } = useAuthStore(); 

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && isLoggedIn && user?.role === 'admin') {
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
  }, [isHydrated, isLoggedIn, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const data = { email, password };
    const validation = schema.safeParse(data);

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.detail || 'Email o contraseña incorrectos');
        setIsLoading(false);
        return;
      }


      login(result.access);
      

      setTimeout(() => {
        navigate('/');
      }, 9000);

    } catch (err) {
      setError(err.message || 'Error inesperado al iniciar sesión');
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700 dark:border-white"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-96 p-8 text-white">
          <div className="grid justify-center justify-items-center">
            <img
              src="/favicon.svg"
              alt="Logo"
              className="w-64 animate-zoom-in animate-delay-200"
            />
          </div>
          <input
            type="text"
            placeholder="Email"
            className="border border-neutral-400 p-2 mb-4 w-full bg-transparent rounded-md animate-fade-in-down animate-delay-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border border-neutral-400 p-2 mb-4 w-full bg-transparent rounded-md animate-fade-in-down animate-delay-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-7 bg-neutral-500 hover:bg-neutral-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-300 text-white p-2 rounded w-full animate-fade-in-down animate-delay-700 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InicioSesionUsuario;