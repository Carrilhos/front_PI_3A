"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { lerToken, lerUsuario, salvarSessao, limparSessao } from "@/lib/auth";

const AuthContext = createContext(null);

/**
 * Provedor global de autenticação.
 * Lê sessão do localStorage na montagem e expõe login/logout.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  // true até terminar de ler o localStorage (evita flash de UI incorreta)
  const [carregando, setCarregando] = useState(true);

  // Lê sessão salva ao montar no cliente
  useEffect(() => {
    const tokenSalvo = lerToken();
    const usuarioSalvo = lerUsuario();
    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(usuarioSalvo);
    }
    setCarregando(false);
  }, []);

  /**
   * Chamado após login bem-sucedido para persistir e atualizar o estado.
   * @param {string} novoToken
   * @param {object} novoUsuario
   */
  const login = useCallback((novoToken, novoUsuario) => {
    salvarSessao(novoToken, novoUsuario);
    setToken(novoToken);
    setUsuario(novoUsuario);
  }, []);

  /**
   * Encerra a sessão removendo token e usuário.
   */
  const logout = useCallback(() => {
    limparSessao();
    setToken(null);
    setUsuario(null);
  }, []);

  const estaAutenticado = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ token, usuario, estaAutenticado, carregando, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir o contexto de autenticação.
 * @returns {{ token: string|null, usuario: object|null, estaAutenticado: boolean, carregando: boolean, login: Function, logout: Function }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
