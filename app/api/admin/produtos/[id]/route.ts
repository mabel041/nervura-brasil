import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { variacoes, ...dadosProduto } = await req.json();

  // Atualizar produto e recriar variações
  const produto = await prisma.produto.update({
    where: { id: params.id },
    data: {
      ...dadosProduto,
      variacoes: {
        deleteMany: {},
        create: variacoes ?? [],
      },
    },
    include: { variacoes: true },
  });

  return NextResponse.json(produto);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  // Excluir variações primeiro (foreign key), depois o produto
  await prisma.variacao.deleteMany({ where: { produtoId: params.id } });
  await prisma.produto.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
