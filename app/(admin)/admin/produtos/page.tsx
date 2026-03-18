import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Eye } from "lucide-react";
import Image from "next/image";
import { BotaoExcluirProduto } from "@/components/admin/BotaoExcluirProduto";

async function getProdutos(busca?: string, page = 1) {
  const limit = 20;
  const where = busca ? { nome: { contains: busca, mode: "insensitive" as const } } : {};
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { criadoEm: "desc" },
      include: { variacoes: true },
    }),
    prisma.produto.count({ where }),
  ]);
  return { produtos, total };
}

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: { busca?: string; page?: string };
}) {
  const page = parseInt(searchParams.page ?? "1");
  const { produtos, total } = await getProdutos(searchParams.busca, page);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Produto
        </Link>
      </div>

      {/* Busca */}
      <form method="GET" className="flex gap-2">
        <input
          name="busca"
          defaultValue={searchParams.busca}
          placeholder="Buscar por nome..."
          className="input-field max-w-sm"
        />
        <button type="submit" className="btn-primary text-sm px-4">Buscar</button>
      </form>

      <p className="text-sm text-gray-500">{total} produtos</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Produto</th>
              <th className="px-4 py-3 text-left">Coleção</th>
              <th className="px-4 py-3 text-right">Preço</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.imagens[0] && (
                      <div className="relative w-10 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image src={p.imagens[0]} alt={p.nome} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{p.nome}</p>
                      <p className="text-xs text-gray-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.colecao}</td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  {p.precoPromo ? (
                    <div>
                      <span className="text-nervura-verde">{formatCurrency(p.precoPromo)}</span>
                      <span className="text-gray-400 line-through text-xs ml-1">{formatCurrency(p.preco)}</span>
                    </div>
                  ) : (
                    formatCurrency(p.preco)
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`badge-status text-xs ${p.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/produto/${p.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-nervura-verde transition-colors"
                      title="Ver na loja"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="p-1.5 text-gray-400 hover:text-nervura-verde transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </Link>
                    <BotaoExcluirProduto id={p.id} nome={p.nome} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
