import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUS_LABELS } from "@/lib/utils";
import { Eye } from "lucide-react";

async function getPedidos(status?: string, page = 1) {
  const limit = 20;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = status ? { status } : {};
  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { criadoEm: "desc" },
    }),
    prisma.pedido.count({ where }),
  ]);
  return { pedidos, total };
}

const STATUS_LIST = ["pendente", "pago", "enviado", "entregue", "cancelado"];

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const page = parseInt(searchParams.page ?? "1");
  const { pedidos, total } = await getPedidos(searchParams.status, page);

  return (
    <div className="p-6 space-y-4">
      <h1 className="font-serif text-3xl">Pedidos</h1>

      {/* Filtro de status */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`badge-status px-3 py-1.5 text-xs border cursor-pointer transition-colors ${
            !searchParams.status ? "bg-nervura-verde text-white border-nervura-verde" : "border-gray-200 text-gray-500 hover:border-nervura-verde"
          }`}
        >
          Todos ({total})
        </Link>
        {STATUS_LIST.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={`badge-status px-3 py-1.5 text-xs border cursor-pointer transition-colors ${
              searchParams.status === s ? "bg-nervura-verde text-white border-nervura-verde" : "border-gray-200 text-gray-500 hover:border-nervura-verde"
            }`}
          >
            {STATUS_LABELS[s]?.label ?? s}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Pedido</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Cliente</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Data</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidos.map((p) => {
              const s = STATUS_LABELS[p.status];
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">#{p.numero}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {p.nomeCliente}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    {formatDate(p.criadoEm)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-nervura-verde">
                    {formatCurrency(p.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`badge-status text-xs ${s?.color ?? ""}`}>
                      {s?.label ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/pedidos/${p.id}`}
                      className="text-gray-400 hover:text-nervura-verde transition-colors inline-block p-1"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pedidos.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">Nenhum pedido encontrado</p>
        )}
      </div>
    </div>
  );
}
