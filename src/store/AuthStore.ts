import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

// Create Zustand store
export const useAuthStore = create<AuthState>((set) => ({
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
    token: Cookies.get('auth_token') || null,

    login: (userData, token) => {
        Cookies.set('user', JSON.stringify(userData), { expires: 7, path: '/' });
        Cookies.set('auth_token', token, { expires: 7, path: '/' });

        set({ user: userData, token });
    },

    logout: () => {
        Cookies.remove('user');
        Cookies.remove('auth_token');

        set({ user: null, token: null });
    },
}));
