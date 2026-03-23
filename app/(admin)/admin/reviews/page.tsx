"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  nome: string;
  email: string;
  nota: number;
  titulo?: string | null;
  comentario: string;
  aprovado: boolean;
  criadoEm: string;
  produto: { nome: string; slug: string };
}

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= nota ? "fill-nervura-ouro text-nervura-ouro" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "aprovados">("pendentes");

  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) {
        setErro(`Erro HTTP ${res.status}: ${res.statusText}`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        setErro("Sessão expirada. Faça login novamente.");
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      setErro(`Erro ao carregar: ${e}`);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function aprovar(id: string, aprovado: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprovado }),
    });
    carregar();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta avaliação?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    carregar();
  }

  const filtrados = reviews.filter((r) => {
    if (filtro === "pendentes") return !r.aprovado;
    if (filtro === "aprovados") return r.aprovado;
    return true;
  });

  const pendentes = reviews.filter((r) => !r.aprovado).length;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-nervura-texto-principal">Avaliações</h1>
          <p className="text-nervura-texto-muted text-sm mt-1">Modere as avaliações dos clientes</p>
        </div>
        {pendentes > 0 && (
          <span className="bg-nervura-ouro text-nervura-verde text-sm font-bold px-3 py-1 rounded-full">
            {pendentes} pendente{pendentes !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {(["pendentes", "aprovados", "todos"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filtro === f ? "bg-nervura-verde text-nervura-creme" : "bg-white border border-nervura-borda text-nervura-texto-muted hover:bg-nervura-creme"
            }`}
          >
            {f} {f === "pendentes" && pendentes > 0 ? `(${pendentes})` : ""}
          </button>
        ))}
      </div>

      {/* Loading / Erro */}
      {carregando && (
        <div className="text-center py-16 text-nervura-texto-muted">Carregando avaliações...</div>
      )}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{erro}</div>
      )}

      {/* Lista */}
      {!carregando && !erro && filtrados.length === 0 ? (
        <div className="text-center py-16 text-nervura-texto-muted bg-white rounded-xl border border-nervura-borda">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma avaliação {filtro === "pendentes" ? "pendente" : filtro === "aprovados" ? "aprovada" : ""}</p>
        </div>
      ) : !carregando && !erro ? (
        <div className="space-y-3">
          {filtrados.map((r) => (
            <div key={r.id} className={`bg-white border rounded-xl p-5 space-y-3 ${!r.aprovado ? "border-nervura-ouro/40" : "border-nervura-borda"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-nervura-texto-principal">{r.nome}</p>
                    <span className="text-xs text-nervura-texto-muted">{r.email}</span>
                    {!r.aprovado && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pendente</span>}
                    {r.aprovado && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Publicado</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Estrelas nota={r.nota} />
                    <span className="text-xs text-nervura-texto-muted">em {r.produto.nome}</span>
                  </div>
                </div>
                <p className="text-xs text-nervura-texto-muted shrink-0">
                  {new Date(r.criadoEm).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {r.titulo && <p className="font-medium text-sm text-nervura-texto-principal">"{r.titulo}"</p>}
              <p className="text-sm text-nervura-texto-secundario leading-relaxed">{r.comentario}</p>

              <div className="flex gap-2 pt-1">
                {!r.aprovado ? (
                  <button onClick={() => aprovar(r.id, true)} className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors">
                    <Check size={14} /> Aprovar
                  </button>
                ) : (
                  <button onClick={() => aprovar(r.id, false)} className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    <X size={14} /> Despublicar
                  </button>
                )}
                <button onClick={() => excluir(r.id)} className="flex items-center gap-1.5 border border-red-200 text-red-500 px-4 py-1.5 rounded-lg text-sm hover:bg-red-50 transition-colors">
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
