"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAnuncio, getProdutos, atualizarAnuncio } from "@/services/api";
import styles from "../../novo-anuncio/page.module.css";

export default function EditarAnuncioPage() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isLogado || !isVendedor) {
      router.push("/login");
      return;
    }
    Promise.all([getAnuncio(id), getProdutos()])
      .then(([anuncio, prods]) => {
        setForm({
          id_produto: String(anuncio.id_produto),
          titulo: anuncio.titulo,
          descricao: anuncio.descricao || "",
          preco: String(anuncio.preco),
          estoque: String(anuncio.estoque),
        });
        setProdutos(prods);
      })
      .catch(() => router.push("/vendedor"))
      .finally(() => setLoading(false));
  }, [id, isLogado, isVendedor, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await atualizarAnuncio(id, {
        id_produto: Number(form.id_produto),
        titulo: form.titulo,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        estoque: parseInt(form.estoque) || 0,
      });
      router.push("/vendedor");
    } catch (err) {
      setErro(err.erro || "Erro ao atualizar anúncio.");
    } finally {
      setEnviando(false);
    }
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.voltar}>← Voltar</button>
      <h1 className={styles.titulo}>Editar Anúncio</h1>

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

        {erro && <p className={styles.erro}>{erro}</p>}

        <button type="submit" className={styles.btn} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
