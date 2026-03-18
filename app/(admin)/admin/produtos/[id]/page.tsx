import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const isNovo = params.id === "novo";

  if (isNovo) {
    return (
      <div className="p-6">
        <h1 className="font-serif text-3xl mb-6">Novo Produto</h1>
        <ProdutoForm />
      </div>
    );
  }

  const produto = await prisma.produto.findUnique({
    where: { id: params.id },
    include: { variacoes: true },
  });

  if (!produto) notFound();

  return (
    <div className="p-6">
      <h1 className="font-serif text-3xl mb-6">Editar Produto</h1>
      <ProdutoForm produto={produto} />
    </div>
  );
}
