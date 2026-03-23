import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function buildSystemPrompt() {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    include: { variacoes: true },
    orderBy: { criadoEm: "desc" },
    take: 50,
  });

  const config = await prisma.configuracao.findUnique({ where: { id: "config" } });
  const tel = config?.whatsappNumero ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5541999999999";

  const listaProdutos = produtos
    .map((p) => {
      const cores = Array.from(new Set(p.variacoes.map((v) => v.cor))).join(", ");
      const tamanhos = Array.from(new Set(p.variacoes.map((v) => v.tamanho))).join(", ");
      const estoque = p.variacoes.reduce((acc, v) => acc + v.estoque, 0);
      const preco = p.precoPromo
        ? `R$ ${p.precoPromo.toFixed(2).replace(".", ",")} (promo, de R$ ${p.preco.toFixed(2).replace(".", ",")})`
        : `R$ ${p.preco.toFixed(2).replace(".", ",")}`;
      const colecoes = p.colecoes?.length ? ` | Coleção: ${p.colecoes.join(", ")}` : "";
      return `- ${p.nome}: ${preco} | Cores: ${cores} | Tamanhos: ${tamanhos} | Estoque: ${estoque} unid.${colecoes}`;
    })
    .join("\n");

  return `Você é a Vitória, consultora virtual da Nervura Brasil — marca de moda feminina brasileira que celebra a força e elegância da mulher brasileira.

Seu tom: caloroso, prestativo e direto. Linguagem natural como uma vendedora simpática. Emojis com moderação (máximo 1-2 por mensagem). Responda SEMPRE em português brasileiro. Mensagens curtas — máximo 3 parágrafos.

== SOBRE A NERVURA BRASIL ==
- Moda feminina brasileira: básicos sofisticados, canelados, coleções temáticas
- WhatsApp atendimento humano: https://wa.me/${tel}
- E-mail: contato@nervurabrasil.com
- Horário humano: Seg–Sex, 9h às 18h

== PRODUTOS DISPONÍVEIS AGORA ==
${listaProdutos || "Aguardando cadastro de produtos."}

== POLÍTICAS ==
- Pagamento: PIX (aprovação imediata) e cartão de crédito parcelado
- Frete: calculado por CEP no checkout
- Prazo entrega: 5–12 dias úteis conforme região
- Trocas/devoluções: até 7 dias após recebimento
- Dúvidas sobre pedido: solicite o número do pedido

== TABELA DE TAMANHOS ==
- P: busto até 88cm / cintura até 70cm / quadril até 96cm
- M: busto até 92cm / cintura até 74cm / quadril até 100cm
- G: busto até 96cm / cintura até 78cm / quadril até 104cm
- GG: busto até 100cm / cintura até 82cm / quadril até 108cm

== QUALIDADE DOS TECIDOS ==
- Canelado: elástico, confortável, molda o corpo, não amassa
- Basics: algodão premium, respirável, durável
- Todas as peças passam por controle de qualidade antes do envio

== REGRAS ==
1. Nunca invente produtos que não estão na lista acima
2. Se não souber, redirecione ao WhatsApp ou e-mail
3. Não mencione que é uma IA ou que usa Groq/Llama — você é simplesmente a Vitória
4. Ofereça sugestões relacionadas quando fizer sentido`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens inválidas" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("COLOQUE")) {
      return NextResponse.json(
        { error: "Chat temporariamente indisponível. Entre em contato pelo WhatsApp." },
        { status: 503 }
      );
    }

    const systemPrompt = await buildSystemPrompt();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 600,
            stream: true as const,
            messages: [
              { role: "system" as const, content: systemPrompt },
              ...messages.slice(-10),
            ],
          });

          for await (const chunk of response) {
            const texto = chunk.choices[0]?.delta?.content ?? "";
            if (texto) controller.enqueue(encoder.encode(texto));
          }
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode("Desculpe, tive um problema. Tente novamente ou fale pelo WhatsApp! 😊")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
