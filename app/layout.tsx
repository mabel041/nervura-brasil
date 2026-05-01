import type { Metadata } from "next";
import { Manrope, Noto_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nervura Brasil - Moda Feminina Brasileira",
    template: "%s | Nervura Brasil",
  },
  description:
    "Roupas femininas brasileiras com identidade. Colecoes exclusivas: canelado, basics e Copa 2026.",
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
    <html lang="pt-BR" className={`${notoSerif.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
