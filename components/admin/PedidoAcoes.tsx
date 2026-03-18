"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { STATUS_LABELS } from "@/lib/utils";

const STATUS_OPTIONS = ["pendente", "pago", "enviado", "entregue", "cancelado"];

export function PedidoAcoes({
  pedidoId,
  statusAtual,
  rastreioAtual,
}: {
  pedidoId: string;
  statusAtual: string;
  rastreioAtual: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(statusAtual);
  const [rastreio, setRastreio] = useState(rastreioAtual);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const salvar = async () => {
    setLoading(true);
    setSucesso(false);
    await fetch(`/api/admin/pedidos/${pedidoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rastreio }),
    });
    setLoading(false);
    setSucesso(true);
    router.refresh();
    setTimeout(() => setSucesso(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="font-serif text-lg">Atualizar Pedido</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]?.label ?? s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Código de Rastreio</label>
          <input
            value={rastreio}
            onChange={(e) => setRastreio(e.target.value)}
            placeholder="BR123456789BR"
            className="input-field"
          />
        </div>
      </div>
      <button
        onClick={salvar}
        disabled={loading}
        className={`btn-primary flex items-center gap-2 text-sm ${sucesso ? "bg-green-600" : ""}`}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : <><Save size={16} /> {sucesso ? "Salvo!" : "Salvar Alterações"}</>}
      </button>
    </div>
  );
}
