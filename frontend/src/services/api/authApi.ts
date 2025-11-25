// importa el archivo que registra los interceptores (ya importa axiosConfig)
import '@/lib/axios/interceptors';
import api from '@/lib/axios/axiosConfig';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types';
import { AxiosError } from 'axios';

const authApi = {
	async login(payload: LoginRequest): Promise<AuthResponse> {
		try {
			const res = await api.post<AuthResponse>('/v1/auth/login', payload);
			return res.data;
		} catch (error) {
			console.log(error)
			if (error instanceof AxiosError) {
				const status = error.response?.status;
				const message = error.response?.data?.message;

				if (status === 401 || status === 403) {
					throw new Error('Email o contraseña incorrectos');
				} else if (status === 500) {
					throw new Error('Error del servidor. Por favor intenta más tarde.');
				} else if (message) {
					throw new Error(message);
				}
			}
			throw new Error('Error al iniciar sesión. Verifica tu conexión.');
		}
	},

	async register(payload: RegisterRequest): Promise<AuthResponse> {
		try {
			const res = await api.post<AuthResponse>('/v1/auth/register', payload);
			return res.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const status = error.response?.status;
				const message = error.response?.data?.message;

				if (message && message.toLowerCase().includes('Email already registered')) {
					throw new Error('Este email ya está registrado');
				} else if (message && message.toLowerCase().includes('Document already registered')) {
					throw new Error('Este email ya está registrado');
				} else if (status === 400) {
					throw new Error(message || 'Datos inválidos. Verifica el formulario.');
				} else if (status === 500) {
					throw new Error('Error del servidor. Por favor intenta más tarde.');
				} else if (message) {
					throw new Error(message);
				}
			}
			throw new Error('Error al registrarse. Verifica tu conexión.');
		}
	},
};

export default authApi;
