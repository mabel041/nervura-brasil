"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function BotaoExcluirProduto({ id, nome }: { id: string; nome: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExcluir = async () => {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?\n\nO produto será desativado e não aparecerá mais na loja.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Erro ao excluir produto.");
      }
    } catch {
      alert("Erro ao excluir produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExcluir}
      disabled={loading}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Excluir produto"
    >
      <Trash2 size={16} />
    </button>
  );
}
