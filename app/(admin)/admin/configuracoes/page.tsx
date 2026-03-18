import { prisma } from "@/lib/prisma";
import { ConfigForm } from "@/components/admin/ConfigForm";

async function getConfig() {
  return prisma.configuracao.findUnique({ where: { id: "config" } });
}

export default async function ConfiguracoesPage() {
  const config = await getConfig();

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <h1 className="font-serif text-3xl">Configurações</h1>
      <ConfigForm config={config} />
    </div>
  );
}
