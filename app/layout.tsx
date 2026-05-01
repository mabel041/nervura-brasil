import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nervura Brasil — Moda Feminina Brasileira",
    template: "%s | Nervura Brasil",
  },
  description:
    "Roupas femininas brasileiras com identidade. Coleções exclusivas: canelado, basics e Copa 2026.",
  keywords: ["moda feminina", "roupas brasileiras", "nervura brasil", "copa 2026", "canelado"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://nervurabrasil.com.br",
    siteName: "Nervura Brasil",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
