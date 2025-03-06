import { create } from 'zustand';
import Cookies from 'js-cookie';

/**
 * Represents the structure of a user.
 * @interface User
 */

interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
}


/**
 * Represents the state of the authentication store.
 * @interface AuthState
 */



interface AuthState {
    user: User | null;
    token: string | null;

    /**
     * Logs in a user and sets the user data and token.
     * @param {User} userData - The user data to be stored.
     * @param {string} token - The authentication token to be stored.
     */

    login: (userData: User, token: string) => void;

    /**
     * Logs out the user by clearing the user data and token.
     */

    logout: () => void;
}

// Create Zustand store
/**
 * A Zustand store to manage user authentication state.
 * @returns {AuthState} The authentication state and actions for login and logout.
 */

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
