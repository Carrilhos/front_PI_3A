O documento abaixo foi feito terça a noite, certas coisas já foram resolvidas pelos colegas. Mais tarde irei dar uma atenção pro front aqui. -Tierres

# Pendências — O que falta para a plataforma ficar 100% funcional

Este documento resume o que ainda precisa ser feito na **API Flask**
(`api_flask_pi_3A`) e no **Frontend Next.js** (`frontend_pi_3A`) para que
o marketplace funcione de ponta a ponta.

---

## API (`api_flask_pi_3A`)

### Bugs / correções urgentes

- **`app/__init__.py` tem `register_routes` duplicada** — a segunda sobrescreve
  a primeira, então **as rotas de `/categories` nunca são registradas**.
  Juntar tudo em uma única função.

### Entidades / tabelas faltando

- **Usuário / Vendedor / Cliente** — não existe nenhum model, repository nem
  rota. Toda a plataforma depende disso (quem anuncia, quem compra).
- **Endereço do usuário** — o `pedido` guarda um *snapshot* do endereço, mas
  não há tabela de endereço cadastrado do cliente.
- **Carrinho** — não existe. Hoje o pedido é criado direto.
- **Item do pedido** — a tabela `pedido` tem `valor_total`, mas não há
  `pedido_item` linkando quais anúncios/quantidades compõem cada pedido.
- **Valores dos atributos do produto** — existe `atributo` e
  `categoria_atributo`, mas falta a tabela que guarda o **valor** de cada
  atributo por produto (ex: `socket = AM5`, `tdp = 105`). Sem isso o
  "Monte seu PC" não tem como validar compatibilidade.

### Endpoints faltando

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`
- `GET /usuarios/me`, `PUT /usuarios/me`
- `GET /categorias` — existe rota parcial, mas está quebrada (ver bug acima)
- `GET /categorias/{id}/atributos` — para o frontend saber quais campos
  preencher ao cadastrar um anúncio
- `GET /produtos/{id}/atributos` — retornar os valores (socket, tdp, etc)
- `POST /carrinho/itens`, `GET /carrinho`, `DELETE /carrinho/itens/{id}`
- `POST /pedidos` deveria receber itens do carrinho e calcular o total
  (hoje o cliente manda `valor_total` manualmente)

### Segurança e infra

- **Autenticação JWT** (ou sessão) — nenhum endpoint hoje exige login.
  Qualquer um pode criar/editar/deletar anúncio de qualquer vendedor.
- **CORS** — precisa liberar `http://localhost:3000` para o Next.js
  conseguir chamar a API em dev.
- **Validação centralizada** — hoje as rotas têm validação manual repetida.
  Vale usar `pydantic` ou `marshmallow`.
- **Migrations versionadas** (Alembic) — hoje o schema está só no banco.
- **Hash de senha** (bcrypt/argon2) quando o usuário for implementado.

---

## Frontend (`frontend_pi_3A`)

### Conexão com API

- Hoje tudo vem de `data/produtos.js` (mockado). Substituir por chamadas
  `fetch` para a API assim que os endpoints estiverem prontos.
- Criar um helper `services/api.js` centralizando a URL base e os headers.
- Usar variável de ambiente `NEXT_PUBLIC_API_URL`.

### Páginas faltando

- **Login / Cadastro** (`/login`, `/cadastro`)
- **Detalhe do produto** (`/produto/[id]`) — hoje só existe o card na listagem
- **Carrinho** (`/carrinho`)
- **Checkout** (`/checkout`) — endereço, pagamento, confirmação
- **Meus pedidos** (`/meus-pedidos`)
- **Área do vendedor** (`/vendedor`) — criar/editar/excluir anúncios,
  ver pedidos recebidos, upload de imagem

### Funcionalidades incompletas

- Botão **"Comprar"** do `ProductCard` não faz nada — precisa adicionar ao
  carrinho.
- **Imagens** hoje são placeholders com o nome da categoria — exibir a
  imagem real (campo `url` da tabela `produto_imagem`).
- **Filtros de categoria** em `/hardwares` usam lista fixa no código —
  puxar de `GET /categorias`.
- **"Monte seu PC"** valida com dados mockados. Quando conectar na API,
  os campos `socket`, `tdp`, `tipo_ram`, `watts` precisam vir de
  `GET /produtos/{id}/atributos`.
- Sem tratamento de **estado de loading** e **erro** nas chamadas
  (hoje nem há chamadas).

### UX / qualidade

- Nenhuma **proteção de rota** — área do vendedor precisa exigir login.
- Sem feedback visual ao adicionar ao carrinho (toast, contador no header).
- Header não mostra se o usuário está logado.
- Sem paginação na listagem de hardwares.

---

## Integração ponta a ponta

Para o fluxo completo funcionar (visitante vira cliente, compra uma peça),
a ordem sugerida é:

1. **API**: criar `usuario` + autenticação JWT + CORS
2. **Frontend**: páginas de login/cadastro + guardar token
3. **API**: tabela de valores de atributo + endpoint
   `GET /produtos/{id}/atributos`
4. **Frontend**: trocar dados mockados por chamadas reais
5. **API**: `carrinho` + `pedido_item`
6. **Frontend**: carrinho e checkout
7. **API**: área do vendedor com autorização (só dono do anúncio edita)
8. **Frontend**: dashboard do vendedor com upload de imagem
