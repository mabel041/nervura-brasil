import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const colecao = searchParams.get("colecao");
  const destaque = searchParams.get("destaque");
  const busca = searchParams.get("busca");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const precoMin = searchParams.get("precoMin");
  const precoMax = searchParams.get("precoMax");
  const cor = searchParams.get("cor");
  const tamanho = searchParams.get("tamanho");
  const orderBy = searchParams.get("orderBy") ?? "criadoEm_desc";

  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { ativo: true };
  if (colecao) where.colecoes = { has: colecao };
  if (destaque === "true") where.destaque = true;
  if (busca) where.nome = { contains: busca, mode: "insensitive" };
  if (precoMin || precoMax) {
    where.preco = {};
    if (precoMin) where.preco.gte = parseFloat(precoMin);
    if (precoMax) where.preco.lte = parseFloat(precoMax);
  }
  if (cor || tamanho) {
    where.variacoes = {
      some: {
        ...(cor ? { cor } : {}),
        ...(tamanho ? { tamanho } : {}),
        estoque: { gt: 0 },
      },
    };
  }

  const [campo, direcao] = orderBy.split("_");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order: any = { [campo]: direcao };

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      skip,
      take: limit,
      orderBy: order,
      include: {
        variacoes: true,
      },
    }),
    prisma.produto.count({ where }),
  ]);

  return NextResponse.json({
    produtos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
