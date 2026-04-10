import { NextRequest, NextResponse } from "next/server";
import { payment as mpPayment } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { enviarEmailConfirmacao } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";

  // Validar assinatura HMAC — obrigatório
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("MP_WEBHOOK_SECRET não configurado — webhook rejeitado");
    return NextResponse.json({ error: "Configuração inválida" }, { status: 500 });
  }

  const [tsPart, v1Part] = signature.split(",");
  const ts = tsPart?.split("=")[1] ?? "";
  const v1 = v1Part?.split("=")[1] ?? "";

  if (!ts || !v1) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 401 });
  }

  const dataId = JSON.parse(body)?.data?.id ?? "";
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(manifest)
    .digest("hex");

  if (v1 !== expectedSig) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  const data = JSON.parse(body);

  if (data.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(data.data?.id);

  try {
    const mpData = await mpPayment.get({ id: paymentId });

    const pedido = await prisma.pedido.findFirst({
      where: { mpPaymentId: paymentId },
      include: { itens: { include: { produto: true } } },
    });

    if (!pedido) {
      console.warn(`Pedido não encontrado para mpPaymentId: ${paymentId}`);
      return NextResponse.json({ ok: true });
    }

    const novoStatus =
      mpData.status === "approved"
        ? "pago"
        : mpData.status === "rejected"
        ? "cancelado"
        : pedido.status;

    await prisma.pedido.update({
      where: { id: pedido.id },
      data: {
        status: novoStatus,
        mpStatus: mpData.status ?? undefined,
      },
    });

    if (mpData.status === "approved" && pedido.status !== "pago") {
      await enviarEmailConfirmacao({
        to: pedido.emailCliente,
        nomeCliente: pedido.nomeCliente,
        numeroPedido: pedido.numero,
        itens: pedido.itens.map((i) => ({
          nome: i.produto.nome,
          quantidade: i.quantidade,
          precoUnit: i.precoUnit,
          tamanho: i.tamanho,
          cor: i.cor,
        })),
        total: pedido.total,
      }).catch(console.error);
    }
  } catch (err) {
    console.error("Erro no webhook MP:", err);
  }

  return NextResponse.json({ ok: true });
}
