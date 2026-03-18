import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CardProduto } from "@/components/loja/CardProduto";
import { RodapeSociais } from "@/components/loja/RodapeSociais";
import { ContadorCopa } from "@/components/loja/ContadorCopa";

async function getProdutosDestaque() {
  return prisma.produto.findMany({
    where: { ativo: true, destaque: true },
    take: 6,
    orderBy: { criadoEm: "desc" },
    include: { variacoes: true },
  });
}

async function getConfiguracoes() {
  return prisma.configuracao.findUnique({ where: { id: "config" } });
}

async function getColecoes() {
  return prisma.colecao.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } });
}

export default async function HomePage() {
  const [produtos, config, colecoes] = await Promise.all([getProdutosDestaque(), getConfiguracoes(), getColecoes()]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] bg-nervura-verde flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-nervura-ouro font-sans text-sm uppercase tracking-[0.3em] mb-4">
            Moda Feminina Brasileira
          </p>
          <h1 className="font-serif text-5xl sm:text-7xl font-light text-nervura-creme mb-6 leading-tight">
            Nervura<br />
            <span className="font-bold">Brasil</span>
          </h1>
          <p className="text-nervura-texto-muted text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Peças exclusivas que celebram a força, elegância e identidade da mulher brasileira.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalogo" className="btn-primary text-base px-8 py-4">
              Ver Catálogo
            </Link>
            <Link href="/copa-2026" className="btn-outline border-nervura-ouro text-nervura-ouro hover:bg-nervura-ouro hover:text-nervura-verde text-base px-8 py-4">
              Coleção Copa 2026
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Copa 2026 */}
      <section className="bg-gradient-to-r from-nervura-verde via-nervura-verde-medio to-nervura-verde py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-nervura-ouro font-sans text-xs uppercase tracking-widest mb-2">
            Coleção Especial
          </p>
          <h2 className="font-serif text-4xl text-nervura-creme mb-4">Copa 2026</h2>
          <p className="text-nervura-texto-muted mb-6 max-w-lg mx-auto">
            Vista-se com orgulho. A coleção mais especial do ano chegou.
          </p>
          <ContadorCopa />
          <Link href="/copa-2026" className="inline-block mt-6 bg-nervura-ouro text-nervura-verde font-bold px-8 py-3 rounded transition-opacity hover:opacity-90">
            Ver Coleção →
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-nervura-texto-muted font-sans text-xs uppercase tracking-widest mb-2">
            Seleção Especial
          </p>
          <h2 className="font-serif text-4xl text-nervura-texto-principal">Destaques</h2>
        </div>

        {produtos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
            {produtos.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-nervura-texto-muted py-12">
            Em breve novidades incríveis!
          </p>
        )}

        <div className="text-center mt-10">
          <Link href="/catalogo" className="btn-outline">
            Ver todos os produtos
          </Link>
        </div>
      </section>

      {/* Coleções */}
      {colecoes.length > 0 && (
        <section className="bg-nervura-creme-escuro py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-4xl text-nervura-texto-principal">Nossas Coleções</h2>
            </div>
            <div className={`grid grid-cols-1 gap-6 ${colecoes.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {colecoes.map((col) => (
                <Link key={col.id} href={col.href} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
                  {col.imagem ? (
                    <Image
                      src={col.imagem}
                      alt={col.nome}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-nervura-verde-medio" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="text-xs uppercase tracking-widest mb-1 text-nervura-ouro">
                      {col.subtitulo}
                    </p>
                    <h3 className="font-serif text-2xl">{col.nome}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nossa História */}
      <section id="nossa-historia" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
              alt="Nossa história"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-nervura-ouro font-sans text-xs uppercase tracking-widest mb-3">
              Nossa História
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-nervura-texto-principal mb-6 leading-tight">
              Feito para a mulher brasileira, com alma brasileira
            </h2>
            <p className="text-nervura-texto-secundario leading-relaxed mb-4">
              A Nervura Brasil nasceu da vontade de criar roupas que contam histórias. Cada peça é
              desenvolvida com atenção aos detalhes, materiais selecionados e um olhar apaixonado
              pela cultura brasileira.
            </p>
            <p className="text-nervura-texto-secundario leading-relaxed mb-8">
              Do canelado clássico às peças que celebram o futebol brasileiro, somos uma marca
              que acredita que moda é expressão, identidade e amor próprio.
            </p>
            <Link href="/catalogo" className="btn-primary">
              Explorar coleções
            </Link>
          </div>
        </div>
      </section>

      <RodapeSociais
        instagramUrl={config?.instagramUrl ?? undefined}
        tiktokUrl={config?.tiktokUrl ?? undefined}
        facebookUrl={config?.facebookUrl ?? undefined}
        whatsappNumero={config?.whatsappNumero ?? undefined}
      />
    </>
  );
}
