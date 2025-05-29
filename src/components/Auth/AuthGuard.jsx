import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

const AuthGuard = () => {
  const { isLoggedIn, user, hydrate, isHydrated } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/login');
    }

    return () => clearTimeout(timer);
  }, [isHydrated, isLoggedIn, user]);

  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700 dark:border-white"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthGuard;