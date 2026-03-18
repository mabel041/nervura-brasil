import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const aparencia = await prisma.aparencia.findUnique({ where: { id: "aparencia" } });
  return NextResponse.json(aparencia ?? {});
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const aparencia = await prisma.aparencia.upsert({
    where: { id: "aparencia" },
    update: body,
    create: { id: "aparencia", ...body },
  });
  return NextResponse.json(aparencia);
}
