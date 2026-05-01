import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import { CardProduto } from "@/components/loja/CardProduto";
import { ContadorCopa } from "@/components/loja/ContadorCopa";

async function getProdutosDestaque() {
  return prisma.produto.findMany({
    where: { ativo: true, destaque: true },
    take: 6,
    orderBy: { criadoEm: "desc" },
    include: { variacoes: true },
  });
}

async function getColecoes() {
  return prisma.colecao.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } });
}

async function getAparencia() {
  return prisma.aparencia.findUnique({ where: { id: "aparencia" } });
}

export default async function HomePage() {
  const [produtos, colecoes, aparencia] = await Promise.all([
    getProdutosDestaque(),
    getColecoes(),
    getAparencia(),
  ]);

  const produtosHome = produtos.slice(0, 4);
  const colecaoPrincipal = colecoes[0] ?? null;
  const heroImage =
    aparencia?.homeHeroImagem ??
    produtos[0]?.imagens?.[0] ??
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600";

  const historiaImagem =
    aparencia?.sobreImagem ??
    produtos[1]?.imagens?.[0] ??
    heroImage;

  const imagemColecao =
    colecaoPrincipal?.imagem ??
    produtosHome[0]?.imagens?.[1] ??
    produtosHome[0]?.imagens?.[0] ??
    heroImage;
  const imagemHistoriaSecundaria = produtosHome[1]?.imagens?.[0] ?? heroImage;

  return (
    <>
      <div className="bg-[#fcf9f8] py-5 lg:py-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-0 px-4 sm:px-6 lg:px-8">
          <section className="overflow-hidden border border-[#e5dccd] bg-[#f8f0de]">
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
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={aparencia?.homeHeroBotaoLink ?? "/catalogo"} className="btn-primary">
                      {aparencia?.homeHeroBotaoTexto ?? "Explorar Colecao"}
                    </Link>
                    <Link
                      href="/copa-2026"
                      className="inline-flex items-center justify-center border border-[#d8c49b] px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8f1df] transition-colors hover:bg-[#d4b24c] hover:text-nervura-texto-principal"
                    >
                      Colecao Copa 2026
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[18rem] sm:min-h-[24rem] lg:min-h-[25.5rem]">
                <Image
                  src={heroImage}
                  alt="Editorial Nervura Brasil"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 62vw"
                />
              </div>
            </div>
          </section>

          <section className="border-x border-b border-[#ebe0cc] bg-[#fbf3de] px-6 py-10 text-center sm:px-10 lg:px-16">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-nervura-texto-muted">
              Copa 2026
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-nervura-verde sm:text-[2.2rem]">
              Colecao Especial Copa 2026
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-nervura-texto-secundario">
              Vista-se com orgulho. A colecao mais especial do ano chegou.
            </p>
            <div className="mt-7 flex justify-center">
              <ContadorCopa />
            </div>
          </section>

          <section className="border-x border-b border-[#ebe0cc] bg-[#fcf6ea] px-6 py-10 sm:px-10 lg:px-16">
            <div className="text-center">
              <h2 className="font-serif text-3xl tracking-[-0.03em] text-nervura-verde">Destaques</h2>
            </div>

            {produtosHome.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                {produtosHome.map((p) => (
                  <CardProduto key={p.id} produto={p} />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-nervura-texto-muted">
                Em breve, novas pecas entram nesta selecao.
              </p>
            )}
          </section>

          <section
            id="nossa-historia"
            className="border-x border-b border-[#ebe0cc] bg-[#fbf3de] px-6 py-10 sm:px-10 lg:px-16"
          >
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
              <div className="relative aspect-[4/4.4] overflow-hidden bg-[#e7dcc8]">
                <Image
                  src={historiaImagem}
                  alt="Nossa historia"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 32vw"
                />
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.03em] text-nervura-verde sm:text-[2.2rem]">
                  Nossa Historia
                </h2>
                {aparencia?.sobreDescricao ? (
                  <div className="mt-4 space-y-4 text-sm leading-7 text-nervura-texto-secundario">
                    {aparencia.sobreDescricao.split("\n\n").slice(0, 2).map((paragrafo, i) => (
                      <p key={i}>{paragrafo}</p>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 space-y-4 text-sm leading-7 text-nervura-texto-secundario">
                    <p>
                      Nervura Brasil nasceu para celebrar uma feminilidade brasileira, intensa e precisa, com imagem forte e
                      elegancia silenciosa.
                    </p>
                    <p>
                      A selecao do site fica melhor quando a narrativa vem antes do excesso. O Stitch estava certo nisso, e a
                      home agora segue essa hierarquia.
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <Link href="/catalogo" className="btn-primary">
                    {aparencia?.sobreBotaoTexto ?? "Explorar colecoes"}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="border-x border-b border-[#ebe0cc] bg-[#fcf6ea] px-6 py-8 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="section-kicker mb-3">Colecao especial</p>
                <h3 className="font-serif text-[2rem] tracking-[-0.03em] text-nervura-verde">
                  {colecaoPrincipal?.nome ?? "Copa 2026"}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-nervura-texto-secundario">
                  {colecaoPrincipal?.subtitulo ||
                    "Um bloco de campanha mais compacto, mais proximo do Stitch e mais coerente com o tamanho atual da loja."}
                </p>
                <div className="mt-5">
                  <Link href={colecaoPrincipal?.href ?? "/copa-2026"} className="btn-outline">
                    Ver colecao
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden bg-[#d8ccb5]">
                <Image
                  src={imagemColecao}
                  alt={colecaoPrincipal?.nome ?? "Colecao Copa 2026"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 36vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </section>

          <section className="border-x border-b border-[#ebe0cc] bg-[#fcf9f8] px-6 py-8 sm:px-10 lg:px-16">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e7dcc8]">
                <Image
                  src={historiaImagem}
                  alt="Editorial principal"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e7dcc8]">
                <Image
                  src={imagemHistoriaSecundaria}
                  alt="Editorial secundario"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>
              <div className="relative hidden aspect-[4/5] overflow-hidden bg-[#e7dcc8] lg:block">
                <Image
                  src={produtosHome[2]?.imagens?.[0] ?? historiaImagem}
                  alt="Editorial adicional"
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
