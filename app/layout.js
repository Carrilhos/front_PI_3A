import "./globals.css";
import Header from "@/components/Header/Header";

export const metadata = {
  title: "HardwareStore - Marketplace de Hardware",
  description: "Compre e venda peças de hardware novas e usadas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
