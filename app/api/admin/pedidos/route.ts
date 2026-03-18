import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (status) where.status = status;

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      skip,
      take: limit,
      orderBy: { criadoEm: "desc" },
      include: { itens: { include: { produto: { select: { nome: true, imagens: true } } } } },
    }),
    prisma.pedido.count({ where }),
  ]);

  return NextResponse.json({ pedidos, total, page, totalPages: Math.ceil(total / limit) });
}
