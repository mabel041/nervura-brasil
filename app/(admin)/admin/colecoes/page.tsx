"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, ImageIcon } from "lucide-react";

interface Colecao {
  id: string;
  nome: string;
  slug: string;
  subtitulo: string;
  imagem: string | null;
  href: string;
  ordem: number;
  ativo: boolean;
}

const vazio: Omit<Colecao, "id"> = {
  nome: "", slug: "", subtitulo: "", imagem: null, href: "", ordem: 0, ativo: true,
};

export default function ColecoesPage() {
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Colecao, "id">>(vazio);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  async function carregar() {
    const res = await fetch("/api/admin/colecoes");
    setColecoes(await res.json());
  }

  useEffect(() => { carregar(); }, []);

  function abrirNovo() {
    setForm({ ...vazio, ordem: colecoes.length });
    setEditId(null);
    setModal(true);
  }

  function abrirEditar(c: Colecao) {
    setForm({ nome: c.nome, slug: c.slug, subtitulo: c.subtitulo, imagem: c.imagem, href: c.href, ordem: c.ordem, ativo: c.ativo });
    setEditId(c.id);
    setModal(true);
  }

  async function salvar() {
    setLoading(true);
    if (editId) {
      await fetch(`/api/admin/colecoes/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/colecoes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setLoading(false);
    setModal(false);
    carregar();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta coleção da home?")) return;
    await fetch(`/api/admin/colecoes/${id}`, { method: "DELETE" });
    carregar();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setForm(f => ({ ...f, imagem: data.url }));
    }
    setUploadLoading(false);
  }

  function gerarSlug(nome: string) {
    return nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-nervura-texto-principal">Coleções da Home</h1>
          <p className="text-nervura-texto-muted text-sm mt-1">Gerencie os cards de coleções exibidos na página inicial</p>
        </div>
        <button onClick={abrirNovo} className="flex items-center gap-2 bg-nervura-verde text-nervura-creme px-4 py-2 rounded-lg text-sm hover:bg-nervura-verde-medio transition-colors">
          <Plus size={16} /> Nova Coleção
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {colecoes.length === 0 && (
          <div className="text-center py-16 text-nervura-texto-muted bg-white rounded-xl border border-nervura-borda">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma coleção cadastrada</p>
            <p className="text-xs mt-1">Clique em "Nova Coleção" para começar</p>
          </div>
        )}
        {colecoes.map((c) => (
          <div key={c.id} className="flex items-center gap-4 bg-white border border-nervura-borda rounded-xl p-4">
            <GripVertical size={16} className="text-nervura-texto-muted shrink-0" />
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-nervura-creme-escuro shrink-0">
              {c.imagem ? (
                <img src={c.imagem} alt={c.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-nervura-texto-muted" /></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-nervura-texto-principal">{c.nome}</p>
                {!c.ativo && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Inativa</span>}
              </div>
              <p className="text-sm text-nervura-texto-muted">{c.subtitulo}</p>
              <p className="text-xs text-nervura-texto-muted mt-0.5">→ {c.href}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => abrirEditar(c)} className="p-2 text-nervura-texto-muted hover:text-nervura-verde rounded-lg hover:bg-nervura-creme transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => excluir(c.id)} className="p-2 text-nervura-texto-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="font-serif text-2xl">{editId ? "Editar Coleção" : "Nova Coleção"}</h2>

            <div>
              <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Nome *</label>
              <input
                className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                value={form.nome}
                onChange={e => {
                  const nome = e.target.value;
                  setForm(f => ({ ...f, nome, slug: editId ? f.slug : gerarSlug(nome) }));
                }}
                placeholder="Ex: Copa 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Subtítulo</label>
              <input
                className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                value={form.subtitulo}
                onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))}
                placeholder="Ex: Identidade brasileira"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Link (href) *</label>
              <input
                className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                value={form.href}
                onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                placeholder="Ex: /copa-2026 ou /catalogo?colecao=canelado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Imagem da Capa</label>
              {form.imagem && (
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-nervura-borda">
                  <img src={form.imagem} alt="capa" className="w-full h-full object-cover" />
                  <button onClick={() => setForm(f => ({ ...f, imagem: null }))} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-nervura-borda rounded-lg px-4 py-3 hover:border-nervura-verde transition-colors text-sm text-nervura-texto-muted">
                <ImageIcon size={16} />
                {uploadLoading ? "Enviando..." : "Clique para fazer upload da imagem"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploadLoading} />
              </label>
              <p className="text-xs text-nervura-texto-muted mt-1">Ou cole uma URL diretamente:</p>
              <input
                className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                value={form.imagem ?? ""}
                onChange={e => setForm(f => ({ ...f, imagem: e.target.value || null }))}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Ordem</label>
                <input
                  type="number"
                  className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                  value={form.ordem}
                  onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} className="w-4 h-4 accent-nervura-verde" />
                  <span className="text-sm text-nervura-texto-principal">Ativa na home</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 border border-nervura-borda text-nervura-texto-principal px-4 py-2 rounded-lg text-sm hover:bg-nervura-creme transition-colors">
                Cancelar
              </button>
              <button onClick={salvar} disabled={loading || !form.nome || !form.href} className="flex-1 bg-nervura-verde text-nervura-creme px-4 py-2 rounded-lg text-sm hover:bg-nervura-verde-medio transition-colors disabled:opacity-50">
                {loading ? "Salvando..." : "Salvar Coleção"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
