import { create } from 'zustand';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  instagram_username: string | null;
  [key: string]: any;
};

type AuthState = {
  isHydrated: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > currentTime;
  } catch {
    return false;
  }
};

const decodeToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      instagram_username: payload.instagram_username || null,
    };
  } catch {
    return null;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  // Método más robusto para obtener cookies
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
    if (cookieName === name) {
      const cookieValue = cookieValueParts.join('='); // Por si el valor contiene '='
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const setCookie = (name: string, value: string, days: number): void => {
  if (typeof document === 'undefined') {
    console.warn('setCookie called in non-browser environment');
    return;
  }
  
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    
    console.log('Setting cookie:', name, 'with length:', value.length);
    console.log('Cookie string length:', cookieString.length);
    
    document.cookie = cookieString;
    console.log('Cookie set successfully');
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isHydrated: false,
  isLoggedIn: false,
  token: null,
  user: null,

  login: (token: string) => {
    console.log('Login function called with token:', token.substring(0, 50) + '...');
    
    const user = decodeToken(token);
    console.log('Decoded user from token:', user);
    
    if (user) {
      console.log('User is valid, setting cookie...');
      setCookie('accessToken', token, 7);
      
      // Verificar inmediatamente si la cookie se guardó
      setTimeout(() => {
        const savedCookie = getCookie('accessToken');
        console.log('Cookie verification:', savedCookie ? 'Cookie saved successfully' : 'Cookie NOT saved');
        console.log('All cookies after setCookie:', document.cookie);
      }, 10);
      
      set({ 
        isLoggedIn: true, 
        token, 
        user,
        isHydrated: true // Asegurar que esté hidratado después del login
      });
      console.log('Login state updated successfully');
    } else {
      console.error('Invalid token received - could not decode user');
      set({ isLoggedIn: false, token: null, user: null });
    }
  },

  logout: () => {
    removeCookie('accessToken');
    set({ isLoggedIn: false, token: null, user: null });
    console.log('Logout successful');
  },

  hydrate: () => {
    // Evitar hidratación múltiple
    if (get().isHydrated) return;
    
    // Debug: mostrar todas las cookies disponibles
    console.log('All cookies:', document.cookie);
    
    const token = getCookie('accessToken');
    console.log('Hydrating with token:', token ? `Found token (${token.length} chars)` : 'No token found');
    
    if (token) {
      console.log('Token starts with:', token.substring(0, 50) + '...');
      
      if (isTokenValid(token)) {
        const user = decodeToken(token);
        console.log('Token is valid, user:', user);
        set({
          isHydrated: true,
          isLoggedIn: true,
          token,
          user,
        });
      } else {
        console.log('Token found but is invalid or expired');
        removeCookie('accessToken');
        set({
          isHydrated: true,
          isLoggedIn: false,
          token: null,
          user: null,
        });
      }
    } else {
      console.log('No token found in cookies');
      set({
        isHydrated: true,
        isLoggedIn: false,
        token: null,
        user: null,
      });
    }
  },
}));