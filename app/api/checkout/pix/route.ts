import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { gerarNumeroPedido } from "@/lib/utils";
import { enviarEmailConfirmacao } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    itens,
    cupom,
    subtotal,
    desconto,
    total,
    nome,
    email,
    telefone,
    cpf,
    endereco,
  } = body;

  if (!itens?.length || !nome || !email || !cpf) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const numero = gerarNumeroPedido();

  try {
    const mpResponse = await payment.create({
      body: {
        transaction_amount: parseFloat(total.toFixed(2)),
        description: `Pedido Nervura Brasil #${numero}`,
        payment_method_id: "pix",
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

    const qrCodeBase64 =
      mpResponse.point_of_interaction?.transaction_data?.qr_code_base64 ?? "";
    const copiaCola =
      mpResponse.point_of_interaction?.transaction_data?.qr_code ?? "";

    // Salvar ou encontrar cliente
    const cliente = await prisma.cliente.upsert({
      where: { email },
      update: { nome, telefone },
      create: { nome, email, telefone, cpf: cpf.replace(/\D/g, "") },
    });

    const pedido = await prisma.pedido.create({
      data: {
        numero,
        status: "pendente",
        total,
        desconto: desconto ?? 0,
        cupomUsado: cupom?.codigo ?? null,
        mpPaymentId: String(mpResponse.id),
        mpStatus: mpResponse.status,
        pixQrCode: qrCodeBase64,
        pixCopiaCola: copiaCola,
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

    // Incrementar usos do cupom
    if (cupom?.codigo) {
      await prisma.cupom.update({
        where: { codigo: cupom.codigo },
        data: { usosAtuais: { increment: 1 } },
      });
    }

    // Enviar email de confirmação
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
      pixQrCode: qrCodeBase64,
    }).catch(console.error);

    return NextResponse.json({
      pedidoId: pedido.id,
      numeroPedido: numero,
      qrCodeBase64,
      copiaCola,
      mpPaymentId: mpResponse.id,
    });
  } catch (err) {
    console.error("Erro no checkout PIX:", err);
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 });
  }
}
