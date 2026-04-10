import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const aparencia = await prisma.aparencia.findUnique({ where: { id: "aparencia" } });
  return NextResponse.json(aparencia ?? {});
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const aparencia = await prisma.aparencia.upsert({
    where: { id: "aparencia" },
    update: body,
    create: { id: "aparencia", ...body },
  });
  return NextResponse.json(aparencia);
}
