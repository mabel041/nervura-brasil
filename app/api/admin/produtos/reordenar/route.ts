import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { ids } = await req.json() as { ids: string[] };

  await Promise.all(
    ids.map((id, index) =>
      prisma.produto.update({ where: { id }, data: { ordem: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
