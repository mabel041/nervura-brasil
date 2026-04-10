import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const colecoes = await prisma.colecao.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(colecoes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

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
