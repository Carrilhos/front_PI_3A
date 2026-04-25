"use client";

import { useState, useEffect } from "react";
import { getAnunciosEnriquecidos, getAnuncioDetalhes } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import styles from "./page.module.css";

// Mapeamento de nome de categoria → chave interna do build
const ROLE_MAP = {
  "Processador (CPU)": "cpu",
  "Placa-mãe": "mobo",
  "Memória RAM": "ram",
  "Placa de Vídeo (GPU)": "gpu",
  "Fonte de Alimentação": "psu",
  "Armazenamento": "ssd",
};

const ROLE_LABELS = {
  cpu: "1. Processador",
  mobo: "2. Placa Mãe",
  ram: "3. Memória RAM",
  gpu: "4. Placa de Vídeo",
  psu: "5. Fonte",
  ssd: "6. Armazenamento",
};

// Flatten [{socket: "AM5"}, {tdp: 105}] → {socket: "AM5", tdp: 105}
function flattenAtributos(atributos = []) {
  return atributos.reduce((obj, a) => ({ ...obj, ...a }), {});
}

export default function MontarPcPage() {
  const { addItem } = useCart();
  const [grupos, setGrupos] = useState({});
  const [loading, setLoading] = useState(true);
  // build: { cpu: {anuncio, attrs}, mobo: {...}, ... }
  const [build, setBuild] = useState({});
  const [loadingPeca, setLoadingPeca] = useState(null);

  useEffect(() => {
    getAnunciosEnriquecidos()
      .then((anuncios) => {
        const g = {};
        for (const a of anuncios) {
          const role = ROLE_MAP[a.categoria_nome];
          if (!role) continue;
          if (!g[role]) g[role] = [];
          g[role].push(a);
        }
        setGrupos(g);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSelecionar(role, anuncio) {
    if (build[role]?.anuncio?.id_anuncio === anuncio.id_anuncio) {
      setBuild((prev) => { const next = { ...prev }; delete next[role]; return next; });
      return;
    }
    setLoadingPeca(anuncio.id_anuncio);
    try {
      const detalhes = await getAnuncioDetalhes(anuncio.id_anuncio);
      const attrs = flattenAtributos(detalhes.atributos);
      setBuild((prev) => ({ ...prev, [role]: { anuncio, attrs } }));
    } catch {
      setBuild((prev) => ({ ...prev, [role]: { anuncio, attrs: {} } }));
    } finally {
      setLoadingPeca(null);
    }
  }

  // --- Validações ---
  const erros = [];
  const avisos = [];

  const cpu = build.cpu?.attrs;
  const mobo = build.mobo?.attrs;
  const ram = build.ram?.attrs;
  const gpu = build.gpu?.attrs;
  const psu = build.psu?.attrs;

  if (cpu && mobo && cpu.socket && mobo.socket && cpu.socket !== mobo.socket) {
    erros.push(`Socket incompatível: CPU é ${cpu.socket}, Placa Mãe é ${mobo.socket}.`);
  }

  const ramTipo = ram?.tipo || ram?.tipo_ram;
  const moboRam = mobo?.tipo_ram || mobo?.tipoRam;
  if (ram && mobo && ramTipo && moboRam && ramTipo !== moboRam) {
    erros.push(`Memória incompatível: placa-mãe usa ${moboRam}, RAM é ${ramTipo}.`);
  }

  const consumoTotal =
    (Number(cpu?.tdp) || 0) +
    (Number(gpu?.tdp) || 0) +
    (Number(ram?.watts) || 0);

  const consumoRecomendado = Math.ceil(consumoTotal * 1.2);
  const wattsFont = Number(psu?.watts) || 0;

  if (psu && consumoTotal > 0 && wattsFont < consumoRecomendado) {
    erros.push(`Fonte fraca: build precisa de ${consumoRecomendado}W, sua fonte tem ${wattsFont}W.`);
  }

  if (psu && consumoTotal > 0 && wattsFont >= consumoRecomendado && wattsFont < consumoTotal * 1.5) {
    avisos.push("Fonte no limite mínimo. Considere uma maior para upgrades futuros.");
  }

  const pecasSelecionadas = Object.values(build);
  const precoTotal = pecasSelecionadas.reduce((acc, p) => acc + parseFloat(p.anuncio.preco), 0);
  const buildCompleta = Object.keys(ROLE_LABELS).every((r) => build[r]) && erros.length === 0;

  function handleFinalizarCompra() {
    for (const { anuncio } of pecasSelecionadas) {
      addItem({
        id_anuncio: anuncio.id_anuncio,
        titulo: anuncio.titulo,
        preco: parseFloat(anuncio.preco),
        imagem: anuncio.imagem_principal,
      });
    }
  }

  if (loading) return (
    <div className={styles.container}>
      <p style={{ color: "#888", textAlign: "center", paddingTop: 60 }}>Carregando peças...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Monte o seu PC</h1>
      <p className={styles.descricao}>
        Escolha cada peça e o sistema verifica a compatibilidade (socket, memória e fonte).
      </p>

      <div className={styles.layout}>
        <div className={styles.selecoes}>
          {Object.entries(ROLE_LABELS).map(([role, titulo]) => (
            <Seletor
              key={role}
              titulo={titulo}
              itens={grupos[role] || []}
              selecionado={build[role]?.anuncio}
              loadingId={loadingPeca}
              onSelecionar={(a) => handleSelecionar(role, a)}
            />
          ))}
        </div>

        <aside className={styles.resumo}>
          <h2>Sua build</h2>

          <ul className={styles.listaResumo}>
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <ItemResumo
                key={role}
                label={label.replace(/^\d+\. /, "")}
                item={build[role]?.anuncio}
              />
            ))}
          </ul>

          {consumoTotal > 0 && (
            <p className={styles.consumo}>
              Consumo estimado: <strong>{consumoTotal}W</strong>{" "}
              (recomendado: {consumoRecomendado}W)
            </p>
          )}

          <div className={styles.total}>
            <span>Total:</span>
            <strong>R$ {precoTotal.toFixed(2).replace(".", ",")}</strong>
          </div>

          {erros.length > 0 && (
            <div className={styles.erros}>
              <strong>Problemas encontrados:</strong>
              <ul>{erros.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}

          {avisos.length > 0 && (
            <div className={styles.avisos}>
              <strong>Atenção:</strong>
              <ul>{avisos.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}

          <button
            className={styles.botaoComprar}
            disabled={!buildCompleta}
            onClick={buildCompleta ? handleFinalizarCompra : undefined}
          >
            {buildCompleta ? "Adicionar tudo ao carrinho" : "Selecione todas as peças compatíveis"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function Seletor({ titulo, itens, selecionado, loadingId, onSelecionar }) {
  return (
    <div className={styles.grupo}>
      <h3 className={styles.grupoTitulo}>{titulo}</h3>
      {itens.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: 13 }}>Nenhuma peça disponível.</p>
      ) : (
        <div className={styles.opcoes}>
          {itens.map((item) => {
            const ativo = selecionado?.id_anuncio === item.id_anuncio;
            const carregando = loadingId === item.id_anuncio;
            return (
              <button
                key={item.id_anuncio}
                onClick={() => onSelecionar(item)}
                className={ativo ? styles.opcaoAtiva : styles.opcao}
                disabled={carregando}
              >
                <div>
                  <p className={styles.opcaoNome}>{item.produto?.nome || item.titulo}</p>
                  <p className={styles.opcaoDetalhe}>
                    R$ {parseFloat(item.preco).toFixed(2).replace(".", ",")}
                    {carregando && " — carregando..."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemResumo({ label, item }) {
  return (
    <li className={styles.itemResumo}>
      <span className={styles.itemLabel}>{label}:</span>
      <span className={styles.itemValor}>
        {item ? (item.produto?.nome || item.titulo) : <em>não selecionado</em>}
      </span>
    </li>
  );
}
