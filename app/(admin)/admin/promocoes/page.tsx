import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CupomForm } from "@/components/admin/CupomForm";

async function getCupons() {
  return prisma.cupom.findMany({ orderBy: { criadoEm: "desc" } });
}

export default async function PromocoesPage() {
  const cupons = await getCupons();

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-serif text-3xl">Promoções & Cupons</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário novo cupom */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-serif text-xl mb-4">Novo Cupom</h2>
          <CupomForm />
        </div>

        {/* Lista de cupons */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-serif text-xl">Cupons Ativos</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {cupons.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Nenhum cupom cadastrado</p>
            )}
            {cupons.map((c) => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono font-bold">
                      {c.codigo}
                    </code>
                    <span className={`badge-status text-xs ${c.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.tipo === "percentual" ? `${c.valor}% off` : `${formatCurrency(c.valor)} off`}
                    {c.minPedido ? ` · mín. ${formatCurrency(c.minPedido)}` : ""}
                    {c.expiraEm ? ` · expira ${formatDate(c.expiraEm)}` : ""}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {c.usosAtuais}/{c.maxUsos ?? "∞"} usos
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
