import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("nr_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("nr_token"));

  useEffect(() => {
    if (user) localStorage.setItem("nr_user", JSON.stringify(user));
    else localStorage.removeItem("nr_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("nr_token", token);
    else localStorage.removeItem("nr_token");
  }, [token]);

  // attach/detach token to axios
  useEffect(() => {
    const id = api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => api.interceptors.request.eject(id);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
