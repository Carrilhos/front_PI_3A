"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMeusPedidos, cancelarPedido } from "@/services/api";
import styles from "./page.module.css";

const STATUS_LABELS = {
  pendente: { label: "Pendente", cor: styles.statusPendente },
  aprovado: { label: "Aprovado", cor: styles.statusAprovado },
  enviado: { label: "Enviado", cor: styles.statusEnviado },
  entregue: { label: "Entregue", cor: styles.statusEntregue },
  cancelado: { label: "Cancelado", cor: styles.statusCancelado },
};

export default function MeusPedidosPage() {
  const { isLogado } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    if (!isLogado) {
      router.push("/login");
      return;
    }
    getMeusPedidos()
      .then(setPedidos)
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false));
  }, [isLogado, router]);

  async function handleCancelar(id) {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
    setCancelando(id);
    try {
      await cancelarPedido(id);
      setPedidos((prev) =>
        prev.map((p) => p.id_pedido === id ? { ...p, status: "cancelado" } : p)
      );
    } catch {
      alert("Não foi possível cancelar o pedido.");
    } finally {
      setCancelando(null);
    }
  }

  if (loading) return <div className={styles.loading}>Carregando pedidos...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meus Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className={styles.vazio}>
          <p>Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className={styles.lista}>
          {pedidos.map((pedido) => {
            const statusInfo = STATUS_LABELS[pedido.status] || { label: pedido.status, cor: "" };
            return (
              <div key={pedido.id_pedido} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.pedidoId}>Pedido #{pedido.id_pedido}</span>
                    <span className={styles.data}>
                      {new Date(pedido.data_pedido || pedido.data_criacao).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <span className={`${styles.status} ${statusInfo.cor}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {pedido.itens?.length > 0 && (
                  <div className={styles.itens}>
                    {pedido.itens.map((item, i) => (
                      <div key={i} className={styles.item}>
                        <span>{item.quantidade}x Anúncio #{item.id_anuncio}</span>
                        <span>R$ {parseFloat(item.preco * item.quantidade).toFixed(2).replace(".", ",")}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <div className={styles.endereco}>
                    📍 {pedido.logradouro_snap}, {pedido.numero_snap} — {pedido.cidade_snap}/{pedido.estado_snap}
                  </div>
                  <div className={styles.total}>
                    Total: <strong>R$ {parseFloat(pedido.valor_total).toFixed(2).replace(".", ",")}</strong>
                  </div>
                </div>

                {pedido.status === "pendente" && (
                  <button
                    className={styles.btnCancelar}
                    onClick={() => handleCancelar(pedido.id_pedido)}
                    disabled={cancelando === pedido.id_pedido}
                  >
                    {cancelando === pedido.id_pedido ? "Cancelando..." : "Cancelar Pedido"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
