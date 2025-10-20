// importa el archivo que registra los interceptores (ya importa axiosConfig)
import '@/lib/axios/interceptors';
import api from '@/lib/axios/axiosConfig';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types';

const authApi = {
	async login(payload: LoginRequest): Promise<AuthResponse> {
		const res = await api.post<AuthResponse>('/v1/auth/login', payload);
		return res.data;
	},

	async register(payload: RegisterRequest): Promise<AuthResponse> {
		const res = await api.post<AuthResponse>('/v1/auth/register', payload);
		return res.data;
	},
};

export default authApi;
