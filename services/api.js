const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && options.body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...data };
  }

  return data;
}

export async function hashSenha(senha) {
  const encoded = new TextEncoder().encode(senha);
  const buf = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Auth
export async function login(email, senha) {
  const senhaHash = await hashSenha(senha);
  return apiFetch("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, senha: senhaHash }),
  });
}

// Anúncios
export async function getAnuncios(idVendedor) {
  const query = idVendedor ? `?id_vendedor=${idVendedor}` : "";
  return apiFetch(`/anuncios/${query}`);
}

export async function getAnuncio(id) {
  return apiFetch(`/anuncios/${id}`);
}

export async function getAnuncioDetalhes(id) {
  return apiFetch(`/anuncios/${id}/detalhes`);
}

export async function criarAnuncio(formData) {
  return apiFetch("/anuncios/", { method: "POST", body: formData });
}

export async function atualizarAnuncio(id, dados) {
  return apiFetch(`/anuncios/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export async function deletarAnuncio(id) {
  return apiFetch(`/anuncios/${id}`, { method: "DELETE" });
}

// Categorias — retorna { id, nome, descricao }
export async function getCategorias() {
  return apiFetch("/categorias/");
}

// Enriquece array de anúncios com categoria_nome via join produtos+categorias
export async function getAnunciosEnriquecidos() {
  const [anuncios, produtos, categorias] = await Promise.all([
    apiFetch("/anuncios/"),
    apiFetch("/produtos/"),
    apiFetch("/categorias/"),
  ]);

  const prodMap = {};
  for (const p of produtos) prodMap[p.id_produto] = p;

  const catMap = {};
  for (const c of categorias) catMap[c.id] = c.nome;

  return anuncios.map((a) => {
    const prod = prodMap[a.id_produto];
    return {
      ...a,
      categoria_nome: prod ? (catMap[prod.id_categoria] || "") : "",
      produto: prod || null,
    };
  });
}

// Produtos
export async function getProdutos() {
  return apiFetch("/produtos/");
}

// Endereços
export async function getEnderecos() {
  return apiFetch("/enderecos/");
}

export async function criarEndereco(dados) {
  return apiFetch("/enderecos/", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// Pedidos
export async function getMeusPedidos() {
  return apiFetch("/pedidos/");
}

export async function criarPedido(dados) {
  return apiFetch("/pedidos/", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function cancelarPedido(id) {
  return apiFetch(`/pedidos/${id}`, { method: "DELETE" });
}
