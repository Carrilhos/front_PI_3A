"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sha256 } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (carregando) return;

    setErro("");
    setCarregando(true);

    try {
      const senhaHash = await sha256(senha);

      const resposta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha: senhaHash }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "Credenciais inválidas.");
        return;
      }

      // Persiste sessão e atualiza contexto
      login(dados.token, dados.usuario);

      // Redireciona para rota anterior ou para a home
      const destino = searchParams.get("redirect") || "/";
      router.replace(destino);
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Entrar</h1>
        <p className={styles.subtitulo}>
          Acesse sua conta de comprador ou vendedor.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.grupo}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.grupo}>
            <label htmlFor="senha" className={styles.label}>
              Senha
            </label>
            <div className={styles.senhaWrapper}>
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                className={styles.input}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.toggleSenha}
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {erro && (
            <p className={styles.erro} role="alert">
              {erro}
            </p>
          )}

          <button
            id="btn-entrar"
            type="submit"
            className={styles.botao}
            disabled={carregando}
          >
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
