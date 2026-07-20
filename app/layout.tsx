import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anny Gabrielly | Sites e Sistemas",
  description: "Sites profissionais, sistemas personalizados e manutenção para empresas de todos os tamanhos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
