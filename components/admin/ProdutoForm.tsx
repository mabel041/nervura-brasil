"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { produtoSchema, type ProdutoFormData } from "@/lib/validacoes";
import { slugify } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Variacao {
  cor: string;
  tamanho: string;
  estoque: number;
}

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  precoPromo?: number | null;
  colecao: string;
  material?: string | null;
  destaque: boolean;
  ativo: boolean;
  imagens: string[];
  variacoes: Array<{ id: string; cor: string; tamanho: string; estoque: number }>;
}

export function ProdutoForm({ produto }: { produto?: Produto }) {
  const router = useRouter();
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? []);
  const [video, setVideo] = useState<string>(produto?.video ?? "");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoErro, setVideoErro] = useState("");
  const [variacoes, setVariacoes] = useState<Variacao[]>(
    produto?.variacoes.map((v) => ({ cor: v.cor, tamanho: v.tamanho, estoque: v.estoque })) ?? [
      { cor: "", tamanho: "P", estoque: 10 },
    ]
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadErro, setUploadErro] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: produto?.nome ?? "",
      slug: produto?.slug ?? "",
      descricao: produto?.descricao ?? "",
      preco: produto?.preco ?? 0,
      precoPromo: produto?.precoPromo ?? undefined,
      colecao: (produto?.colecao as ProdutoFormData["colecao"]) ?? "basics",
      material: produto?.material ?? "",
      destaque: produto?.destaque ?? false,
      ativo: produto?.ativo ?? true,
    },
  });

  const nome = watch("nome");

  const handleUpload = async (files: FileList | null) => {
    if (!files || imagens.length >= 6) return;
    setUploadLoading(true);
    setUploadErro("");

    for (const file of Array.from(files).slice(0, 6 - imagens.length)) {
      // Validação de tamanho: máx 10MB
      if (file.size > 10 * 1024 * 1024) {
        setUploadErro(`"${file.name}" é muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 10MB.`);
        continue;
      }

      const ext = file.name.split(".").pop();
      const filename = `produtos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("produtos")
        .upload(filename, file, { contentType: file.type, upsert: false });

      if (error) {
        setUploadErro(`Erro ao enviar "${file.name}": ${error.message}`);
        console.error("Supabase upload error:", error);
      } else {
        const { data } = supabase.storage.from("produtos").getPublicUrl(filename);
        setImagens((prev) => [...prev, data.publicUrl]);
      }
    }
    setUploadLoading(false);
  };

  const adicionarVariacao = () => {
    setVariacoes((prev) => [...prev, { cor: "", tamanho: "M", estoque: 10 }]);
  };

  const removerVariacao = (i: number) => {
    setVariacoes((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setVideoErro("Vídeo muito grande. Máximo: 50MB.");
      return;
    }
    setVideoLoading(true);
    setVideoErro("");
    try {
      const ext = file.name.split(".").pop();
      const filename = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("produtos").upload(filename, file, { contentType: file.type });
      if (error) { setVideoErro(`Erro: ${error.message}`); return; }
      const { data } = supabase.storage.from("produtos").getPublicUrl(filename);
      setVideo(data.publicUrl);
    } catch {
      setVideoErro("Erro de rede ao enviar o vídeo.");
    } finally {
      setVideoLoading(false);
    }
  };

  const onSubmit = async (data: ProdutoFormData) => {
    setSaving(true);
    setErro("");
    const body = { ...data, imagens, video: video || null, variacoes };

    const url = produto ? `/api/admin/produtos/${produto.id}` : "/api/admin/produtos";
    const method = produto ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/produtos");
      router.refresh();
    } else {
      const d = await res.json();
      setErro(d.error ?? "Erro ao salvar");
    }
  };

  const TAMANHOS = ["Único", "PP", "P", "M", "G", "GG"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Dados básicos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-serif text-xl">Dados Básicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Nome</label>
            <input
              {...register("nome")}
              className="input-field"
              onChange={(e) => {
                register("nome").onChange(e);
                if (!produto) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>
          <div>
            <label className="label">Slug (URL)</label>
            <input {...register("slug")} className="input-field" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="label">Coleção</label>
            <select {...register("colecao")} className="input-field">
              <option value="copa-2026">Copa 2026</option>
              <option value="canelado">Canelado</option>
              <option value="basics">Basics</option>
            </select>
          </div>
          <div>
            <label className="label">Preço (R$)</label>
            <input {...register("preco", { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
            {errors.preco && <p className="text-red-500 text-xs mt-1">{errors.preco.message}</p>}
          </div>
          <div>
            <label className="label">Preço Promocional (opcional)</label>
            <input {...register("precoPromo", { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Descrição</label>
            <textarea {...register("descricao")} rows={4} className="input-field resize-none" />
            {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
          </div>
          <div>
            <label className="label">Material (opcional)</label>
            <input {...register("material")} className="input-field" placeholder="95% Algodão, 5% Elastano" />
          </div>
          <div className="flex items-center gap-4 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register("destaque")} type="checkbox" className="w-4 h-4 accent-nervura-verde" />
              <span className="text-sm text-nervura-texto-secundario">Destaque na home</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register("ativo")} type="checkbox" className="w-4 h-4 accent-nervura-verde" />
              <span className="text-sm text-nervura-texto-secundario">Ativo</span>
            </label>
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Imagens ({imagens.length}/6)</h2>
          {uploadLoading && <Loader2 size={18} className="animate-spin text-nervura-verde" />}
        </div>
        <p className="text-xs text-nervura-texto-muted bg-nervura-creme rounded-lg px-3 py-2 border border-nervura-borda">
          💡 <strong>Dica:</strong> A ordem das imagens corresponde à ordem das cores nas variações abaixo. Ex: 1ª imagem → 1ª cor, 2ª imagem → 2ª cor.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {imagens.map((img, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
              <div className="absolute top-1 left-1 z-10 bg-nervura-verde text-nervura-creme text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {i + 1}
              </div>
              <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImagens((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {imagens.length < 6 && (
            <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-nervura-borda flex flex-col items-center justify-center cursor-pointer hover:border-nervura-verde transition-colors">
              <Upload size={20} className="text-nervura-texto-muted mb-1" />
              <span className="text-xs text-nervura-texto-muted">Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
          )}
        </div>
        {uploadErro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
            <span className="font-bold shrink-0">⚠️ Erro no upload:</span>
            <span>{uploadErro}</span>
          </div>
        )}
      </div>

      {/* Vídeo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-serif text-xl">Vídeo do Produto (opcional)</h2>
        <p className="text-xs text-nervura-texto-muted bg-nervura-creme rounded-lg px-3 py-2 border border-nervura-borda">
          🎥 Formatos aceitos: MP4, MOV, WEBM. Máximo: 50MB. Aparece na página do produto antes das fotos.
        </p>
        {video ? (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-w-[200px]">
            <video src={video} controls className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setVideo("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-nervura-borda rounded-xl p-8 cursor-pointer hover:border-nervura-verde transition-colors">
            {videoLoading ? (
              <><Loader2 size={24} className="animate-spin text-nervura-verde mb-2" /><span className="text-sm text-nervura-texto-muted">Enviando vídeo...</span></>
            ) : (
              <><Upload size={24} className="text-nervura-texto-muted mb-2" /><span className="text-sm text-nervura-texto-muted">Clique para subir um vídeo</span><span className="text-xs text-nervura-texto-muted mt-1">MP4, MOV, WEBM • máx 50MB</span></>
            )}
            <input type="file" accept="video/mp4,video/mov,video/webm,video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={videoLoading} />
          </label>
        )}
        {videoErro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
            <span className="font-bold shrink-0">⚠️ Erro no vídeo:</span>
            <span>{videoErro}</span>
          </div>
        )}
      </div>

      {/* Variações */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Variações (Cor + Tamanho + Estoque)</h2>
          <button type="button" onClick={adicionarVariacao} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
            <Plus size={14} /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {variacoes.map((v, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                value={v.cor}
                onChange={(e) => setVariacoes((prev) => prev.map((item, idx) => idx === i ? { ...item, cor: e.target.value } : item))}
                placeholder="Cor"
                className="input-field flex-1"
              />
              <select
                value={v.tamanho}
                onChange={(e) => setVariacoes((prev) => prev.map((item, idx) => idx === i ? { ...item, tamanho: e.target.value } : item))}
                className="input-field w-24"
              >
                {TAMANHOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="number"
                value={v.estoque}
                onChange={(e) => setVariacoes((prev) => prev.map((item, idx) => idx === i ? { ...item, estoque: parseInt(e.target.value) } : item))}
                className="input-field w-20"
                min={0}
              />
              <button type="button" onClick={() => removerVariacao(i)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : "Salvar Produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          className="btn-outline text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
