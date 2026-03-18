import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [totalPedidos, pedidosMes, receitaMes, produtosBaixoEstoque, ultimosPedidos] =
    await Promise.all([
      prisma.pedido.count(),
      prisma.pedido.count({
        where: { criadoEm: { gte: inicioMes }, status: { in: ["pago", "enviado", "entregue"] } },
      }),
      prisma.pedido.aggregate({
        where: { criadoEm: { gte: inicioMes }, status: { in: ["pago", "enviado", "entregue"] } },
        _sum: { total: true },
      }),
      prisma.variacao.findMany({
        where: { estoque: { lte: 5, gt: 0 } },
        include: { produto: { select: { nome: true, slug: true } } },
        take: 8,
      }),
      prisma.pedido.findMany({
        orderBy: { criadoEm: "desc" },
        take: 8,
      }),
    ]);

  return { totalPedidos, pedidosMes, receitaMes: receitaMes._sum.total ?? 0, produtosBaixoEstoque, ultimosPedidos };
}

const STATUS_CLASSES: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  pago: "bg-green-100 text-green-800",
  enviado: "bg-blue-100 text-blue-800",
  entregue: "bg-nervura-verde/10 text-nervura-verde",
  cancelado: "bg-red-100 text-red-800",
};

export default async function AdminDashboard() {
  const { totalPedidos, pedidosMes, receitaMes, produtosBaixoEstoque, ultimosPedidos } =
    await getDashboardData();

  const cards = [
    { label: "Total de Pedidos", value: String(totalPedidos), icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Pedidos este Mês", value: String(pedidosMes), icon: TrendingUp, color: "bg-green-500" },
    { label: "Receita do Mês", value: formatCurrency(receitaMes), icon: DollarSign, color: "bg-nervura-ouro" },
    {
      label: "Estoque Baixo",
      value: String(produtosBaixoEstoque.length),
      icon: AlertTriangle,
      color: produtosBaixoEstoque.length > 0 ? "bg-red-500" : "bg-gray-400",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-serif text-3xl text-nervura-texto-principal">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className={`${c.color} rounded-xl p-3 text-white flex-shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-nervura-texto-principal">{c.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos pedidos */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-serif text-lg">Últimos Pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-nervura-verde hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {ultimosPedidos.map((p) => (
              <Link
                key={p.id}
                href={`/admin/pedidos/${p.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">#{p.numero}</p>
                  <p className="text-xs text-gray-500">{p.nomeCliente}</p>
                </div>
                <div className="text-right">
                  <span className={`badge-status text-xs ${STATUS_CLASSES[p.status] ?? ""}`}>
                    {p.status}
                  </span>
                  <p className="text-sm font-semibold text-nervura-verde mt-0.5">
                    {formatCurrency(p.total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Estoque baixo */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-serif text-lg">Estoque Baixo</h2>
            <Link href="/admin/produtos" className="text-xs text-nervura-verde hover:underline">
              Gerenciar
            </Link>
          </div>
          {produtosBaixoEstoque.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">Tudo em ordem! ✓</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {produtosBaixoEstoque.map((v) => (
                <Link
                  key={v.id}
                  href={`/admin/produtos/${v.produtoId}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{v.produto.nome}</p>
                    <p className="text-xs text-gray-500">{v.cor} · {v.tamanho}</p>
                  </div>
                  <span className="text-red-500 font-bold text-sm">{v.estoque} un</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
