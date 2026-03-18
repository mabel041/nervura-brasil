import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { gerarNumeroPedido } from "@/lib/utils";
import { enviarEmailConfirmacao } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    token,
    installments,
    paymentMethodId,
    issuerIdCard,
    itens,
    cupom,
    total,
    nome,
    email,
    telefone,
    cpf,
    endereco,
  } = body;

  if (!token || !installments || !itens?.length || !nome || !email || !cpf) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const numero = gerarNumeroPedido();
  const desconto = body.desconto ?? 0;

  try {
    const mpResponse = await payment.create({
      body: {
        transaction_amount: parseFloat(total.toFixed(2)),
        token,
        description: `Pedido Nervura Brasil #${numero}`,
        installments: parseInt(installments),
        payment_method_id: paymentMethodId,
        issuer_id: issuerIdCard,
        payer: {
          first_name: nome.split(" ")[0],
          last_name: nome.split(" ").slice(1).join(" ") || ".",
          email,
          identification: {
            type: "CPF",
            number: cpf.replace(/\D/g, ""),
          },
        },
      },
    });

    const status =
      mpResponse.status === "approved"
        ? "pago"
        : mpResponse.status === "rejected"
        ? "cancelado"
        : "pendente";

    if (mpResponse.status === "rejected") {
      return NextResponse.json(
        { error: "Pagamento recusado. Verifique os dados do cartão." },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.upsert({
      where: { email },
      update: { nome, telefone },
      create: { nome, email, telefone, cpf: cpf.replace(/\D/g, "") },
    });

    const pedido = await prisma.pedido.create({
      data: {
        numero,
        status,
        total,
        desconto,
        cupomUsado: cupom?.codigo ?? null,
        mpPaymentId: String(mpResponse.id),
        mpStatus: mpResponse.status,
        clienteId: cliente.id,
        nomeCliente: nome,
        emailCliente: email,
        telefone,
        cpf: cpf.replace(/\D/g, ""),
        endereco,
        itens: {
          create: itens.map((item: {
            produtoId: string;
            cor: string;
            tamanho: string;
            quantidade: number;
            preco: number;
          }) => ({
            produtoId: item.produtoId,
            cor: item.cor,
            tamanho: item.tamanho,
            quantidade: item.quantidade,
            precoUnit: item.preco,
          })),
        },
      },
      include: { itens: { include: { produto: true } } },
    });

    if (cupom?.codigo) {
      await prisma.cupom.update({
        where: { codigo: cupom.codigo },
        data: { usosAtuais: { increment: 1 } },
      });
    }

    if (status === "pago") {
      await enviarEmailConfirmacao({
        to: email,
        nomeCliente: nome,
        numeroPedido: numero,
        itens: pedido.itens.map((i) => ({
          nome: i.produto.nome,
          quantidade: i.quantidade,
          precoUnit: i.precoUnit,
          tamanho: i.tamanho,
          cor: i.cor,
        })),
        total,
      }).catch(console.error);
    }

    return NextResponse.json({
      pedidoId: pedido.id,
      numeroPedido: numero,
      status,
      mpStatus: mpResponse.status,
    });
  } catch (err) {
    console.error("Erro no checkout cartão:", err);
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 });
  }
}
