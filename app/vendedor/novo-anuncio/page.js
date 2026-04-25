"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProdutos, criarAnuncio } from "@/services/api";
import styles from "./page.module.css";

export default function NovoAnuncioPage() {
  const { isLogado, isVendedor } = useAuth();
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    id_produto: "",
    titulo: "",
    descricao: "",
    preco: "",
    estoque: "",
  });
  const [imagens, setImagens] = useState([]);
  const [imagemPrincipal, setImagemPrincipal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isLogado || !isVendedor) {
      router.push("/login");
      return;
    }
    getProdutos()
      .then(setProdutos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLogado, isVendedor, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!form.id_produto) {
      setErro("Selecione um produto.");
      return;
    }
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("id_produto", form.id_produto);
      fd.append("titulo", form.titulo);
      fd.append("descricao", form.descricao);
      fd.append("preco", form.preco);
      fd.append("estoque", form.estoque || "0");
      fd.append("imagem_principal", String(imagemPrincipal));
      imagens.forEach((img) => fd.append("imagens", img));

      await criarAnuncio(fd);
      router.push("/vendedor");
    } catch (err) {
      setErro(err.erro || "Erro ao criar anúncio.");
    } finally {
      setEnviando(false);
    }
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.voltar}>← Voltar</button>
      <h1 className={styles.titulo}>Novo Anúncio</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Produto *</label>
        <select name="id_produto" value={form.id_produto} onChange={handleChange} className={styles.input} required>
          <option value="">Selecione um produto</option>
          {produtos.map((p) => (
            <option key={p.id_produto} value={p.id_produto}>
              {p.nome} {p.marca ? `— ${p.marca}` : ""}
            </option>
          ))}
        </select>

        <label className={styles.label}>Título do anúncio *</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} className={styles.input} required maxLength={255} />

        <label className={styles.label}>Descrição</label>
        <textarea name="descricao" value={form.descricao} onChange={handleChange} className={styles.textarea} rows={4} />

        <div className={styles.row}>
          <div className={styles.campo}>
            <label className={styles.label}>Preço (R$) *</label>
            <input name="preco" type="number" step="0.01" min="0" value={form.preco} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Estoque</label>
            <input name="estoque" type="number" min="0" value={form.estoque} onChange={handleChange} className={styles.input} />
          </div>
        </div>

        <label className={styles.label}>Imagens</label>
        <input
          type="file"
          accept="image/*"
          multiple
          className={styles.inputFile}
          onChange={(e) => {
            setImagens(Array.from(e.target.files));
            setImagemPrincipal(0);
          }}
        />

        {imagens.length > 1 && (
          <div className={styles.principalSelect}>
            <label className={styles.label}>Imagem principal</label>
            <select
              value={imagemPrincipal}
              onChange={(e) => setImagemPrincipal(Number(e.target.value))}
              className={styles.input}
            >
              {imagens.map((img, i) => (
                <option key={i} value={i}>{img.name}</option>
              ))}
            </select>
          </div>
        )}

        {erro && <p className={styles.erro}>{erro}</p>}

        <button type="submit" className={styles.btn} disabled={enviando}>
          {enviando ? "Publicando..." : "Publicar Anúncio"}
        </button>
      </form>
    </div>
  );
}
