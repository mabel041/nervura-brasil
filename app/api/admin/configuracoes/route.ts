import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const config = await prisma.configuracao.findUnique({ where: { id: "config" } });

  return NextResponse.json(config ?? {});
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();

  const config = await prisma.configuracao.upsert({
    where: { id: "config" },
    update: body,
    create: { id: "config", ...body },
  });

  return NextResponse.json(config);
}
