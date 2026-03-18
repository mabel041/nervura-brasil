import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUS_LABELS } from "@/lib/utils";
import { ConfirmacaoPIX } from "@/components/loja/ConfirmacaoPIX";
import { CheckCircle, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Confirmação do Pedido" };

export default async function PedidoPage({ params }: { params: { id: string } }) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: params.id },
    include: { itens: { include: { produto: true } } },
  });

  if (!pedido) notFound();

  const isPendentePIX = pedido.mpStatus === "pending" && pedido.pixQrCode;
  const status = STATUS_LABELS[pedido.status];

  return (
    <div className="min-h-screen bg-nervura-creme py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {isPendentePIX ? (
          <ConfirmacaoPIX
            pedidoId={pedido.id}
            qrCodeBase64={pedido.pixQrCode!}
            copiaCola={pedido.pixCopiaCola ?? ""}
          />
        ) : (
          <div className="bg-white rounded-xl border border-nervura-borda overflow-hidden">
            {/* Header */}
            <div className="bg-nervura-verde p-6 text-center text-nervura-creme">
              <CheckCircle size={48} className="mx-auto mb-3" />
              <h1 className="font-serif text-3xl">Pedido Confirmado!</h1>
              <p className="text-nervura-texto-muted mt-1">Número: #{pedido.numero}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-nervura-texto-muted">Status</span>
                <span className={`badge-status ${status?.color ?? ""}`}>
                  {status?.label ?? pedido.status}
                </span>
              </div>

              {/* Itens */}
              <div>
                <h2 className="font-serif text-lg mb-3">Itens do Pedido</h2>
                <div className="space-y-3">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.produto.imagens[0] ?? ""}
                          alt={item.produto.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{item.produto.nome}</p>
                        <p className="text-nervura-texto-muted">{item.cor} · {item.tamanho} · x{item.quantidade}</p>
                      </div>
                      <span className="font-semibold text-sm text-nervura-verde">
                        {formatCurrency(item.precoUnit * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-nervura-borda pt-4 space-y-1 text-sm">
                {pedido.desconto > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- {formatCurrency(pedido.desconto)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base">
                  <span>Total Pago</span>
                  <span className="text-nervura-verde">{formatCurrency(pedido.total)}</span>
                </div>
              </div>

              {/* Rastreio */}
              {pedido.rastreio && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <Package size={20} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Pedido Enviado</p>
                    <p className="text-xs text-blue-600">Rastreio: <strong>{pedido.rastreio}</strong></p>
                  </div>
                </div>
              )}

              <p className="text-xs text-nervura-texto-muted text-center">
                Pedido realizado em {formatDate(pedido.criadoEm)} • Um e-mail foi enviado para {pedido.emailCliente}
              </p>

              <Link href="/" className="btn-primary w-full text-center block">
                Continuar Comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
