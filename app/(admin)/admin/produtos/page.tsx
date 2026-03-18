import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { TabelaProdutosDraggable } from "@/components/admin/TabelaProdutosDraggable";

async function getProdutos(busca?: string, page = 1) {
  const limit = 20;
  const where = busca ? { nome: { contains: busca, mode: "insensitive" as const } } : {};
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
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

      <TabelaProdutosDraggable produtosIniciais={produtos} />
    </div>
  );
}
