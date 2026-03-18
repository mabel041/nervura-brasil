import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailConfirmacao({
  to,
  nomeCliente,
  numeroPedido,
  itens,
  total,
  pixQrCode,
}: {
  to: string;
  nomeCliente: string;
  numeroPedido: string;
  itens: Array<{ nome: string; quantidade: number; precoUnit: number; tamanho: string; cor: string }>;
  total: number;
  pixQrCode?: string;
}) {
  const itensHtml = itens
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #D4CCAF;">${item.nome} — ${item.cor} / ${item.tamanho}</td>
        <td style="padding:8px;border-bottom:1px solid #D4CCAF;text-align:center;">${item.quantidade}</td>
        <td style="padding:8px;border-bottom:1px solid #D4CCAF;text-align:right;">R$ ${item.precoUnit.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const pixSection = pixQrCode
    ? `<p style="margin-top:16px;color:#3A5244;">Seu pagamento PIX está pendente. Escaneie o QR Code ou acesse o link do pedido para pagar.</p>`
    : "";

  await resend.emails.send({
    from: "Nervura Brasil <pedidos@nervurabrasil.com.br>",
    to,
    subject: `Pedido #${numeroPedido} confirmado — Nervura Brasil`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:0 auto;background:#FAF7EE;padding:32px;border-radius:8px;">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;color:#1A4D2E;font-size:28px;margin-bottom:8px;">
          Nervura Brasil
        </h1>
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;color:#111A14;font-size:20px;">
          Olá, ${nomeCliente}! Seu pedido foi recebido.
        </h2>
        <p style="color:#3A5244;">Pedido nº <strong>#${numeroPedido}</strong></p>
        ${pixSection}
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr style="background:#1A4D2E;color:#F5EFD6;">
              <th style="padding:8px;text-align:left;">Produto</th>
              <th style="padding:8px;text-align:center;">Qtd</th>
              <th style="padding:8px;text-align:right;">Valor</th>
            </tr>
          </thead>
          <tbody>${itensHtml}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:bold;color:#1A4D2E;margin-top:16px;">
          Total: R$ ${total.toFixed(2)}
        </p>
        <hr style="border-color:#D4CCAF;margin:24px 0;" />
        <p style="color:#7A9186;font-size:13px;text-align:center;">
          Nervura Brasil — nervurabrasil.com.br
        </p>
      </div>
    `,
  });
}

export async function enviarEmailEnvio({
  to,
  nomeCliente,
  numeroPedido,
  rastreio,
}: {
  to: string;
  nomeCliente: string;
  numeroPedido: string;
  rastreio: string;
}) {
  await resend.emails.send({
    from: "Nervura Brasil <pedidos@nervurabrasil.com.br>",
    to,
    subject: `Pedido #${numeroPedido} enviado! 🎉`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:0 auto;background:#FAF7EE;padding:32px;border-radius:8px;">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;color:#1A4D2E;font-size:28px;">
          Nervura Brasil
        </h1>
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;color:#111A14;font-size:20px;">
          Seu pedido foi enviado, ${nomeCliente}!
        </h2>
        <p style="color:#3A5244;">Pedido nº <strong>#${numeroPedido}</strong></p>
        <p style="color:#3A5244;">Código de rastreio: <strong style="font-size:18px;color:#1A4D2E;">${rastreio}</strong></p>
        <p style="color:#7A9186;">Rastreie seu pedido nos Correios: <a href="https://www.correios.com.br/" style="color:#C9A84C;">correios.com.br</a></p>
        <hr style="border-color:#D4CCAF;margin:24px 0;" />
        <p style="color:#7A9186;font-size:13px;text-align:center;">
          Nervura Brasil — nervurabrasil.com.br
        </p>
      </div>
    `,
  });
}
