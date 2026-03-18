import { NextRequest, NextResponse } from "next/server";
import { calcularFrete } from "@/lib/superfrete";

export async function POST(req: NextRequest) {
  const { cep, totalItens, quantidadeItens } = await req.json();

  if (!cep || cep.replace(/\D/g, "").length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  if (!process.env.SUPERFRETE_TOKEN || !process.env.SUPERFRETE_CEP_ORIGEM) {
    return NextResponse.json({ error: "Frete não configurado" }, { status: 503 });
  }

  try {
    const opcoes = await calcularFrete(cep, totalItens ?? 50, quantidadeItens ?? 1);
    return NextResponse.json({ opcoes });
  } catch (err) {
    console.error("Erro ao calcular frete:", err);
    return NextResponse.json({ error: "Não foi possível calcular o frete" }, { status: 500 });
  }
}
