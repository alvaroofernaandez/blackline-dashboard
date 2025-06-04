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

  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
    if (cookieName === name) {
      const cookieValue = cookieValueParts.join('='); 
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const setCookie = (name: string, value: string, days: number): void => {
  if (typeof document === 'undefined') {

    return;
  }
  
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    
    document.cookie = cookieString;;
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
    
    if (user) {
      setCookie('accessToken', token, 7);

      setTimeout(() => {
        const savedCookie = getCookie('accessToken');
      }, 10);
      
      set({ 
        isLoggedIn: true, 
        token, 
        user,
        isHydrated: true 
      });
    } else {
      console.error('Invalid token received - could not decode user');
      set({ isLoggedIn: false, token: null, user: null });
    }
  },

  logout: () => {
    removeCookie('accessToken');
    set({ isLoggedIn: false, token: null, user: null });
  },

  hydrate: () => {
    if (get().isHydrated) return;

    const token = getCookie('accessToken');
    
    if (token) {
      
      if (isTokenValid(token)) {
        const user = decodeToken(token);
        set({
          isHydrated: true,
          isLoggedIn: true,
          token,
          user,
        });
      } else {
        removeCookie('accessToken');
        set({
          isHydrated: true,
          isLoggedIn: false,
          token: null,
          user: null,
        });
      }
    } else {
      set({
        isHydrated: true,
        isLoggedIn: false,
        token: null,
        user: null,
      });
    }
  },
}));