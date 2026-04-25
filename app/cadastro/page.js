"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { hashSenha } from "@/services/api";
import styles from "./page.module.css";

export default function CadastroPage() {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    tipo_usuario: "CLIENTE",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const senhaHash = await hashSenha(form.senha);
      const { error } = await supabase.from("usuarios").insert({
        nome: form.nome,
        sobrenome: form.sobrenome,
        email: form.email,
        senha: senhaHash,
        tipo_usuario: form.tipo_usuario,
      });
      if (error) {
        if (error.code === "23505") {
          setErro("Este e-mail já está cadastrado.");
        } else {
          setErro("Erro ao criar conta. Tente novamente.");
        }
        return;
      }
      router.push("/login");
    } catch {
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Criar Conta</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.campo}>
              <label className={styles.label}>Nome</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Sobrenome</label>
              <input
                name="sobrenome"
                value={form.sobrenome}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <label className={styles.label}>E-mail</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
            autoComplete="email"
          />

          <label className={styles.label}>Senha</label>
          <input
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            className={styles.input}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <label className={styles.label}>Tipo de conta</label>
          <select
            name="tipo_usuario"
            value={form.tipo_usuario}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="CLIENTE">Cliente — Quero comprar</option>
            <option value="VENDEDOR">Vendedor — Quero vender</option>
          </select>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className={styles.rodape}>
          Já tem conta?{" "}
          <Link href="/login" className={styles.link}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
