import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProdutoDetalhes } from "@/components/loja/ProdutoDetalhes";
import { RodapeSociais } from "@/components/loja/RodapeSociais";
import { Reviews } from "@/components/loja/Reviews";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const produto = await prisma.produto.findUnique({
    where: { slug: params.slug, ativo: true },
  });
  if (!produto) return {};
  return {
    title: produto.nome,
    description: produto.descricao.slice(0, 160),
    openGraph: {
      images: produto.imagens[0] ? [produto.imagens[0]] : [],
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const produto = await prisma.produto.findUnique({
    where: { slug: params.slug, ativo: true },
    include: { variacoes: true },
  });

  if (!produto) notFound();

  // Produtos relacionados
  const relacionados = await prisma.produto.findMany({
    where: { colecoes: { hasSome: produto.colecoes }, ativo: true, id: { not: produto.id } },
    take: 4,
    include: { variacoes: true },
  });

  return (
    <>
      <ProdutoDetalhes
        produto={{
          ...produto,
          imagensPorCor: (produto.imagensPorCor as Record<string, string[]> | null) ?? null,
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        relacionados={relacionados.map((r) => ({ ...r, imagensPorCor: (r.imagensPorCor as Record<string, string[]> | null) ?? null })) as any}
      />
      <div className="border-t border-nervura-borda bg-nervura-branco-quente">
        <Reviews produtoId={produto.id} />
      </div>
      <RodapeSociais />
    </>
  );
}
