import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { enviarEmailEnvio } from "@/lib/resend";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const pedido = await prisma.pedido.findUnique({
    where: { id: params.id },
    include: {
      itens: { include: { produto: true } },
      cliente: true,
    },
  });

  if (!pedido) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(pedido);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { status, rastreio } = await req.json();

  const pedido = await prisma.pedido.update({
    where: { id: params.id },
    data: {
      ...(status ? { status } : {}),
      ...(rastreio ? { rastreio } : {}),
    },
  });

  // Enviar email de envio se status = enviado e tiver rastreio
  if (status === "enviado" && rastreio) {
    await enviarEmailEnvio({
      to: pedido.emailCliente,
      nomeCliente: pedido.nomeCliente,
      numeroPedido: pedido.numero,
      rastreio,
    }).catch(console.error);
  }

  return NextResponse.json(pedido);
}
