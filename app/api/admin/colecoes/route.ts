import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const colecoes = await prisma.colecao.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(colecoes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const colecao = await prisma.colecao.create({
    data: {
      nome: body.nome,
      slug: body.slug,
      subtitulo: body.subtitulo ?? "",
      imagem: body.imagem ?? null,
      href: body.href,
      ordem: body.ordem ?? 0,
      ativo: body.ativo ?? true,
    },
  });
  return NextResponse.json(colecao);
}
