"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { cupomSchema, type CupomFormData } from "@/lib/validacoes";

export function CupomForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CupomFormData>({
    resolver: zodResolver(cupomSchema),
    defaultValues: { tipo: "percentual", ativo: true },
  });

  const onSubmit = async (data: CupomFormData) => {
    setLoading(true);
    setErro("");
    const res = await fetch("/api/admin/cupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      reset();
      router.refresh();
    } else {
      const d = await res.json();
      setErro(d.error ?? "Erro ao criar cupom");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Código</label>
          <input {...register("codigo")} className="input-field uppercase" placeholder="COPA10" />
          {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
        </div>
        <div>
          <label className="label">Tipo</label>
          <select {...register("tipo")} className="input-field">
            <option value="percentual">Percentual (%)</option>
            <option value="fixo">Fixo (R$)</option>
          </select>
        </div>
        <div>
          <label className="label">Valor</label>
          <input {...register("valor", { valueAsNumber: true })} type="number" step="0.01" className="input-field" placeholder="10" />
          {errors.valor && <p className="text-red-500 text-xs mt-1">{errors.valor.message}</p>}
        </div>
        <div>
          <label className="label">Pedido mínimo (R$)</label>
          <input {...register("minPedido", { valueAsNumber: true })} type="number" step="0.01" className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="label">Máx. de usos</label>
          <input {...register("maxUsos", { valueAsNumber: true })} type="number" className="input-field" placeholder="100" />
        </div>
        <div className="col-span-2">
          <label className="label">Expira em (opcional)</label>
          <input {...register("expiraEm")} type="date" className="input-field" />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input {...register("ativo")} type="checkbox" id="cupom-ativo" className="w-4 h-4 accent-nervura-verde" />
          <label htmlFor="cupom-ativo" className="text-sm text-nervura-texto-secundario cursor-pointer">Cupom ativo</label>
        </div>
      </div>

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Criando...</> : <><Plus size={16} /> Criar Cupom</>}
      </button>
    </form>
  );
}
