import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      numero: true,
      status: true,
      mpStatus: true,
      pixQrCode: true,
      pixCopiaCola: true,
    },
  });

  if (!pedido) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  return NextResponse.json(pedido);
}
