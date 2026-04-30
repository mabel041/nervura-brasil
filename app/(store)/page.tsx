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

  const heroImage =
    aparencia?.homeHeroImagem ??
    produtos[0]?.imagens?.[0] ??
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600";

  const historiaImagem =
    aparencia?.sobreImagem ??
    produtos[1]?.imagens?.[0] ??
    heroImage;

  const colecaoPrincipal = colecoes.find((colecao) => colecao.href === "/copa-2026");
  const colecoesSecundarias = colecoes.filter((colecao) => colecao.href !== "/copa-2026").slice(0, 2);
  const imagensHistoria = [
    historiaImagem,
    produtos[0]?.imagens?.[0] ?? heroImage,
    produtos[2]?.imagens?.[0] ?? heroImage,
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5 bg-[#f8f3eb]">
        <div className="grid min-h-[calc(100svh-10rem)] grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)]">
          <div className="relative flex items-center bg-nervura-verde px-6 py-16 sm:px-10 lg:px-14 xl:px-20">
            <div className="rise-in max-w-xl">
              <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-nervura-ouro/90">
                Nervura Brasil
              </p>
              <h1 className="font-serif text-5xl font-light leading-[0.92] tracking-[-0.04em] text-[#f6efe1] sm:text-6xl lg:text-7xl">
                {aparencia?.homeHeroTitulo ?? "Moda com Alma Brasileira"}
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#d8d1c0] sm:text-lg">
                {aparencia?.homeHeroSubtitulo ??
                  "Pecas de presenca calma, cor precisa e identidade brasileira para uma vitrine mais autoral."}
              </p>
              <div className="rise-in-delayed mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href={aparencia?.homeHeroBotaoLink ?? "/catalogo"} className="btn-primary">
                  {aparencia?.homeHeroBotaoTexto ?? "Explorar Catalogo"}
                </Link>
                <Link
                  href="/copa-2026"
                  className="btn-outline border-[#d7c28a] text-[#f5e7bf] hover:border-nervura-ouro hover:bg-nervura-ouro hover:text-nervura-texto-principal"
                >
                  Ver Colecao Copa
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[28rem] lg:min-h-full">
            <Image
              src={heroImage}
              alt="Editorial Nervura Brasil"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-black/5" />
          </div>
        </div>
      </section>

      <section className="editorial-shell py-16 lg:py-20">
        <div className="mb-8 flex flex-col gap-3 lg:mb-10">
          <p className="section-kicker">Capitulos da temporada</p>
          <h2 className="max-w-xl font-serif text-3xl leading-tight tracking-[-0.03em] text-nervura-verde sm:text-4xl">
            Colecoes com imagem mais forte, menos ruido e leitura mais premium.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
          <Link href={colecaoPrincipal?.href ?? "/copa-2026"} className="group relative min-h-[28rem] overflow-hidden bg-[#e9e1d3]">
            {colecaoPrincipal?.imagem ? (
              <Image
                src={colecaoPrincipal.imagem}
                alt={colecaoPrincipal.nome}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            ) : (
              <div className="h-full w-full bg-nervura-verde" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0dfb5]">
                Edicao limitada
              </p>
              <h3 className="max-w-md font-serif text-4xl leading-none tracking-[-0.03em] text-white sm:text-5xl">
                {colecaoPrincipal?.nome ?? "Copa 2026"}
              </h3>
              <span className="mt-5 inline-block border-b border-white pb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                Ver colecao
              </span>
            </div>
          </Link>

          <div className="grid gap-5">
            {colecoesSecundarias.map((colecao) => (
              <Link key={colecao.id} href={colecao.href} className="group relative min-h-[13rem] overflow-hidden bg-[#ece4d6]">
                {colecao.imagem ? (
                  <Image
                    src={colecao.imagem}
                    alt={colecao.nome}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 34vw"
                  />
                ) : (
                  <div className="h-full w-full bg-[#d7cfbf]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f0dfb5]">
                    {colecao.subtitulo || "Curadoria"}
                  </p>
                  <h3 className="font-serif text-2xl leading-tight text-white">{colecao.nome}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#f2ece2] py-14">
        <div className="editorial-shell">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div>
              <p className="section-kicker mb-3">Colecao especial</p>
              <h2 className="font-serif text-4xl tracking-[-0.03em] text-nervura-verde">Copa 2026</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-nervura-texto-secundario sm:text-base">
                Uma leitura mais limpa da campanha para a vitrine principal, com peso de marca e foco na conversao.
              </p>
            </div>
            <ContadorCopa />
            <Link href="/copa-2026" className="btn-outline justify-self-start lg:justify-self-end">
              Ver Colecao
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f2e8] py-16 lg:py-20">
        <div className="editorial-shell">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker mb-3">Curadoria Nervura</p>
              <h2 className="font-serif text-3xl tracking-[-0.03em] text-nervura-verde sm:text-4xl">
                Destaques com mais imagem e menos cara de card.
              </h2>
            </div>
            <Link href="/catalogo" className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-nervura-verde transition-colors hover:text-nervura-ouro">
              Ver todo o catalogo
            </Link>
          </div>

          {produtos.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.map((p) => (
                <CardProduto key={p.id} produto={p} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-nervura-texto-muted">
              Em breve, novas pecas entram nesta selecao.
            </p>
          )}
        </div>
      </section>

      <section id="nossa-historia" className="editorial-shell py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="section-kicker mb-4">Nossa historia</p>
            <h2
              className="max-w-xl font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-nervura-verde sm:text-5xl"
              style={{ whiteSpace: "pre-line" }}
            >
              {aparencia?.sobreTitulo ?? "Feito para a mulher brasileira, com alma brasileira"}
            </h2>
            {aparencia?.sobreDescricao ? (
              <div className="mt-6 space-y-5 text-base leading-8 text-nervura-texto-secundario">
                {aparencia.sobreDescricao.split("\n\n").map((paragrafo, i) => (
                  <p key={i}>{paragrafo}</p>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-5 text-base leading-8 text-nervura-texto-secundario">
                <p>
                  A Nervura Brasil nasceu para vestir com presenca, textura e identidade. A proposta aqui deixa essa intencao mais visivel logo no primeiro scroll.
                </p>
                <p>
                  Menos bloco, mais hierarquia. Menos ornamento, mais imagem, tipografia e materia. Essa e a direcao que combina melhor com o tamanho atual do catalogo.
                </p>
              </div>
            )}
            <div className="mt-8">
              <Link href="/catalogo" className="btn-outline">
                {aparencia?.sobreBotaoTexto ?? "Explorar colecoes"}
              </Link>
            </div>
          </div>

          <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            <div className="pt-10">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe2d5]">
                <Image src={imagensHistoria[0]} alt="Imagem editorial Nervura" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 24vw" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe2d5]">
                <Image src={imagensHistoria[1]} alt="Atelie e colecao" fill className="object-cover grayscale" sizes="(max-width: 1024px) 50vw, 20vw" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe2d5]">
                <Image src={imagensHistoria[2]} alt="Curadoria de pecas" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
