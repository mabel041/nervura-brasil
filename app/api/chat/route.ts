import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function buildSystemPrompt() {
  // Busca produtos ativos para dar contexto à IA
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    include: { variacoes: true },
    orderBy: { criadoEm: "desc" },
    take: 50,
  });

  const config = await prisma.configuracao.findUnique({ where: { id: "config" } });
  const tel = config?.whatsappNumero ?? "5541999999999";

  const listaProdutos = produtos
    .map((p) => {
      const cores = [...new Set(p.variacoes.map((v) => v.cor))].join(", ");
      const tamanhos = [...new Set(p.variacoes.map((v) => v.tamanho))].join(", ");
      const estoque = p.variacoes.reduce((acc, v) => acc + v.estoque, 0);
      const preco = p.precoPromo
        ? `R$ ${p.precoPromo.toFixed(2).replace(".", ",")} (de R$ ${p.preco.toFixed(2).replace(".", ",")})`
        : `R$ ${p.preco.toFixed(2).replace(".", ",")}`;
      const colecoes = p.colecoes?.length ? ` | Coleção: ${p.colecoes.join(", ")}` : "";
      return `- ${p.nome}: ${preco} | Cores: ${cores} | Tamanhos: ${tamanhos} | Estoque: ${estoque} unid.${colecoes}`;
    })
    .join("\n");

  return `Você é a Vitória, atendente virtual da Nervura Brasil — uma marca de moda feminina brasileira com identidade forte, que celebra a força e elegância da mulher brasileira.

Seu tom é: caloroso, prestativo, direto e com personalidade. Use linguagem natural e amigável, como uma vendedora simpática de uma loja boutique. Use emojis com moderação (máximo 1-2 por mensagem). Responda sempre em português brasileiro.

== SOBRE A NERVURA BRASIL ==
- Marca de moda feminina brasileira
- Especializada em roupas de qualidade com identidade: básicos sofisticados, canelados, coleções temáticas
- Site: nervurabrasil.com.br
- WhatsApp para atendimento humano: https://wa.me/${tel}
- E-mail: contato@nervurabrasil.com
- Horário de atendimento humano: Segunda a sexta, 9h às 18h

== PRODUTOS DISPONÍVEIS AGORA ==
${listaProdutos || "Nenhum produto cadastrado ainda."}

== POLÍTICAS DA LOJA ==
- Pagamento: PIX (aprovação imediata) e cartão de crédito (parcelamento disponível)
- Frete: calculado por CEP no checkout
- Prazo de entrega: varia por região (geralmente 5-12 dias úteis)
- Trocas e devoluções: até 7 dias após recebimento em caso de defeito ou arrependimento
- Para dúvidas específicas sobre o pedido, peça o número do pedido

== COMO VOCÊ DEVE AGIR ==
1. Responda perguntas sobre produtos, preços, tamanhos, cores e disponibilidade com base nos dados acima
2. Para dúvidas sobre qualidade, explique: peças em canelado são de tecido elástico confortável, os básicos são algodão premium, e todas as peças passam por controle de qualidade antes do envio
3. Para problemas com pedido existente: peça o número do pedido ou redirecione ao WhatsApp
4. Para dúvidas de tamanho: sugira que G = busto até 96cm / cintura até 78cm / quadril até 104cm. M = busto até 92cm / cintura até 74cm / quadril até 100cm. P = busto até 88cm / cintura até 70cm / quadril até 96cm
5. Nunca invente informações sobre produtos que não estão na lista acima
6. Se não souber responder, direcione para o WhatsApp ou e-mail
7. Seja proativa: ofereça sugestões relacionadas quando fizer sentido
8. Mensagens curtas e objetivas — máximo 3 parágrafos por resposta

Não mencione que você é uma IA da Anthropic ou que usa Claude. Você é simplesmente a Vitória, da Nervura Brasil.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens inválidas" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("COLOQUE")) {
      return NextResponse.json(
        { error: "Chat temporariamente indisponível. Entre em contato pelo WhatsApp." },
        { status: 503 }
      );
    }

    const systemPrompt = await buildSystemPrompt();

    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.stream({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 600,
            system: systemPrompt,
            messages: messages.slice(-10), // máximo 10 mensagens de contexto
          });

          for await (const chunk of response) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode("Desculpe, tive um problema. Tente novamente ou fale comigo pelo WhatsApp! 😊")
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
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
