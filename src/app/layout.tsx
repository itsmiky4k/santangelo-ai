import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angelo — Assistente Virtuale | Grotta di Sant'Angelo in Criptis",
  description: "Assistente virtuale del Centro Visite della Grotta di Sant'Angelo in Criptis, Santeramo in Colle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
