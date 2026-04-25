// Chaves usadas no localStorage
const TOKEN_KEY = "hs_token";
const USUARIO_KEY = "hs_usuario";

/**
 * Gera o hash SHA-256 de uma string e retorna em hex.
 * Usa a Web Crypto API nativa do browser.
 * @param {string} texto
 * @returns {Promise<string>}
 */
export async function sha256(texto) {
  const encoder = new TextEncoder();
  const dados = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Salva token e usuário no localStorage.
 * @param {string} token
 * @param {object} usuario
 */
export function salvarSessao(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

/**
 * Lê o token salvo.
 * @returns {string|null}
 */
export function lerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Lê o usuário salvo.
 * @returns {object|null}
 */
export function lerUsuario() {
  const raw = localStorage.getItem(USUARIO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Remove token e usuário do localStorage (logout).
 */
export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}

/**
 * Retorna o header Authorization pronto para usar no fetch/axios.
 * @returns {object}
 */
export function authHeader() {
  const token = lerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
