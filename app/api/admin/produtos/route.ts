import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const busca = searchParams.get("busca");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = busca
    ? { nome: { contains: busca, mode: "insensitive" as const } }
    : {};

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      skip,
      take: limit,
      orderBy: { criadoEm: "desc" },
      include: { variacoes: true },
    }),
    prisma.produto.count({ where }),
  ]);

  return NextResponse.json({ produtos, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { variacoes, ...dadosProduto } = body;

  const slug = dadosProduto.slug || slugify(dadosProduto.nome);

  const produto = await prisma.produto.create({
    data: {
      ...dadosProduto,
      slug,
      variacoes: {
        create: variacoes ?? [],
      },
    },
    include: { variacoes: true },
  });

  return NextResponse.json(produto, { status: 201 });
}
