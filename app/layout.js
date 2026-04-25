import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import Header from "@/components/Header/Header";

export const metadata = {
  title: "HardwareStore - Marketplace de Hardware",
  description: "Compre e venda peças de hardware novas e usadas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CarrinhoProvider>
            <Header />
            <main>{children}</main>
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
