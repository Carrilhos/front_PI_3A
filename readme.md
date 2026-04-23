# Frontend - HardwareStore

Frontend em Next.js da plataforma de marketplace de hardware.

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Páginas

- `/` — Home com as 2 seções principais
- `/hardwares` — Lista todos os produtos com filtro por categoria e busca
- `/montar-pc` — Monta um PC verificando compatibilidade (socket, memória, fonte)

## Regras de compatibilidade do "Monte seu PC"

1. Processador e placa-mãe precisam ter o **mesmo socket** (LGA1700, AM4, AM5)
2. Memória RAM precisa ser do **mesmo tipo** que a placa-mãe suporta (DDR4, DDR5)
3. Fonte precisa ter potência suficiente: `soma dos TDPs * 1.2` (margem de 20%)

## Conexão com a API Flask

Hoje os produtos vem do arquivo `data/produtos.js` (dados mockados).

Quando a API `api_flask_pi_3A` tiver os campos necessários
(`socket`, `tdp`, `tipo_ram`, etc), é só trocar os imports por chamadas fetch:

```js
const res = await fetch("http://localhost:5000/produtos");
const produtos = await res.json();
```
