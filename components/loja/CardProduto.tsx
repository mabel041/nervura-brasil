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
  colecao: string;
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
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-nervura-creme-escuro">
        <Image
          src={imagem}
          alt={produto.nome}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Image
          src={imagemHover}
          alt={produto.nome}
          fill
          className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {produto.destaque && (
            <span className="bg-nervura-ouro text-nervura-verde text-xs font-bold px-2 py-0.5 rounded">
              Destaque
            </span>
          )}
          {temDesconto && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{descPct}%
            </span>
          )}
          {produto.colecao === "copa-2026" && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              Copa 2026
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-sans text-sm font-medium text-nervura-texto-principal line-clamp-2 group-hover:text-nervura-verde transition-colors">
          {produto.nome}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {temDesconto ? (
            <>
              <span className="font-bold text-nervura-verde text-base">
                {formatCurrency(produto.precoPromo!)}
              </span>
              <span className="text-nervura-texto-muted text-sm line-through">
                {formatCurrency(produto.preco)}
              </span>
            </>
          ) : (
            <span className="font-bold text-nervura-verde text-base">
              {formatCurrency(produto.preco)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
