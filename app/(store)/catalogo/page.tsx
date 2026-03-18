import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CardProduto } from "@/components/loja/CardProduto";
import { FiltrosCatalogo } from "@/components/loja/FiltrosCatalogo";
import { RodapeSociais } from "@/components/loja/RodapeSociais";

interface SearchParams {
  colecao?: string;
  tamanho?: string;
  cor?: string;
  precoMin?: string;
  precoMax?: string;
  orderBy?: string;
  busca?: string;
  page?: string;
}

async function getProdutos(params: SearchParams) {
  const page = parseInt(params.page ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { ativo: true };
  if (params.colecao) where.colecao = params.colecao;
  if (params.busca) where.nome = { contains: params.busca, mode: "insensitive" };
  if (params.precoMin || params.precoMax) {
    where.preco = {};
    if (params.precoMin) where.preco.gte = parseFloat(params.precoMin);
    if (params.precoMax) where.preco.lte = parseFloat(params.precoMax);
  }
  if (params.cor || params.tamanho) {
    where.variacoes = {
      some: {
        ...(params.cor ? { cor: params.cor } : {}),
        ...(params.tamanho ? { tamanho: params.tamanho } : {}),
        estoque: { gt: 0 },
      },
    };
  }

  const [campo, direcao] = (params.orderBy ?? "criadoEm_desc").split("_");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderBy: any = { [campo]: direcao };

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({ where, skip, take: limit, orderBy, include: { variacoes: true } }),
    prisma.produto.count({ where }),
  ]);

  return { produtos, total, page, totalPages: Math.ceil(total / limit) };
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { produtos, total, page, totalPages } = await getProdutos(searchParams);

  const tituloColecao: Record<string, string> = {
    "copa-2026": "Copa 2026",
    canelado: "Canelado",
    basics: "Basics",
  };

  const titulo = searchParams.colecao
    ? tituloColecao[searchParams.colecao] ?? "Catálogo"
    : "Catálogo";

  return (
    <>
      {/* Header da página */}
      <div className="bg-nervura-verde py-10 px-4 text-center">
        <h1 className="font-serif text-4xl text-nervura-creme">{titulo}</h1>
        <p className="text-nervura-texto-muted mt-2 text-sm">{total} peças encontradas</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros */}
          <Suspense>
            <FiltrosCatalogo />
          </Suspense>

          {/* Grid */}
          <div className="flex-1">
            {produtos.length === 0 ? (
              <div className="text-center py-20 text-nervura-texto-muted">
                <p className="font-serif text-2xl mb-4">Nenhum produto encontrado</p>
                <Link href="/catalogo" className="btn-outline text-sm">
                  Limpar filtros
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {produtos.map((p) => (
                    <CardProduto key={p.id} produto={p} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                      const p = new URLSearchParams(
                        Object.entries(searchParams).filter(([, v]) => v) as [string, string][]
                      );
                      p.set("page", String(n));
                      return (
                        <Link
                          key={n}
                          href={`/catalogo?${p.toString()}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            n === page
                              ? "bg-nervura-verde text-nervura-creme"
                              : "border border-nervura-borda text-nervura-texto-secundario hover:border-nervura-verde"
                          }`}
                        >
                          {n}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <RodapeSociais />
    </>
  );
}
