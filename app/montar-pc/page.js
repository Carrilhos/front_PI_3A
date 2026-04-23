"use client";

import { useState } from "react";
import {
  processadores,
  placasMae,
  memorias,
  placasVideo,
  fontes,
  armazenamentos,
} from "@/data/produtos";
import styles from "./page.module.css";

export default function MontarPcPage() {
  // Cada peca que o usuario selecionou
  const [cpu, setCpu] = useState(null);
  const [placaMae, setPlacaMae] = useState(null);
  const [ram, setRam] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [fonte, setFonte] = useState(null);
  const [ssd, setSsd] = useState(null);

  // ------- VALIDACOES DE COMPATIBILIDADE -------

  const erros = [];
  const avisos = [];

  // 1) CPU e placa-mae precisam ter o mesmo socket
  if (cpu && placaMae && cpu.socket !== placaMae.socket) {
    erros.push(
      `Socket incompatível: o processador é ${cpu.socket} e a placa-mãe é ${placaMae.socket}.`
    );
  }

  // 2) RAM precisa ser do mesmo tipo que a placa-mae suporta
  if (ram && placaMae && ram.tipo !== placaMae.tipoRam) {
    erros.push(
      `Memória incompatível: a placa-mãe usa ${placaMae.tipoRam}, mas você escolheu ${ram.tipo}.`
    );
  }

  // 3) Fonte precisa aguentar o consumo total (com margem de seguranca de 20%)
  const consumoTotal =
    (cpu?.tdp || 0) +
    (gpu?.tdp || 0) +
    (ram?.watts || 0) +
    (ssd?.watts || 0);

  const consumoRecomendado = Math.ceil(consumoTotal * 1.2);

  if (fonte && consumoTotal > 0 && fonte.watts < consumoRecomendado) {
    erros.push(
      `Fonte fraca: a build precisa de pelo menos ${consumoRecomendado}W (consumo ${consumoTotal}W + 20% de margem), mas sua fonte tem só ${fonte.watts}W.`
    );
  }

  if (
    fonte &&
    consumoTotal > 0 &&
    fonte.watts >= consumoRecomendado &&
    fonte.watts < consumoTotal * 1.5
  ) {
    avisos.push(
      "Fonte passa no mínimo, mas se você pretende fazer upgrade depois, considere uma maior."
    );
  }

  // ------- TOTAL -------
  const pecasSelecionadas = [cpu, placaMae, ram, gpu, fonte, ssd].filter(Boolean);
  const precoTotal = pecasSelecionadas.reduce((acc, p) => acc + p.preco, 0);

  const buildCompleta =
    cpu && placaMae && ram && gpu && fonte && ssd && erros.length === 0;

  // ------- RENDER -------
  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Monte o seu PC</h1>
      <p className={styles.descricao}>
        Escolha cada peça e o sistema verifica a compatibilidade (socket,
        memória e fonte de alimentação).
      </p>

      <div className={styles.layout}>
        <div className={styles.selecoes}>
          <Seletor
            titulo="1. Processador"
            itens={processadores}
            selecionado={cpu}
            onChange={setCpu}
          />

          <Seletor
            titulo="2. Placa Mãe"
            itens={placasMae}
            selecionado={placaMae}
            onChange={setPlacaMae}
          />

          <Seletor
            titulo="3. Memória RAM"
            itens={memorias}
            selecionado={ram}
            onChange={setRam}
          />

          <Seletor
            titulo="4. Placa de Vídeo"
            itens={placasVideo}
            selecionado={gpu}
            onChange={setGpu}
          />

          <Seletor
            titulo="5. Fonte"
            itens={fontes}
            selecionado={fonte}
            onChange={setFonte}
          />

          <Seletor
            titulo="6. Armazenamento"
            itens={armazenamentos}
            selecionado={ssd}
            onChange={setSsd}
          />
        </div>

        <aside className={styles.resumo}>
          <h2>Sua build</h2>

          <ul className={styles.listaResumo}>
            <ItemResumo label="Processador" item={cpu} />
            <ItemResumo label="Placa Mãe" item={placaMae} />
            <ItemResumo label="Memória RAM" item={ram} />
            <ItemResumo label="Placa de Vídeo" item={gpu} />
            <ItemResumo label="Fonte" item={fonte} />
            <ItemResumo label="Armazenamento" item={ssd} />
          </ul>

          {consumoTotal > 0 && (
            <p className={styles.consumo}>
              Consumo estimado: <strong>{consumoTotal}W</strong> (recomendado:{" "}
              {consumoRecomendado}W)
            </p>
          )}

          <div className={styles.total}>
            <span>Total:</span>
            <strong>R$ {precoTotal.toFixed(2).replace(".", ",")}</strong>
          </div>

          {erros.length > 0 && (
            <div className={styles.erros}>
              <strong>Problemas encontrados:</strong>
              <ul>
                {erros.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {avisos.length > 0 && (
            <div className={styles.avisos}>
              <strong>Atenção:</strong>
              <ul>
                {avisos.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={styles.botaoComprar}
            disabled={!buildCompleta}
          >
            {buildCompleta
              ? "Finalizar compra"
              : "Selecione todas as peças compatíveis"}
          </button>
        </aside>
      </div>
    </div>
  );
}

// ------- Componentes auxiliares -------

function Seletor({ titulo, itens, selecionado, onChange }) {
  return (
    <div className={styles.grupo}>
      <h3 className={styles.grupoTitulo}>{titulo}</h3>
      <div className={styles.opcoes}>
        {itens.map((item) => {
          const ativo = selecionado?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(ativo ? null : item)}
              className={ativo ? styles.opcaoAtiva : styles.opcao}
            >
              <div>
                <p className={styles.opcaoNome}>{item.nome}</p>
                <p className={styles.opcaoDetalhe}>
                  {item.socket && `Socket ${item.socket} · `}
                  {item.tipo && `${item.tipo} · `}
                  {item.tipoRam && `Mem. ${item.tipoRam} · `}
                  {item.tdp && `${item.tdp}W TDP · `}
                  {item.categoria === "Fonte" && `${item.watts}W · `}
                  R$ {item.preco.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ItemResumo({ label, item }) {
  return (
    <li className={styles.itemResumo}>
      <span className={styles.itemLabel}>{label}:</span>
      <span className={styles.itemValor}>
        {item ? item.nome : <em>não selecionado</em>}
      </span>
    </li>
  );
}
