"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { AuthState, LoginRequest, RegisterRequest } from '@/types/auth.types';
import authApi from '@/services/api/authApi';

type AuthContextType = {
  state: AuthState;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthState["user"]>) => void;
  isLoading: boolean; // 👈 nuevo - para saber si está cargando
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ token: null, user: null });
  const [isLoading, setIsLoading] = useState(true); // 👈 nuevo - comienza en true

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const firstName = localStorage.getItem('firstName');
      const lastName = localStorage.getItem('lastName');
      const phoneNumber = localStorage.getItem('phoneNumber');
      const cedula = localStorage.getItem('cedula');
      const birthdate = localStorage.getItem('birthdate');
      const role = localStorage.getItem('role') as 'CLIENT' | 'ADMIN' | null;

      if (token) {
        setState({
          token,
          user: {
            email: email || undefined,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phoneNumber: phoneNumber || undefined,
            cedula: cedula || undefined,
            birthdate: birthdate || undefined,
            role: role || undefined,
          }
        });
      }

      // Marcar como cargado después de leer el localStorage
      setIsLoading(false);
    }
  }, []);

  const login = async (payload: LoginRequest) => {
    const res = await authApi.login(payload);
    // console.log('Login response:', res);

    if (res.token) {
      localStorage.setItem('token', res.token);
      if (res.email) localStorage.setItem('email', res.email);
      if (res.firstName) localStorage.setItem('firstName', res.firstName);
      if (res.lastName) localStorage.setItem('lastName', res.lastName);
      if (res.phoneNumber) localStorage.setItem('phoneNumber', res.phoneNumber);
      if (res.cedula) localStorage.setItem('cedula', res.cedula);
      if (res.birthdate) localStorage.setItem('birthdate', res.birthdate);
      if (res.role) localStorage.setItem('role', res.role);

      // console.log('Role guardado en localStorage:', res.role);

      setState({
        token: res.token,
        user: {
          email: res.email,
          firstName: res.firstName,
          lastName: res.lastName,
          phoneNumber: res.phoneNumber,
          cedula: res.cedula,
          birthdate: res.birthdate,
          role: res.role,
        }
      });

      // console.log('State actualizado con role:', res.role);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (payload: RegisterRequest) => {
    const res = await authApi.register(payload as any);
    if (res.token) {
      localStorage.setItem('token', res.token);
      if (res.email) localStorage.setItem('email', res.email);
      if (res.firstName) localStorage.setItem('firstName', res.firstName);
      if (res.lastName) localStorage.setItem('lastName', res.lastName);
      if (res.phoneNumber) localStorage.setItem('phoneNumber', res.phoneNumber);
      if (res.cedula) localStorage.setItem('cedula', res.cedula);
      if (res.birthdate) localStorage.setItem('birthdate', res.birthdate);
      if (res.role) localStorage.setItem('role', res.role);
      setState({
        token: res.token,
        user: {
          email: res.email,
          firstName: res.firstName,
          lastName: res.lastName,
          phoneNumber: res.phoneNumber,
          cedula: res.cedula,
          birthdate: res.birthdate,
          role: res.role,
        }
      });
    } else {
      throw new Error(res.message || 'Register failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('cedula');
    localStorage.removeItem('birthdate');
    localStorage.removeItem('role');
    setState({ token: null, user: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: Partial<AuthState["user"]>) => {
  if (!userData) return; 
  const previousEmail = state.user?.email;
  const newEmail = userData.email;

  setState((prev) => ({
    ...prev,
    user: { ...prev.user, ...userData },
  }));

  Object.entries(userData as Record<string, string | undefined>).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      localStorage.setItem(key, value);
    }
  });

  // Si cambió el email del usuario, el subject del JWT deja de coincidir.
  // Forzamos invalidación del token y re-login para obtener un JWT con el nuevo email.
  if (newEmail && previousEmail && newEmail !== previousEmail) {
    localStorage.removeItem('token');
    // Opcional: limpiar otros campos sensibles si se desea
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
