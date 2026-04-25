"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login as apiLogin } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const data = await apiLogin(email, senha);
      login(data.token, data.usuario);
      router.push("/");
    } catch (err) {
      setErro(err.mensagem || "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Entrar</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            autoComplete="email"
          />

          <label className={styles.label}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.input}
            required
            autoComplete="current-password"
          />

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className={styles.rodape}>
          Não tem conta?{" "}
          <Link href="/cadastro" className={styles.link}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
