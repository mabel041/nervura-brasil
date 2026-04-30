"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Produto {
  id: string;
  slug: string;
  nome: string;
  preco: number;
  precoPromo?: number | null;
  imagens: string[];
  colecoes: string[];
  destaque?: boolean;
}

interface CardProdutoProps {
  produto: Produto;
}

export function CardProduto({ produto }: CardProdutoProps) {
  const imagem = produto.imagens[0] ?? "/placeholder.jpg";
  const imagemHover = produto.imagens[1] ?? imagem;
  const temDesconto = produto.precoPromo && produto.precoPromo < produto.preco;
  const descPct = temDesconto
    ? Math.round(((produto.preco - produto.precoPromo!) / produto.preco) * 100)
    : 0;

  return (
    <Link href={`/produto/${produto.slug}`} className="group block card-produto">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efe8dc]">
        <Image
          src={imagem}
          alt={produto.nome}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02] group-hover:opacity-0"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Image
          src={imagemHover}
          alt={produto.nome}
          fill
          className="absolute inset-0 object-cover opacity-0 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {produto.destaque && (
            <span className="bg-nervura-ouro px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-nervura-texto-principal">
              Destaque
            </span>
          )}
          {temDesconto && (
            <span className="bg-[#b94132] px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              -{descPct}%
            </span>
          )}
          {Array.isArray(produto.colecoes) && produto.colecoes.includes("copa-2026") && (
            <span className="bg-nervura-verde px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              Copa 2026
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-white/30 bg-white/75 px-4 py-3 backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-nervura-verde">
            Ver peca
          </span>
        </div>
      </div>

      <div className="space-y-2 px-0 py-4">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-nervura-texto-muted">
          Curadoria Nervura
        </p>
        <h3 className="line-clamp-2 font-sans text-[15px] font-medium leading-6 text-nervura-texto-principal transition-colors group-hover:text-nervura-verde">
          {produto.nome}
        </h3>
        <div className="flex items-center gap-2">
          {temDesconto ? (
            <>
              <span className="font-sans text-lg font-semibold text-nervura-verde">
                {formatCurrency(produto.precoPromo!)}
              </span>
              <span className="font-sans text-sm text-nervura-texto-muted line-through">
                {formatCurrency(produto.preco)}
              </span>
            </>
          ) : (
            <span className="font-sans text-lg font-semibold text-nervura-verde">
              {formatCurrency(produto.preco)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
