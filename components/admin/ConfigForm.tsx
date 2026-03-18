"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface ConfigData {
  tikTokPixelId?: string | null;
  metaPixelId?: string | null;
  whatsappNumero?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  facebookUrl?: string | null;
  crmApiKey?: string | null;
  crmTipo?: string | null;
  emailRemetente?: string | null;
}

export function ConfigForm({ config }: { config: ConfigData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      tikTokPixelId: config?.tikTokPixelId ?? "",
      metaPixelId: config?.metaPixelId ?? "",
      whatsappNumero: config?.whatsappNumero ?? "",
      instagramUrl: config?.instagramUrl ?? "",
      tiktokUrl: config?.tiktokUrl ?? "",
      facebookUrl: config?.facebookUrl ?? "",
      crmApiKey: config?.crmApiKey ?? "",
      crmTipo: config?.crmTipo ?? "",
      emailRemetente: config?.emailRemetente ?? "",
    },
  });

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    setSucesso(false);
    await fetch("/api/admin/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    setSucesso(true);
    router.refresh();
    setTimeout(() => setSucesso(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pixels */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-serif text-xl">Pixels de Rastreamento</h2>
        <div>
          <label className="label">Meta Pixel ID (Facebook)</label>
          <input {...register("metaPixelId")} className="input-field" placeholder="123456789012345" />
        </div>
        <div>
          <label className="label">TikTok Pixel ID</label>
          <input {...register("tikTokPixelId")} className="input-field" placeholder="C8ABCDE12345..." />
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-serif text-xl">Redes Sociais</h2>
        <div>
          <label className="label">Número WhatsApp (com DDI, ex: 5541999999999)</label>
          <input {...register("whatsappNumero")} className="input-field" placeholder="5541999999999" />
        </div>
        <div>
          <label className="label">Instagram URL</label>
          <input {...register("instagramUrl")} className="input-field" placeholder="https://instagram.com/nervurabrasil" />
        </div>
        <div>
          <label className="label">TikTok URL</label>
          <input {...register("tiktokUrl")} className="input-field" placeholder="https://tiktok.com/@nervurabrasil" />
        </div>
        <div>
          <label className="label">Facebook URL</label>
          <input {...register("facebookUrl")} className="input-field" placeholder="https://facebook.com/nervurabrasil" />
        </div>
      </div>

      {/* CRM */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-serif text-xl">CRM</h2>
        <div>
          <label className="label">Tipo de CRM</label>
          <select {...register("crmTipo")} className="input-field">
            <option value="">Nenhum</option>
            <option value="rdstation">RD Station</option>
            <option value="hubspot">HubSpot</option>
          </select>
        </div>
        <div>
          <label className="label">API Key do CRM</label>
          <input {...register("crmApiKey")} type="password" className="input-field" placeholder="••••••••••" />
        </div>
        <div>
          <label className="label">E-mail Remetente</label>
          <input {...register("emailRemetente")} type="email" className="input-field" placeholder="pedidos@nervurabrasil.com.br" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary flex items-center gap-2 ${sucesso ? "bg-green-600" : ""}`}
      >
        {loading ? <><Loader2 size={18} className="animate-spin" /> Salvando...</> : <><Save size={18} /> {sucesso ? "Salvo com sucesso!" : "Salvar Configurações"}</>}
      </button>
    </form>
  );
}
