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

export function CardProduto({ produto }: { produto: Produto }) {
  const imagem = produto.imagens[0] ?? "/placeholder.jpg";
  const imagemHover = produto.imagens[1] ?? imagem;
  const temDesconto = produto.precoPromo && produto.precoPromo < produto.preco;
  const descPct = temDesconto
    ? Math.round(((produto.preco - produto.precoPromo!) / produto.preco) * 100)
    : 0;

  return (
    <Link href={`/produto/${produto.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#efe8dc]">
        <Image
          src={imagem}
          alt={produto.nome}
          fill
          className="object-cover transition duration-500 group-hover:opacity-0"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Image
          src={imagemHover}
          alt={produto.nome}
          fill
          className="absolute inset-0 object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {produto.destaque && (
            <span className="bg-nervura-ouro px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-nervura-texto-principal">
              Destaque
            </span>
          )}
          {temDesconto && (
            <span className="bg-[#b94132] px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-white">
              -{descPct}%
            </span>
          )}
          {Array.isArray(produto.colecoes) && produto.colecoes.includes("copa-2026") && (
            <span className="bg-nervura-verde px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-white">
              Copa 2026
            </span>
          )}
        </div>
      </div>

      <div className="pt-2.5 pb-1">
        <h3 className="text-sm font-medium leading-snug text-nervura-texto-principal line-clamp-2 group-hover:text-nervura-verde transition-colors">
          {produto.nome}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {temDesconto ? (
            <>
              <span className="text-sm font-semibold text-nervura-verde">
                {formatCurrency(produto.precoPromo!)}
              </span>
              <span className="text-xs text-nervura-texto-muted line-through">
                {formatCurrency(produto.preco)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-nervura-verde">
              {formatCurrency(produto.preco)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
