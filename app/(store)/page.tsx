import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CardProduto } from "@/components/loja/CardProduto";

export const dynamic = "force-dynamic";

async function getProdutosDestaque() {
  return prisma.produto.findMany({
    where: { ativo: true, destaque: true },
    take: 8,
    orderBy: { criadoEm: "desc" },
    include: { variacoes: true },
  });
}

async function getAparencia() {
  return prisma.aparencia.findUnique({ where: { id: "aparencia" } });
}

export default async function HomePage() {
  const [produtos, aparencia] = await Promise.all([
    getProdutosDestaque(),
    getAparencia(),
  ]);

  const heroImage =
    aparencia?.homeHeroImagem ??
    produtos[0]?.imagens?.[0] ??
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600";

  return (
    <div className="bg-[#fcf9f8]">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden border border-[#e5dccd] bg-[#f8f0de]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.28fr]">
            <div className="flex items-center bg-nervura-verde px-8 py-10 sm:px-10 lg:px-12">
              <div className="max-w-[26rem]">
                <h1 className="font-serif text-[2.7rem] leading-[0.9] tracking-[-0.04em] text-[#f8f1df] sm:text-[3.2rem]">
                  {aparencia?.homeHeroTitulo ?? "Moda com Alma Brasileira"}
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[#efe4c6] sm:text-base">
                  {aparencia?.homeHeroSubtitulo ??
                    "Pecas exclusivas que celebram a forca, a elegancia e a identidade da mulher brasileira."}
                </p>
                <div className="mt-7">
                  <Link href="/catalogo" className="btn-primary">
                    {aparencia?.homeHeroBotaoTexto ?? "Ver colecao"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative min-h-[18rem] sm:min-h-[24rem] lg:min-h-[26rem]">
              <Image
                src={heroImage}
                alt="Nervura Brasil"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 62vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        {produtos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {produtos.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-nervura-texto-muted">
            Em breve, novas pecas disponíveis.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link href="/catalogo" className="btn-outline">
            Ver todos os produtos
          </Link>
        </div>
      </section>
    </div>
  );
}
