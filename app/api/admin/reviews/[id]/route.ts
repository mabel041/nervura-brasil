import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Aprovar ou reprovar
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const review = await prisma.review.update({
    where: { id: params.id },
    data: { aprovado: body.aprovado },
  });
  return NextResponse.json(review);
}

// Excluir
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
