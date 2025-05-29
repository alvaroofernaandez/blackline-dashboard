import { useAuthStore } from "../../stores/authStore";

export default function HomeLoginButton() {
  const { isLoggedIn, user, logout } = useAuthStore();
  
  return (
    <div className="flex items-center space-x-4 animate-fade-in-down animate-delay-200">
      {isLoggedIn ? (
        <>
          <span className="text-neutral-700 dark:text-neutral-300">
            Bienvenid@, {user?.username || "Usuario"}
          </span>
          <button
            type="button"
            aria-label="Cerrar sesión"
            onClick={logout}
            className="dark:bg-neutral-900 bg-neutral-700 p-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-all duration-300"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <a
          href="/login"
          className="dark:bg-neutral-900 bg-neutral-500 p-2 rounded-lg hover:bg-neutral-600 dark:hover:bg-neutral-800 transition-all duration-300"
        >
          Inicia sesión
        </a>
      )}
    </div>
  );
}