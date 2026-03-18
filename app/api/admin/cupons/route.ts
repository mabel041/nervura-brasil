import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const [cupons, total] = await Promise.all([
    prisma.cupom.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { criadoEm: "desc" },
    }),
    prisma.cupom.count(),
  ]);

  return NextResponse.json({ cupons, total });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();

  const cupom = await prisma.cupom.create({
    data: {
      ...body,
      codigo: body.codigo.toUpperCase(),
      expiraEm: body.expiraEm ? new Date(body.expiraEm) : null,
    },
  });

  return NextResponse.json(cupom, { status: 201 });
}
