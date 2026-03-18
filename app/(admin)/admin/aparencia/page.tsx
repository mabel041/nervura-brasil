"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Upload, Image as ImageIcon } from "lucide-react";

type AparenciaData = {
  logoTexto?: string;
  logoUrl?: string;
  bannerAtivo?: boolean;
  bannerTexto?: string;
  bannerLink?: string;
  bannerLinkTexto?: string;
  homeHeroImagem?: string;
  homeHeroTitulo?: string;
  homeHeroSubtitulo?: string;
  homeHeroBotaoTexto?: string;
  homeHeroBotaoLink?: string;
  sobreTitulo?: string;
  sobreDescricao?: string;
  sobreImagem?: string;
  sobreBotaoTexto?: string;
  copaHeroImagem?: string;
  copaHeroTitulo?: string;
  copaHeroSubtitulo?: string;
  catalogoTitulo?: string;
  catalogoBannerImagem?: string;
  rodapeDescricao?: string;
  corVerdePrincipal?: string;
  corOuro?: string;
  corFundo?: string;
  corCreme?: string;
};

const ABAS = [
  { id: "identidade", label: "Identidade" },
  { id: "anuncio", label: "Anúncio" },
  { id: "home", label: "Home" },
  { id: "copa", label: "Copa 2026" },
  { id: "catalogo", label: "Catálogo" },
  { id: "cores", label: "Cores" },
  { id: "rodape", label: "Rodapé" },
] as const;

type AbaId = (typeof ABAS)[number]["id"];

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-nervura-texto-principal">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-nervura-borda rounded-lg px-3 py-2.5 text-sm text-nervura-texto-principal bg-white focus:outline-none focus:ring-2 focus:ring-nervura-verde focus:border-transparent transition"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-nervura-texto-principal">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-nervura-borda rounded-lg px-3 py-2.5 text-sm text-nervura-texto-principal bg-white focus:outline-none focus:ring-2 focus:ring-nervura-verde focus:border-transparent transition resize-none"
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch {
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-nervura-texto-principal">{label}</label>
      {hint && <p className="text-xs text-nervura-texto-muted">{hint}</p>}

      {value && (
        <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-nervura-borda bg-nervura-creme">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-nervura-borda rounded-lg hover:border-nervura-verde text-nervura-texto-secundario hover:text-nervura-verde transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="animate-spin w-4 h-4 border-2 border-nervura-verde border-t-transparent rounded-full" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? "Enviando..." : "Upload de imagem"}
        </button>
        <span className="text-xs text-nervura-texto-muted">ou</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL da imagem"
          className="flex-1 min-w-[200px] border border-nervura-borda rounded-lg px-3 py-2 text-sm text-nervura-texto-principal bg-white focus:outline-none focus:ring-2 focus:ring-nervura-verde focus:border-transparent transition"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-nervura-texto-principal">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-nervura-borda cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-32 border border-nervura-borda rounded-lg px-3 py-2 text-sm font-mono text-nervura-texto-principal bg-white focus:outline-none focus:ring-2 focus:ring-nervura-verde focus:border-transparent transition"
        />
        {value && (
          <span
            className="w-8 h-8 rounded-md border border-nervura-borda shadow-sm"
            style={{ backgroundColor: value }}
          />
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-lg text-nervura-texto-principal border-b border-nervura-borda pb-2 mb-4">
      {children}
    </h3>
  );
}

export default function AparenciaPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaId>("identidade");
  const [data, setData] = useState<AparenciaData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAba, setSavedAba] = useState<AbaId | null>(null);

  useEffect(() => {
    fetch("/api/admin/aparencia")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  function set<K extends keyof AparenciaData>(key: K, value: AparenciaData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function salvar() {
    setSaving(true);
    try {
      await fetch("/api/admin/aparencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSavedAba(abaAtiva);
      setTimeout(() => setSavedAba(null), 3000);
    } catch {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-2 border-nervura-verde border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-nervura-texto-principal">Aparência</h1>
          <p className="text-sm text-nervura-texto-muted mt-1">
            Edite o conteúdo visual de todas as páginas da loja
          </p>
        </div>
        <button
          onClick={salvar}
          disabled={saving}
          className="flex items-center gap-2 bg-nervura-verde text-nervura-creme px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-nervura-verde-medio transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {savedAba && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Alterações salvas com sucesso!
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-nervura-borda">
        <nav className="flex gap-1 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                abaAtiva === aba.id
                  ? "border-nervura-verde text-nervura-verde bg-green-50"
                  : "border-transparent text-nervura-texto-secundario hover:text-nervura-texto-principal hover:border-nervura-borda"
              }`}
            >
              {aba.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white border border-nervura-borda rounded-xl p-6 space-y-6">

        {/* IDENTIDADE */}
        {abaAtiva === "identidade" && (
          <>
            <SectionTitle>Logotipo e Identidade</SectionTitle>
            <InputField
              label="Nome da Loja (texto do logo)"
              value={data.logoTexto ?? ""}
              onChange={(v) => set("logoTexto", v)}
              placeholder="Nervura Brasil"
            />
            <ImageField
              label="Logo (imagem)"
              value={data.logoUrl ?? ""}
              onChange={(v) => set("logoUrl", v)}
              hint="Recomendado: PNG transparente, largura mínima 300px"
            />
            {!data.logoUrl && (
              <p className="text-xs text-nervura-texto-muted flex items-center gap-1">
                <ImageIcon size={12} />
                Sem logo: o texto do nome da loja será exibido no cabeçalho.
              </p>
            )}
          </>
        )}

        {/* ANÚNCIO */}
        {abaAtiva === "anuncio" && (
          <>
            <SectionTitle>Barra de Anúncio (topo da página)</SectionTitle>
            <div className="flex items-center gap-3 p-4 bg-nervura-creme rounded-lg border border-nervura-borda">
              <input
                type="checkbox"
                id="bannerAtivo"
                checked={data.bannerAtivo ?? true}
                onChange={(e) => set("bannerAtivo", e.target.checked)}
                className="w-4 h-4 accent-nervura-verde"
              />
              <label htmlFor="bannerAtivo" className="text-sm font-medium text-nervura-texto-principal cursor-pointer">
                Exibir barra de anúncio no topo da loja
              </label>
            </div>
            <InputField
              label="Texto do anúncio"
              value={data.bannerTexto ?? ""}
              onChange={(v) => set("bannerTexto", v)}
              placeholder="🎉 Coleção Copa 2026 chegou! Use COPA10 para 10% off"
            />
            <InputField
              label="Link do anúncio"
              value={data.bannerLink ?? ""}
              onChange={(v) => set("bannerLink", v)}
              placeholder="/copa-2026"
            />
            <InputField
              label="Texto do link"
              value={data.bannerLinkTexto ?? ""}
              onChange={(v) => set("bannerLinkTexto", v)}
              placeholder="Ver coleção →"
            />
            {(data.bannerTexto || data.bannerLinkTexto) && (
              <div className="rounded-lg overflow-hidden border border-nervura-borda">
                <p className="text-xs text-nervura-texto-muted px-3 py-1.5 bg-gray-50 border-b border-nervura-borda">
                  Preview
                </p>
                <div className="bg-nervura-verde text-nervura-creme text-center py-2 px-4 text-sm">
                  {data.bannerTexto}
                  {data.bannerLinkTexto && (
                    <span className="ml-2 text-nervura-ouro font-medium">{data.bannerLinkTexto}</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* HOME */}
        {abaAtiva === "home" && (
          <>
            <SectionTitle>Hero Principal</SectionTitle>
            <ImageField
              label="Imagem de fundo do Hero"
              value={data.homeHeroImagem ?? ""}
              onChange={(v) => set("homeHeroImagem", v)}
              hint="Recomendado: 1920×1080px ou maior"
            />
            <InputField
              label="Título do Hero"
              value={data.homeHeroTitulo ?? ""}
              onChange={(v) => set("homeHeroTitulo", v)}
              placeholder="Moda com alma brasileira"
            />
            <InputField
              label="Subtítulo do Hero"
              value={data.homeHeroSubtitulo ?? ""}
              onChange={(v) => set("homeHeroSubtitulo", v)}
              placeholder="Peças exclusivas que celebram a força e elegância da mulher brasileira."
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Texto do botão principal"
                value={data.homeHeroBotaoTexto ?? ""}
                onChange={(v) => set("homeHeroBotaoTexto", v)}
                placeholder="Explorar Coleção"
              />
              <InputField
                label="Link do botão principal"
                value={data.homeHeroBotaoLink ?? ""}
                onChange={(v) => set("homeHeroBotaoLink", v)}
                placeholder="/catalogo"
              />
            </div>

            <div className="border-t border-nervura-borda pt-6">
              <SectionTitle>Seção "Nossa História"</SectionTitle>
              <div className="space-y-4">
                <ImageField
                  label="Imagem da seção Nossa História"
                  value={data.sobreImagem ?? ""}
                  onChange={(v) => set("sobreImagem", v)}
                  hint="Recomendado: proporção 4:5 (retrato)"
                />
                <InputField
                  label="Título"
                  value={data.sobreTitulo ?? ""}
                  onChange={(v) => set("sobreTitulo", v)}
                  placeholder="Feita para a mulher brasileira, com alma brasileira"
                />
                <TextareaField
                  label="Descrição"
                  value={data.sobreDescricao ?? ""}
                  onChange={(v) => set("sobreDescricao", v)}
                  placeholder="Conte a história da Nervura Brasil..."
                  rows={5}
                />
                <InputField
                  label="Texto do botão"
                  value={data.sobreBotaoTexto ?? ""}
                  onChange={(v) => set("sobreBotaoTexto", v)}
                  placeholder="Explorar coleções"
                />
              </div>
            </div>
          </>
        )}

        {/* COPA 2026 */}
        {abaAtiva === "copa" && (
          <>
            <SectionTitle>Hero da Página Copa 2026</SectionTitle>
            <ImageField
              label="Imagem de fundo do Hero Copa"
              value={data.copaHeroImagem ?? ""}
              onChange={(v) => set("copaHeroImagem", v)}
              hint="Recomendado: 1920×1080px ou maior"
            />
            <InputField
              label="Título"
              value={data.copaHeroTitulo ?? ""}
              onChange={(v) => set("copaHeroTitulo", v)}
              placeholder="Copa 2026"
            />
            <TextareaField
              label="Subtítulo"
              value={data.copaHeroSubtitulo ?? ""}
              onChange={(v) => set("copaHeroSubtitulo", v)}
              placeholder="Vista a alma do Brasil. Peças exclusivas criadas para celebrar o maior evento de futebol do mundo."
              rows={3}
            />
          </>
        )}

        {/* CATÁLOGO */}
        {abaAtiva === "catalogo" && (
          <>
            <SectionTitle>Página de Catálogo</SectionTitle>
            <InputField
              label="Título da página"
              value={data.catalogoTitulo ?? ""}
              onChange={(v) => set("catalogoTitulo", v)}
              placeholder="Nossa Coleção"
            />
            <ImageField
              label="Banner do topo do catálogo"
              value={data.catalogoBannerImagem ?? ""}
              onChange={(v) => set("catalogoBannerImagem", v)}
              hint="Imagem exibida como fundo do banner de topo do catálogo"
            />
          </>
        )}

        {/* CORES */}
        {abaAtiva === "cores" && (
          <>
            <SectionTitle>Cores Principais da Loja</SectionTitle>
            <p className="text-sm text-nervura-texto-muted">
              Defina as cores principais usadas em toda a loja. Use valores hexadecimais (#RRGGBB).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ColorField
                label="Verde Principal"
                value={data.corVerdePrincipal ?? "#1A4D2E"}
                onChange={(v) => set("corVerdePrincipal", v)}
              />
              <ColorField
                label="Dourado / Ouro"
                value={data.corOuro ?? "#C9A84C"}
                onChange={(v) => set("corOuro", v)}
              />
              <ColorField
                label="Cor de Fundo"
                value={data.corFundo ?? "#F5EFD6"}
                onChange={(v) => set("corFundo", v)}
              />
              <ColorField
                label="Creme"
                value={data.corCreme ?? "#FAF7EE"}
                onChange={(v) => set("corCreme", v)}
              />
            </div>

            {/* Preview ao vivo */}
            <div className="mt-4 border border-nervura-borda rounded-xl overflow-hidden">
              <p className="text-xs text-nervura-texto-muted px-4 py-2 bg-gray-50 border-b border-nervura-borda">
                Preview das cores
              </p>
              <div className="p-6 space-y-4" style={{ backgroundColor: data.corCreme ?? "#FAF7EE" }}>
                <div
                  className="rounded-xl p-6 text-center"
                  style={{ backgroundColor: data.corVerdePrincipal ?? "#1A4D2E" }}
                >
                  <p className="font-serif text-2xl" style={{ color: data.corCreme ?? "#FAF7EE" }}>
                    Nervura Brasil
                  </p>
                  <p className="text-sm mt-1" style={{ color: data.corOuro ?? "#C9A84C" }}>
                    Moda Feminina Brasileira
                  </p>
                  <button
                    className="mt-4 px-6 py-2 rounded-lg font-medium text-sm"
                    style={{
                      backgroundColor: data.corOuro ?? "#C9A84C",
                      color: data.corVerdePrincipal ?? "#1A4D2E",
                    }}
                  >
                    Ver Catálogo
                  </button>
                </div>
                <div
                  className="rounded-lg p-4 text-center border"
                  style={{ backgroundColor: data.corFundo ?? "#F5EFD6", borderColor: "#e5e7eb" }}
                >
                  <p className="text-sm" style={{ color: data.corVerdePrincipal ?? "#1A4D2E" }}>
                    Seção de destaque com cor de fundo
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* RODAPÉ */}
        {abaAtiva === "rodape" && (
          <>
            <SectionTitle>Rodapé</SectionTitle>
            <TextareaField
              label="Descrição no rodapé"
              value={data.rodapeDescricao ?? ""}
              onChange={(v) => set("rodapeDescricao", v)}
              placeholder="Moda feminina brasileira com identidade. Peças exclusivas que celebram a força e elegância da mulher brasileira."
              rows={4}
            />
          </>
        )}
      </div>

      {/* Bottom save button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={salvar}
          disabled={saving}
          className="flex items-center gap-2 bg-nervura-verde text-nervura-creme px-6 py-3 rounded-lg text-sm font-medium hover:bg-nervura-verde-medio transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
