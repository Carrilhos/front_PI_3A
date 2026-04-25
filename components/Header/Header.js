"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, isLogado, isVendedor, logout } = useAuth();
  const { totalItens } = useCart();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          HardwareStore
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>Início</Link>
          <Link href="/hardwares" className={styles.link}>Ver Hardwares</Link>
          <Link href="/montar-pc" className={styles.link}>Monte seu PC</Link>
          {isVendedor && (
            <Link href="/vendedor" className={styles.link}>Área do Vendedor</Link>
          )}
        </nav>

        <div className={styles.acoes}>
          <Link href="/carrinho" className={styles.carrinho}>
            🛒 {totalItens > 0 && <span className={styles.badge}>{totalItens}</span>}
          </Link>

          {isLogado ? (
            <div className={styles.usuario}>
              <Link href="/meus-pedidos" className={styles.link}>
                {user?.nome}
              </Link>
              <button onClick={handleLogout} className={styles.btnSair}>
                Sair
              </button>
            </div>
          ) : (
            <div className={styles.auth}>
              <Link href="/login" className={styles.link}>Entrar</Link>
              <Link href="/cadastro" className={styles.btnCadastro}>Cadastrar</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
