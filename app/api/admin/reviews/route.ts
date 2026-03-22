import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
    include: { produto: { select: { nome: true, slug: true } } },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(reviews);
}
