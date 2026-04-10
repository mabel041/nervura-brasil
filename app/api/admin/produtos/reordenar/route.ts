import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { ids } = await req.json() as { ids: string[] };
  if (!Array.isArray(ids)) return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });

  await Promise.all(
    ids.map((id, index) =>
      prisma.produto.update({ where: { id }, data: { ordem: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
