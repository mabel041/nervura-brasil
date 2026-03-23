import { Suspense } from "react";
import { Header } from "@/components/loja/Header";
import { BannerPromocao } from "@/components/loja/BannerPromocao";
import { BotaoWhatsApp } from "@/components/loja/BotaoWhatsApp";
import { PixelProvider } from "@/components/PixelProvider";
import { BarraPagamentos } from "@/components/loja/BarraPagamentos";
import { RodapeSociais } from "@/components/loja/RodapeSociais";
import { ChatWidget } from "@/components/loja/ChatWidget";
import { prisma } from "@/lib/prisma";

async function getConfig() {
  return prisma.configuracao.findUnique({ where: { id: "config" } });
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfig();
  return (
    <>
      <Suspense>
        <PixelProvider
          googleAnalyticsId={config?.googleAnalyticsId}
          googleAdsId={config?.googleAdsId}
        />
      </Suspense>
      <BannerPromocao
        texto="🏆 Coleção Copa 2026 chegou! Use COPA10 para 10% off"
        linkHref="/copa-2026"
        linkLabel="Ver coleção →"
      />
      <Header />
      <main className="min-h-screen">{children}</main>
      <BarraPagamentos />
      <RodapeSociais
        instagramUrl={config?.instagramUrl ?? undefined}
        tiktokUrl={config?.tiktokUrl ?? undefined}
        facebookUrl={config?.facebookUrl ?? undefined}
        whatsappNumero={config?.whatsappNumero ?? undefined}
      />
      <BotaoWhatsApp />
      <ChatWidget />
    </>
  );
}
