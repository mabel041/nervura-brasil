import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — buscar reviews aprovados de um produto
export async function GET(_: NextRequest, { params }: { params: { produtoId: string } }) {
  const reviews = await prisma.review.findMany({
    where: { produtoId: params.produtoId, aprovado: true },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(reviews);
}

// POST — enviar novo review
export async function POST(req: NextRequest, { params }: { params: { produtoId: string } }) {
  const body = await req.json();

  if (!body.nome || !body.email || !body.comentario || !body.nota) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  if (body.nota < 1 || body.nota > 5) {
    return NextResponse.json({ error: "Nota deve ser entre 1 e 5" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      produtoId: params.produtoId,
      nome: body.nome,
      email: body.email,
      nota: Number(body.nota),
      titulo: body.titulo ?? null,
      comentario: body.comentario,
      aprovado: false, // aguarda aprovação no admin
    },
  });

  return NextResponse.json(review, { status: 201 });
}
