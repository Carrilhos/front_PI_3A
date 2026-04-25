import { Suspense } from "react";
import LoginPage from "./LoginPage";

export const metadata = {
  title: "Entrar - HardwareStore",
  description: "Acesse sua conta de comprador ou vendedor no HardwareStore.",
};

export default function LoginRoute() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
