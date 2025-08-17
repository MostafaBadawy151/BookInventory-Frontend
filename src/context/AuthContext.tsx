import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthHeader } from "../api/axios";
import type { AuthResponse } from "../types";

type User = {
  userName: string;
  fullName?: string | null;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (payload: { userName: string; email: string; password: string; fullName?: string }) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const TOKEN_KEY = "bookapp_token";
const USER_KEY = "bookapp_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  const login = async (username: string, password: string) => {
    const res = await api.post<AuthResponse>("/api/auth/login", { userName: username, password });
    const data = res.data;
    setToken(data.token);
    setAuthHeader(data.token);
    const u: User = { userName: data.userName, fullName: data.fullName, roles: data.roles ?? [] };
    setUser(u);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return data;
  };

  const register = async (payload: { userName: string; email: string; password: string; fullName?: string }) => {
    const res = await api.post<AuthResponse>("/api/auth/register", payload);
    const data = res.data;
    setToken(data.token);
    setAuthHeader(data.token);
    const u: User = { userName: data.userName, fullName: data.fullName, roles: data.roles ?? [] };
    setUser(u);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuthenticated = !!token;
  const isAdmin = !!user && user.roles.includes("Admin");

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
