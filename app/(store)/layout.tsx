import { Suspense } from "react";
import { Header } from "@/components/loja/Header";
import { BannerPromocao } from "@/components/loja/BannerPromocao";
import { BotaoWhatsApp } from "@/components/loja/BotaoWhatsApp";
import { PixelProvider } from "@/components/PixelProvider";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <PixelProvider />
      </Suspense>
      <BannerPromocao
        texto="🏆 Coleção Copa 2026 chegou! Use COPA10 para 10% off"
        linkHref="/copa-2026"
        linkLabel="Ver coleção →"
      />
      <Header />
      <main className="min-h-screen">{children}</main>
      <BotaoWhatsApp />
    </>
  );
}
