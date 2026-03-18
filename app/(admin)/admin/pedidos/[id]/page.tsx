import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUS_LABELS } from "@/lib/utils";
import { PedidoAcoes } from "@/components/admin/PedidoAcoes";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AdminPedidoDetalhePage({ params }: { params: { id: string } }) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: params.id },
    include: { itens: { include: { produto: true } }, cliente: true },
  });

  if (!pedido) notFound();

  const status = STATUS_LABELS[pedido.status];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enderecoObj = pedido.endereco as any;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/pedidos" className="text-gray-400 hover:text-nervura-verde transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl">Pedido #{pedido.numero}</h1>
        <span className={`badge-status text-sm ${status?.color ?? ""}`}>{status?.label}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <h2 className="font-serif text-lg">Cliente</h2>
          <p className="text-sm font-medium">{pedido.nomeCliente}</p>
          <p className="text-sm text-gray-500">{pedido.emailCliente}</p>
          {pedido.telefone && <p className="text-sm text-gray-500">{pedido.telefone}</p>}
          {pedido.cpf && <p className="text-sm text-gray-400">CPF: {pedido.cpf}</p>}
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-1">
          <h2 className="font-serif text-lg">Endereço</h2>
          {enderecoObj && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {enderecoObj.rua}, {enderecoObj.numero}
              {enderecoObj.complemento ? `, ${enderecoObj.complemento}` : ""}<br />
              {enderecoObj.bairro} — {enderecoObj.cidade}/{enderecoObj.estado}<br />
              CEP: {enderecoObj.cep}
            </p>
          )}
        </div>
      </div>

      {/* Itens */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-serif text-lg">Itens</h2>
        {pedido.itens.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-16 rounded overflow-hidden flex-shrink-0">
              <Image src={item.produto.imagens[0] ?? ""} alt={item.produto.nome} fill className="object-cover" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.produto.nome}</p>
              <p className="text-gray-500">{item.cor} · {item.tamanho} · x{item.quantidade}</p>
            </div>
            <p className="text-sm font-semibold">{formatCurrency(item.precoUnit * item.quantidade)}</p>
          </div>
        ))}
        <div className="border-t pt-3 space-y-1 text-sm">
          {pedido.desconto > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto {pedido.cupomUsado && `(${pedido.cupomUsado})`}</span>
              <span>- {formatCurrency(pedido.desconto)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(pedido.total)}</span>
          </div>
        </div>
      </div>

      {/* Pagamento */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2 text-sm">
        <h2 className="font-serif text-lg">Pagamento</h2>
        {pedido.mpPaymentId && <p className="text-gray-500">MP ID: {pedido.mpPaymentId}</p>}
        {pedido.mpStatus && <p className="text-gray-500">Status MP: {pedido.mpStatus}</p>}
        <p className="text-gray-400 text-xs">Criado em: {formatDate(pedido.criadoEm)}</p>
      </div>

      {/* Ações */}
      <PedidoAcoes
        pedidoId={pedido.id}
        statusAtual={pedido.status}
        rastreioAtual={pedido.rastreio ?? ""}
      />
    </div>
  );
}
