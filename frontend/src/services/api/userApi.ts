import api from '@/lib/axios/axiosConfig';
import '@/lib/axios/interceptors';
import type { AuthResponse } from '@/types/auth.types';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  cedula?: string;
  birthdate?: string; // formato: yyyy-MM-dd
}

const userApi = {
  async updateProfile(data: UpdateProfileRequest): Promise<AuthResponse> {
    const res = await api.put<AuthResponse>('/v1/users/profile', data);
    return res.data;
  },
};

export default userApi;
