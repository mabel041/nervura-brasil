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
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ece8e3]">
        <Image
          src={imagem}
          alt={produto.nome}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03] group-hover:opacity-0"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 31vw"
        />
        <Image
          src={imagemHover}
          alt={produto.nome}
          fill
          className="absolute inset-0 object-cover opacity-0 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 31vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {produto.destaque && (
            <span className="bg-[#d4af37] px-2 py-1 font-['var(--font-space-grotesk)'] text-[9px] font-medium uppercase tracking-[0.16em] text-[#161811]">
              Destaque
            </span>
          )}
          {temDesconto && (
            <span className="bg-[#b94132] px-2 py-1 font-['var(--font-space-grotesk)'] text-[9px] font-medium uppercase tracking-[0.16em] text-white">
              -{descPct}%
            </span>
          )}
          {Array.isArray(produto.colecoes) && produto.colecoes.includes("copa-2026") && (
            <span className="bg-[#1a472a] px-2 py-1 font-['var(--font-space-grotesk)'] text-[9px] font-medium uppercase tracking-[0.16em] text-white">
              Copa 2026
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-4">
          <span className="font-['var(--font-space-grotesk)'] text-[9px] font-medium uppercase tracking-[0.24em] text-white/82">
            Curadoria nervura
          </span>
          <span className="translate-y-4 font-['var(--font-space-grotesk)'] text-[9px] font-medium uppercase tracking-[0.24em] text-[#d4af37] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ver peca
          </span>
        </div>
      </div>

      <div className="space-y-2 px-0 py-4">
        <p className="font-['var(--font-space-grotesk)'] text-[9px] font-medium uppercase tracking-[0.22em] text-[#7f8176]">
          Edicao selecionada
        </p>
        <h3 className="line-clamp-2 font-sans text-[16px] font-medium leading-6 text-[#1c1b1b] transition-colors group-hover:text-[#1a472a]">
          {produto.nome}
        </h3>
        <div className="flex items-center gap-2">
          {temDesconto ? (
            <>
              <span className="font-sans text-[18px] font-semibold text-[#1a472a]">
                {formatCurrency(produto.precoPromo!)}
              </span>
              <span className="font-sans text-xs text-[#8b8f82] line-through">
                {formatCurrency(produto.preco)}
              </span>
            </>
          ) : (
            <span className="font-sans text-[18px] font-semibold text-[#1a472a]">
              {formatCurrency(produto.preco)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
