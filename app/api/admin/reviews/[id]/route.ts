import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const review = await prisma.review.update({
    where: { id: params.id },
    data: { aprovado: Boolean(body.aprovado) },
  });
  return NextResponse.json(review);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
