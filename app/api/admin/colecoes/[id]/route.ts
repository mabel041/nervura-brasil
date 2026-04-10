import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const colecao = await prisma.colecao.update({
    where: { id: params.id },
    data: {
      nome: body.nome,
      slug: body.slug,
      subtitulo: body.subtitulo,
      imagem: body.imagem,
      href: body.href,
      ordem: body.ordem,
      ativo: body.ativo,
    },
  });
  return NextResponse.json(colecao);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.colecao.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
