"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  nome: string;
  nota: number;
  titulo?: string | null;
  comentario: string;
  criadoEm: string;
}

function Estrelas({ nota, tamanho = 16, interativo = false, onChange }: {
  nota: number;
  tamanho?: number;
  interativo?: boolean;
  onChange?: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={tamanho}
          className={`transition-colors ${
            i <= (interativo ? hover || nota : nota)
              ? "fill-nervura-ouro text-nervura-ouro"
              : "fill-gray-200 text-gray-200"
          } ${interativo ? "cursor-pointer" : ""}`}
          onMouseEnter={() => interativo && setHover(i)}
          onMouseLeave={() => interativo && setHover(0)}
          onClick={() => interativo && onChange?.(i)}
        />
      ))}
    </div>
  );
}

function MediaEstrelas({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const media = reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    nota: n,
    qtd: reviews.filter((r) => r.nota === n).length,
    pct: Math.round((reviews.filter((r) => r.nota === n).length / reviews.length) * 100),
  }));
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 bg-nervura-creme rounded-xl border border-nervura-borda">
      <div className="text-center shrink-0">
        <p className="font-serif text-5xl text-nervura-verde">{media.toFixed(1)}</p>
        <Estrelas nota={Math.round(media)} tamanho={18} />
        <p className="text-xs text-nervura-texto-muted mt-1">{reviews.length} avaliação{reviews.length !== 1 ? "ões" : ""}</p>
      </div>
      <div className="flex-1 w-full space-y-1.5">
        {dist.map((d) => (
          <div key={d.nota} className="flex items-center gap-2">
            <span className="text-xs text-nervura-texto-muted w-4 text-right">{d.nota}</span>
            <Star size={12} className="fill-nervura-ouro text-nervura-ouro shrink-0" />
            <div className="flex-1 bg-nervura-borda rounded-full h-2">
              <div className="bg-nervura-ouro h-2 rounded-full transition-all" style={{ width: `${d.pct}%` }} />
            </div>
            <span className="text-xs text-nervura-texto-muted w-6">{d.qtd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormReview({ produtoId, onEnviado }: { produtoId: string; onEnviado: () => void }) {
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState(0);
  const [form, setForm] = useState({ nome: "", email: "", titulo: "", comentario: "" });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nota === 0) { setErro("Selecione uma nota."); return; }
    if (!form.nome || !form.email || !form.comentario) { setErro("Preencha todos os campos obrigatórios."); return; }
    setLoading(true);
    setErro("");
    const res = await fetch(`/api/reviews/${produtoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, nota }),
    });
    setLoading(false);
    if (res.ok) {
      setSucesso(true);
      setForm({ nome: "", email: "", titulo: "", comentario: "" });
      setNota(0);
      onEnviado();
    } else {
      setErro("Erro ao enviar. Tente novamente.");
    }
  };

  if (sucesso) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-700 font-medium">✅ Avaliação enviada!</p>
        <p className="text-green-600 text-sm mt-1">Ela será publicada após aprovação. Obrigada!</p>
      </div>
    );
  }

  return (
    <div>
      {!aberto ? (
        <button
          onClick={() => setAberto(true)}
          className="w-full border-2 border-dashed border-nervura-borda text-nervura-texto-muted hover:border-nervura-verde hover:text-nervura-verde rounded-xl py-4 text-sm font-medium transition-colors"
        >
          + Escrever uma avaliação
        </button>
      ) : (
        <form onSubmit={enviar} className="bg-white border border-nervura-borda rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-nervura-texto-principal">Sua avaliação</h3>

          <div>
            <label className="block text-sm font-medium text-nervura-texto-principal mb-2">Nota *</label>
            <Estrelas nota={nota} tamanho={28} interativo onChange={setNota} />
            {nota > 0 && (
              <p className="text-xs text-nervura-texto-muted mt-1">
                {["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"][nota]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Nome *</label>
              <input
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nervura-texto-principal mb-1">E-mail *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
                placeholder="seu@email.com (não publicado)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Título</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde"
              placeholder="Ex: Amei o produto!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nervura-texto-principal mb-1">Comentário *</label>
            <textarea
              rows={3}
              value={form.comentario}
              onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
              className="w-full border border-nervura-borda rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nervura-verde resize-none"
              placeholder="Conte o que achou do produto, qualidade, caimento..."
            />
          </div>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setAberto(false)} className="flex-1 border border-nervura-borda text-nervura-texto-principal px-4 py-2 rounded-lg text-sm hover:bg-nervura-creme transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-nervura-verde text-nervura-creme px-4 py-2 rounded-lg text-sm hover:bg-nervura-verde-medio transition-colors disabled:opacity-50">
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function Reviews({ produtoId }: { produtoId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    setLoading(true);
    const res = await fetch(`/api/reviews/${produtoId}`);
    setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => { carregar(); }, [produtoId]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="font-serif text-3xl text-nervura-texto-principal mb-6">
        Avaliações dos clientes
      </h2>

      {/* Média geral */}
      {reviews.length > 0 && <div className="mb-6"><MediaEstrelas reviews={reviews} /></div>}

      {/* Formulário */}
      <div className="mb-8">
        <FormReview produtoId={produtoId} onEnviado={carregar} />
      </div>

      {/* Lista de reviews */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-nervura-borda rounded-xl p-5 space-y-2">
              <div className="h-4 bg-nervura-borda rounded w-1/3" />
              <div className="h-3 bg-nervura-borda rounded w-full" />
              <div className="h-3 bg-nervura-borda rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-nervura-texto-muted">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-medium">Nenhuma avaliação ainda</p>
          <p className="text-sm mt-1">Seja a primeira a avaliar este produto!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-nervura-borda rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-nervura-texto-principal">{r.nome}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Compra verificada</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Estrelas nota={r.nota} tamanho={14} />
                    {r.titulo && <span className="text-sm font-medium text-nervura-texto-principal">{r.titulo}</span>}
                  </div>
                </div>
                <p className="text-xs text-nervura-texto-muted shrink-0">
                  {new Date(r.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <p className="text-sm text-nervura-texto-secundario leading-relaxed">{r.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
