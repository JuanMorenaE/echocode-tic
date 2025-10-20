"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { AuthState, LoginRequest, RegisterRequest } from '@/types/auth.types';
import authApi from '@/services/api/authApi';

type AuthContextType = {
  state: AuthState;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ token: null, user: null });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const firstName = localStorage.getItem('firstName');
      const lastName = localStorage.getItem('lastName');
      if (token) {
        setState({ token, user: { email: email || undefined, firstName: firstName || undefined, lastName: lastName || undefined } });
      }
    }
  }, []);

  const login = async (payload: LoginRequest) => {
    const res = await authApi.login(payload);
    if (res.token) {
      localStorage.setItem('token', res.token);
      if (res.email) localStorage.setItem('email', res.email);
      if (res.firstName) localStorage.setItem('firstName', res.firstName);
      if (res.lastName) localStorage.setItem('lastName', res.lastName);
      setState({ token: res.token, user: { email: res.email, firstName: res.firstName, lastName: res.lastName } });
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
      setState({ token: res.token, user: { email: res.email, firstName: res.firstName, lastName: res.lastName } });
    } else {
      throw new Error(res.message || 'Register failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    setState({ token: null, user: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
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
