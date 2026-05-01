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

async function getProdutosCopa() {
  return prisma.produto.findMany({
    where: { ativo: true, colecoes: { has: "copa-2026" } },
    take: 3,
    orderBy: [{ destaque: "desc" }, { criadoEm: "desc" }],
    include: { variacoes: true },
  });
}

async function getAparencia() {
  return prisma.aparencia.findUnique({ where: { id: "aparencia" } });
}

export default async function HomePage() {
  const [produtos, colecoes, produtosCopa, aparencia] = await Promise.all([
    getProdutosDestaque(),
    getColecoes(),
    getProdutosCopa(),
    getAparencia(),
  ]);

  const produtosVitrine = produtos.slice(0, 3);
  const heroImage =
    aparencia?.homeHeroImagem ??
    produtos[0]?.imagens?.[0] ??
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800";

  const produtoHero = produtosCopa[0] ?? produtos[0];
  const imagemHero =
    produtoHero?.imagens?.[0] ??
    produtoHero?.imagens?.[1] ??
    heroImage;

  const historiaImagem =
    aparencia?.sobreImagem ??
    produtos[1]?.imagens?.[0] ??
    heroImage;

  const imagemColecao =
    produtosCopa[0]?.imagens?.[1] ??
    produtosCopa[0]?.imagens?.[0] ??
    produtos[2]?.imagens?.[0] ??
    heroImage;

  const galeriaFinal = [
    produtos[0]?.imagens?.[0],
    produtos[1]?.imagens?.[0],
    produtos[2]?.imagens?.[0],
  ].filter(Boolean) as string[];

  const textoHistoria = aparencia?.sobreDescricao?.split("\n\n").filter(Boolean).slice(0, 2);
  const tituloHero = aparencia?.homeHeroTitulo ?? "Moda com alma brasileira.";
  const subtituloHero =
    aparencia?.homeHeroSubtitulo ??
    "Pecas autorais com caimento preciso, materias leves e presenca silenciosa.";

  return (
    <div className="pb-24">
      <section className="editorial-bleed relative overflow-hidden bg-[#173f28] text-[#fcf9f8]">
        <div className="absolute inset-0">
          <Image
            src={imagemHero}
            alt="Colecao em destaque"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,46,29,0.92)_0%,rgba(16,46,29,0.82)_34%,rgba(16,46,29,0.18)_66%,rgba(16,46,29,0.08)_100%)]" />
        </div>

        <div className="editorial-grid relative min-h-[calc(100svh-7.75rem)] py-14 sm:py-16 lg:flex lg:min-h-[calc(100svh-8.4rem)] lg:items-end lg:py-20">
          <div className="max-w-[34rem] lg:pb-8">
            <p className="font-['var(--font-space-grotesk)'] text-[11px] uppercase tracking-[0.34em] text-[#e2c56b]">
              Nervura Brasil
            </p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-[3.5rem] leading-[0.92] tracking-[-0.04em] sm:text-[4.5rem] lg:text-[5.4rem]">
              {tituloHero}
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-white/84 sm:text-[17px]">
              {subtituloHero}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={aparencia?.homeHeroBotaoLink ?? "/catalogo"} className="btn-primary bg-[#d4af37] text-[#1c1b1b] border-[#d4af37] hover:bg-[#e3c76b]">
                {aparencia?.homeHeroBotaoTexto ?? "Explorar colecao"}
              </Link>
              <Link href="/copa-2026" className="btn-outline border-white/35 text-white hover:border-white hover:bg-white hover:text-[#173f28]">
                Colecao Copa 2026
              </Link>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/12 bg-[#fcf9f8] text-[#1c1b1b]">
          <div className="editorial-grid grid gap-8 py-7 lg:grid-cols-[1.25fr_0.85fr_0.9fr] lg:items-center">
            <div>
              <p className="section-kicker text-[#8b7f67]">Colecao especial</p>
              <h2 className="mt-2 font-serif text-[2rem] leading-[1] tracking-[-0.03em] text-[#1a472a] sm:text-[2.6rem]">
                Copa 2026 com foco em produto, nao em bloco promocional.
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-sm leading-6 text-[#5b625c]">
                A campanha entra como capitulo da vitrine, com leitura mais limpa e menos cara de caixa central.
              </p>
            </div>
            <div className="justify-self-start lg:justify-self-end">
              <Link href="/copa-2026" className="btn-outline">
                Ver campanha
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-grid mt-16 lg:mt-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[26rem] overflow-hidden bg-[#ece8e3] sm:min-h-[34rem]">
              <Image
                src={imagemColecao}
                alt="Colecao Copa 2026"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />
            </div>

            <div className="flex flex-col justify-between gap-8 border-t border-[#1a472a]/12 pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div>
                <p className="section-kicker">Contagem regressiva</p>
                <h3 className="mt-3 font-serif text-[2rem] leading-[0.98] tracking-[-0.03em] text-[#1a472a]">
                  Um unico foco comercial para a campanha especial.
                </h3>
              </div>
              <ContadorCopa />
              <div className="grid grid-cols-2 gap-6 border-t border-[#1a472a]/10 pt-6">
                <div>
                  <p className="section-kicker">Pecas</p>
                  <p className="mt-2 font-serif text-[2rem] leading-none text-[#1a472a]">{produtosCopa.length}</p>
                </div>
                <div>
                  <p className="section-kicker">Colecoes</p>
                  <p className="mt-2 font-serif text-[2rem] leading-none text-[#1a472a]">{colecoes.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[28rem]">
            <p className="section-kicker">Selecao da semana</p>
            <h2 className="mt-3 font-serif text-[2.7rem] leading-[0.94] tracking-[-0.04em] text-[#1a472a] sm:text-[3.2rem]">
              Menos caixas. Mais imagem, ritmo e valor percebido.
            </h2>
            <p className="mt-5 editorial-copy">
              A vitrine principal agora respira melhor no desktop e deixa o produto sustentar a pagina.
            </p>
          </div>
        </div>
      </section>

      <section className="editorial-grid mt-16 lg:mt-24">
        <div className="flex items-end justify-between gap-6 border-b border-[#1a472a]/12 pb-5">
          <div>
            <p className="section-kicker">Curadoria Nervura</p>
            <h2 className="mt-2 font-serif text-[2.4rem] leading-[0.96] tracking-[-0.03em] text-[#1a472a]">
              Destaques com leitura mais aberta.
            </h2>
          </div>
          <Link href="/catalogo" className="hidden font-['var(--font-space-grotesk)'] text-[11px] uppercase tracking-[0.26em] text-[#1a472a] md:block">
            Ver catalogo completo
          </Link>
        </div>

        {produtosVitrine.length > 0 ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {produtosVitrine.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-nervura-texto-muted">
            Em breve, novas pecas entram nesta selecao.
          </p>
        )}
      </section>

      <section id="nossa-historia" className="editorial-grid mt-16 lg:mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[30rem] overflow-hidden bg-[#ece8e3]">
            <Image
              src={historiaImagem}
              alt="Nossa historia"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>

          <div className="lg:pl-10">
            <p className="section-kicker">Nossa historia</p>
            <h2 className="mt-3 max-w-[12ch] font-serif text-[2.7rem] leading-[0.94] tracking-[-0.04em] text-[#1a472a] sm:text-[3.2rem]">
              Presenca calma, corte preciso e identidade brasileira.
            </h2>
            <div className="mt-6 space-y-4 editorial-copy">
              {textoHistoria?.length ? (
                textoHistoria.map((paragrafo, index) => <p key={index}>{paragrafo}</p>)
              ) : (
                <>
                  <p>
                    Nervura Brasil nasce de uma feminilidade brasileira mais limpa, segura e autoral.
                  </p>
                  <p>
                    Cada peca e pensada para sustentar forma, movimento e naturalidade sem excesso visual.
                  </p>
                </>
              )}
            </div>
            <div className="mt-8">
              <Link href="/catalogo" className="btn-primary">
                {aparencia?.sobreBotaoTexto ?? "Explorar colecoes"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-grid mt-16 lg:mt-24">
        <div className="grid gap-10 border-y border-[#1a472a]/10 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-md">
            <p className="section-kicker">Fechamento da home</p>
            <h2 className="mt-3 font-serif text-[2.5rem] leading-[0.94] tracking-[-0.04em] text-[#1a472a]">
              A campanha continua, mas sem travar a pagina num retangulo central.
            </h2>
            <p className="mt-5 editorial-copy">
              O encerramento ficou mais horizontal, com menos moldura e com imagem trabalhando a favor da composicao.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-primary">
                Ver catalogo
              </Link>
              <Link href="/copa-2026" className="btn-outline">
                Ver colecao
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {galeriaFinal.map((imagem, index) => (
              <div
                key={`${imagem}-${index}`}
                className={`relative overflow-hidden bg-[#ece8e3] ${index === 1 ? "sm:translate-y-8" : ""}`}
              >
                <Image
                  src={imagem}
                  alt={`Editorial ${index + 1}`}
                  width={800}
                  height={1000}
                  className={`h-full w-full object-cover ${index === 1 ? "grayscale" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
