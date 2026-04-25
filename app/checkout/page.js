"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getEnderecos, criarEndereco, criarPedido } from "@/services/api";
import styles from "./page.module.css";

const ENDERECO_VAZIO = {
  logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "",
};

export default function CheckoutPage() {
  const { isLogado } = useAuth();
  const { itens, total, clearCart } = useCart();
  const router = useRouter();

  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [novoEndereco, setNovoEndereco] = useState(false);
  const [formEndereco, setFormEndereco] = useState(ENDERECO_VAZIO);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isLogado) {
      router.push("/login");
      return;
    }
    if (itens.length === 0) {
      router.push("/carrinho");
      return;
    }
    getEnderecos()
      .then((data) => {
        setEnderecos(data);
        if (data.length > 0) setEnderecoSelecionado(data[0].id_endereco);
        else setNovoEndereco(true);
      })
      .catch(() => setNovoEndereco(true))
      .finally(() => setLoading(false));
  }, [isLogado, itens.length, router]);

  function handleEnderecoChange(e) {
    setFormEndereco({ ...formEndereco, [e.target.name]: e.target.value });
  }

  async function handleConfirmar() {
    setErro("");
    setEnviando(true);
    try {
      let idEndereco = enderecoSelecionado;

      if (novoEndereco) {
        const camposFaltando = Object.entries(formEndereco)
          .filter(([, v]) => !v.trim())
          .map(([k]) => k);
        if (camposFaltando.length) {
          setErro("Preencha todos os campos do endereço.");
          return;
        }
        const end = await criarEndereco(formEndereco);
        idEndereco = end.id_endereco;
      }

      await criarPedido({
        id_endereco: idEndereco,
        itens: itens.map((i) => ({ id_anuncio: i.id_anuncio, quantidade: i.quantidade })),
      });

      clearCart();
      router.push("/meus-pedidos");
    } catch (err) {
      setErro(err.erro || "Erro ao criar pedido. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.esquerda}>
          <section className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Endereço de Entrega</h2>

            {enderecos.length > 0 && (
              <div className={styles.enderecos}>
                {enderecos.map((end) => (
                  <label key={end.id_endereco} className={styles.enderecoCard}>
                    <input
                      type="radio"
                      name="endereco"
                      value={end.id_endereco}
                      checked={enderecoSelecionado === end.id_endereco && !novoEndereco}
                      onChange={() => {
                        setEnderecoSelecionado(end.id_endereco);
                        setNovoEndereco(false);
                      }}
                    />
                    <span>
                      {end.logradouro}, {end.numero} — {end.bairro}, {end.cidade}/{end.estado} — CEP {end.cep}
                    </span>
                  </label>
                ))}
                <label className={styles.enderecoCard}>
                  <input
                    type="radio"
                    name="endereco"
                    checked={novoEndereco}
                    onChange={() => setNovoEndereco(true)}
                  />
                  <span>+ Novo endereço</span>
                </label>
              </div>
            )}

            {novoEndereco && (
              <div className={styles.formEndereco}>
                <div className={styles.row}>
                  <div className={styles.campo}>
                    <label className={styles.label}>Logradouro</label>
                    <input name="logradouro" value={formEndereco.logradouro} onChange={handleEnderecoChange} className={styles.input} />
                  </div>
                  <div className={styles.campoSmall}>
                    <label className={styles.label}>Número</label>
                    <input name="numero" value={formEndereco.numero} onChange={handleEnderecoChange} className={styles.input} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.campo}>
                    <label className={styles.label}>Bairro</label>
                    <input name="bairro" value={formEndereco.bairro} onChange={handleEnderecoChange} className={styles.input} />
                  </div>
                  <div className={styles.campo}>
                    <label className={styles.label}>Cidade</label>
                    <input name="cidade" value={formEndereco.cidade} onChange={handleEnderecoChange} className={styles.input} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.campoSmall}>
                    <label className={styles.label}>Estado</label>
                    <input name="estado" value={formEndereco.estado} onChange={handleEnderecoChange} className={styles.input} maxLength={2} placeholder="RS" />
                  </div>
                  <div className={styles.campo}>
                    <label className={styles.label}>CEP</label>
                    <input name="cep" value={formEndereco.cep} onChange={handleEnderecoChange} className={styles.input} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className={styles.direita}>
          <div className={styles.resumo}>
            <h2 className={styles.resumoTitulo}>Resumo do Pedido</h2>
            {itens.map((item) => (
              <div key={item.id_anuncio} className={styles.resumoItem}>
                <span className={styles.resumoNome}>{item.titulo} × {item.quantidade}</span>
                <span>R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
            <div className={styles.resumoTotal}>
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>

            {erro && <p className={styles.erro}>{erro}</p>}

            <button className={styles.btnConfirmar} onClick={handleConfirmar} disabled={enviando}>
              {enviando ? "Processando..." : "Confirmar Pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
