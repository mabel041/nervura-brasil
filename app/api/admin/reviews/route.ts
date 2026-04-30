import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "NÃ£o autorizado" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    include: { produto: { select: { nome: true, slug: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(reviews, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
