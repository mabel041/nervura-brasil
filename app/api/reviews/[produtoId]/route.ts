import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { produtoId: string } }) {
  const reviews = await prisma.review.findMany({
    where: { produtoId: params.produtoId, aprovado: true },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(reviews, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(req: NextRequest, { params }: { params: { produtoId: string } }) {
  const body = await req.json();

  if (!body.nome || !body.email || !body.comentario || !body.nota) {
    return NextResponse.json({ error: "Campos obrigatÃ³rios faltando" }, { status: 400 });
  }

  if (typeof body.nome !== "string" || body.nome.length > 100) {
    return NextResponse.json({ error: "Nome invÃ¡lido" }, { status: 400 });
  }
  if (
    typeof body.email !== "string" ||
    body.email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  ) {
    return NextResponse.json({ error: "E-mail invÃ¡lido" }, { status: 400 });
  }
  if (typeof body.comentario !== "string" || body.comentario.length > 1000) {
    return NextResponse.json(
      { error: "ComentÃ¡rio muito longo (mÃ¡x. 1000 caracteres)" },
      { status: 400 }
    );
  }
  if (body.titulo && (typeof body.titulo !== "string" || body.titulo.length > 150)) {
    return NextResponse.json({ error: "TÃ­tulo muito longo (mÃ¡x. 150 caracteres)" }, { status: 400 });
  }

  const nota = Number(body.nota);
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return NextResponse.json({ error: "Nota deve ser entre 1 e 5" }, { status: 400 });
  }

  const sanitizar = (str: string) => str.replace(/<[^>]*>/g, "").trim();

  const review = await prisma.review.create({
    data: {
      produtoId: params.produtoId,
      nome: sanitizar(body.nome),
      email: body.email.trim().toLowerCase(),
      nota,
      titulo: body.titulo ? sanitizar(body.titulo) : null,
      comentario: sanitizar(body.comentario),
      aprovado: false,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
