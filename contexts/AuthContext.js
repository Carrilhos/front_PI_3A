"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login(tokenRecebido, usuarioRecebido) {
    localStorage.setItem("token", tokenRecebido);
    localStorage.setItem("user", JSON.stringify(usuarioRecebido));
    setToken(tokenRecebido);
    setUser(usuarioRecebido);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const isVendedor = user?.tipo_usuario === "VENDEDOR";
  const isLogado = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isVendedor, isLogado }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
