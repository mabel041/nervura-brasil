import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();

  const cupom = await prisma.cupom.update({
    where: { id: params.id },
    data: {
      ...body,
      codigo: body.codigo?.toUpperCase(),
      expiraEm: body.expiraEm ? new Date(body.expiraEm) : null,
    },
  });

  return NextResponse.json(cupom);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.cupom.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
