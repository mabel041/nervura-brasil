import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { CardProduto } from "@/components/loja/CardProduto";
import { ContadorCopa } from "@/components/loja/ContadorCopa";
import { RodapeSociais } from "@/components/loja/RodapeSociais";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coleção Copa 2026",
  description: "Vista-se com orgulho brasileiro. A coleção especial Copa 2026 da Nervura Brasil.",
};

async function getProdutosCopa() {
  return prisma.produto.findMany({
    where: { colecoes: { has: "copa-2026" }, ativo: true },
    orderBy: { destaque: "desc" },
    include: { variacoes: true },
  });
}

async function getAparencia() {
  return prisma.aparencia.findUnique({ where: { id: "aparencia" } });
}

export default async function Copa2026Page() {
  const [produtos, aparencia] = await Promise.all([getProdutosCopa(), getAparencia()]);

  return (
    <>
      {/* Hero Copa */}
      <section className="relative min-h-[60vh] bg-nervura-verde overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={aparencia?.copaHeroImagem ?? "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=1920"}
            alt="Copa 2026"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Detalhes decorativos verde/amarelo */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nervura-verde via-nervura-ouro to-nervura-verde" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-nervura-ouro text-nervura-verde text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-6">
            Coleção Especial
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl text-nervura-creme mb-4 leading-tight">
            {aparencia?.copaHeroTitulo ?? "Copa 2026"}
          </h1>
          <p className="text-nervura-texto-muted text-lg max-w-xl mx-auto mb-10">
            {aparencia?.copaHeroSubtitulo ?? "Vista a alma do Brasil. Peças exclusivas criadas para celebrar o maior evento de futebol do mundo."}
          </p>

          {/* Contador */}
          <div className="mb-4">
            <p className="text-nervura-ouro text-sm font-sans mb-4">Contagem regressiva para a Copa:</p>
            <ContadorCopa />
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl text-nervura-texto-principal">
            A Coleção
          </h2>
          <p className="text-nervura-texto-muted mt-2">{produtos.length} peças exclusivas</p>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-20 text-nervura-texto-muted">
            <p className="font-serif text-2xl mb-2">Em breve!</p>
            <p className="text-sm">A coleção Copa 2026 estará disponível em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {produtos.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        )}
      </section>

      <RodapeSociais />
    </>
  );
}
