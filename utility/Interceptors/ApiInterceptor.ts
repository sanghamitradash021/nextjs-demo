// src/interceptors/apiInterceptors.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { toast } from 'react-hot-toast';

// Extend InternalAxiosRequestConfig to include metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    metadata?: any;
}

// Create base API instance
export const createApiClient = (baseURL: string = '/api'): AxiosInstance => {
    const api = axios.create({
        baseURL,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    api.interceptors.request.use(
        (config) => {
            // Add auth token from cookies
            const token = getCookie('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            (config as CustomAxiosRequestConfig).metadata = {};

            // Add request timestamp for performance monitoring
            (config as InternalAxiosRequestConfig & { metadata?: any }).metadata = {
                ...(config as CustomAxiosRequestConfig).metadata,
                requestTimestamp: new Date().getTime()
            };

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    api.interceptors.response.use(
        (response: AxiosResponse) => {
            // Add response timing data for performance monitoring
            const requestTimestamp = (response.config as CustomAxiosRequestConfig).metadata?.requestTimestamp;
            if (requestTimestamp) {
                const responseTime = new Date().getTime() - requestTimestamp;
                console.debug(`[API] ${response.config.url} - ${responseTime}ms`);
            }

            // Return the successful response
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            // Handle token expiration (401)
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Try to refresh the token
                    const refreshToken = getCookie('refresh_token');
                    if (refreshToken) {
                        const response = await axios.post('/api/auth/refresh-token', { refreshToken });
                        const { token } = response.data;

                        // Update stored token
                        setCookie('auth_token', token);

                        // Update header and retry request
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    deleteCookie('auth_token');
                    deleteCookie('refresh_token');
                    deleteCookie('user');

                    // Only redirect if in browser environment
                    if (typeof window !== 'undefined') {
                        toast.error('Your session has expired. Please log in again.');
                        window.location.href = '/login';
                    }
                }
            }

            // Handle rate limiting (429)
            if (error.response?.status === 429) {
                toast.error('Too many requests. Please try again later.');
            }

            // Handle server errors (500)
            if (error.response?.status && error.response.status >= 500) {
                toast.error('Server error. Our team has been notified.');
                // Here you could add server-side logging
            }

            return Promise.reject(error);
        }
    );

    return api;
};

// Default API client instance
export const apiClient = createApiClient();

// Recipe-specific API methods
export const recipeApi = {
    getAll: () => apiClient.get('/recipes'),
    getById: (id: string) => apiClient.get(`/recipes/${id}`),
    getByUser: (userId: string) => apiClient.get(`/recipes/user/${userId}`),
    getByCuisine: (cuisine: string) => apiClient.get(`/recipes/cuisine/${cuisine}`),
    getByMealType: (mealType: string) => apiClient.get(`/recipes/meal-type/${mealType}`),
    create: (recipeData: any) => apiClient.post('/recipes', recipeData),
    update: (id: string, recipeData: any) => apiClient.put(`/recipes/${id}`, recipeData),
    delete: (id: string) => apiClient.delete(`/recipes/${id}`),
    like: (id: string) => apiClient.post(`/recipes/${id}/like`),
    unlike: (id: string) => apiClient.post(`/recipes/${id}/unlike`),
    addComment: (id: string, comment: string) => apiClient.post(`/recipes/${id}/comments`, { comment }),
};