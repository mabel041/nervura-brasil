import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { codigo, subtotal } = await req.json();

  if (!codigo) {
    return NextResponse.json({ error: "Código obrigatório" }, { status: 400 });
  }

  const cupom = await prisma.cupom.findUnique({
    where: { codigo: codigo.toUpperCase() },
  });

  if (!cupom) {
    return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
  }

  if (!cupom.ativo) {
    return NextResponse.json({ error: "Cupom inativo" }, { status: 400 });
  }

  if (cupom.expiraEm && new Date() > cupom.expiraEm) {
    return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
  }

  if (cupom.maxUsos && cupom.usosAtuais >= cupom.maxUsos) {
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
  }

  if (cupom.minPedido && subtotal < cupom.minPedido) {
    return NextResponse.json(
      {
        error: `Pedido mínimo de R$ ${cupom.minPedido.toFixed(2)} para usar este cupom`,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    codigo: cupom.codigo,
    tipo: cupom.tipo,
    valor: cupom.valor,
    minPedido: cupom.minPedido,
  });
}
