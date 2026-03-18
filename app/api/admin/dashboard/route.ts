import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [totalPedidos, pedidosMes, receitaMes, produtosBaixoEstoque] = await Promise.all([
    prisma.pedido.count(),
    prisma.pedido.count({
      where: {
        criadoEm: { gte: inicioMes },
        status: { in: ["pago", "enviado", "entregue"] },
      },
    }),
    prisma.pedido.aggregate({
      where: {
        criadoEm: { gte: inicioMes },
        status: { in: ["pago", "enviado", "entregue"] },
      },
      _sum: { total: true },
    }),
    prisma.variacao.findMany({
      where: { estoque: { lte: 5, gt: 0 } },
      include: { produto: { select: { nome: true, slug: true } } },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    totalPedidos,
    pedidosMes,
    receitaMes: receitaMes._sum.total ?? 0,
    produtosBaixoEstoque,
  });
}
