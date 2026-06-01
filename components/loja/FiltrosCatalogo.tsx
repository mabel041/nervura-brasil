"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const COLECOES = [
  { value: "", label: "Todas as Coleções" },
  { value: "copa-2026", label: "Copa 2026" },
  { value: "canelado", label: "Canelado" },
  { value: "basics", label: "Basics" },
];

const TAMANHOS = ["PP", "P", "M", "G", "GG"];

const CORES = ["Preto", "Branco", "Verde", "Rosa", "Azul", "Bege", "Vermelho", "Amarelo"];

const ORDENACAO = [
  { value: "criadoEm_desc", label: "Mais Recentes" },
  { value: "preco_asc", label: "Menor Preço" },
  { value: "preco_desc", label: "Maior Preço" },
  { value: "nome_asc", label: "A–Z" },
];

function ConteudoFiltros({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const params = useSearchParams();

  const atualizar = useCallback(
    (chave: string, valor: string) => {
      const p = new URLSearchParams(params.toString());
      if (valor) p.set(chave, valor);
      else p.delete(chave);
      p.delete("page");
      router.push(`/catalogo?${p.toString()}`);
    },
    [params, router]
  );

  const limpar = () => {
    router.push("/catalogo");
    onClose?.();
  };

  const temFiltros =
    params.has("colecao") || params.has("tamanho") || params.has("cor") ||
    params.has("precoMin") || params.has("precoMax");

  return (
    <div className="space-y-6">
      {/* Ordenação */}
      <div>
        <label className="label">Ordenar por</label>
        <div className="relative">
          <select
            value={params.get("orderBy") ?? "criadoEm_desc"}
            onChange={(e) => atualizar("orderBy", e.target.value)}
            className="input-field text-sm appearance-none pr-8 w-full"
          >
            {ORDENACAO.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-nervura-texto-muted" />
        </div>
      </div>

      {/* Coleção */}
      <div>
        <label className="label">Coleção</label>
        <div className="space-y-1">
          {COLECOES.map((c) => (
            <button
              key={c.value}
              onClick={() => atualizar("colecao", c.value)}
              className={`w-full text-left text-sm px-3 py-3 rounded-md transition-colors ${
                (params.get("colecao") ?? "") === c.value
                  ? "bg-nervura-verde text-nervura-creme font-medium"
                  : "text-nervura-texto-secundario hover:bg-nervura-creme-escuro active:bg-nervura-creme-escuro"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tamanho */}
      <div>
        <label className="label">Tamanho</label>
        <div className="flex flex-wrap gap-2">
          {TAMANHOS.map((t) => (
            <button
              key={t}
              onClick={() => atualizar("tamanho", params.get("tamanho") === t ? "" : t)}
              className={`min-w-[48px] h-11 px-3 border rounded-md text-sm font-medium transition-colors ${
                params.get("tamanho") === t
                  ? "bg-nervura-verde text-nervura-creme border-nervura-verde"
                  : "border-nervura-borda text-nervura-texto-secundario hover:border-nervura-verde active:bg-nervura-creme"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cor */}
      <div>
        <label className="label">Cor</label>
        <div className="grid grid-cols-2 gap-1">
          {CORES.map((c) => (
            <button
              key={c}
              onClick={() => atualizar("cor", params.get("cor") === c ? "" : c)}
              className={`text-left text-sm px-3 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                params.get("cor") === c
                  ? "text-nervura-verde font-medium bg-nervura-creme"
                  : "text-nervura-texto-secundario hover:text-nervura-texto-principal active:bg-nervura-creme"
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${params.get("cor") === c ? "bg-nervura-verde" : "bg-nervura-borda"}`} />
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div>
        <label className="label">Faixa de Preço</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Mín"
            value={params.get("precoMin") ?? ""}
            onChange={(e) => atualizar("precoMin", e.target.value)}
            className="input-field text-sm w-full"
            min={0}
          />
          <span className="text-nervura-texto-muted flex-shrink-0">–</span>
          <input
            type="number"
            placeholder="Máx"
            value={params.get("precoMax") ?? ""}
            onChange={(e) => atualizar("precoMax", e.target.value)}
            className="input-field text-sm w-full"
            min={0}
          />
        </div>
      </div>

      {temFiltros && (
        <button
          onClick={limpar}
          className="w-full text-sm text-nervura-texto-muted hover:text-nervura-verde underline transition-colors py-1"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export function FiltrosCatalogo() {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const params = useSearchParams();

  const totalFiltros = [
    params.get("colecao"),
    params.get("tamanho"),
    params.get("cor"),
    params.get("precoMin"),
    params.get("precoMax"),
  ].filter(Boolean).length;

  return (
    <>
      {/* Botão mobile — visível só em telas < lg */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerAberto(true)}
          className="flex items-center gap-2 px-4 h-11 border border-nervura-borda rounded-md text-sm font-medium text-nervura-texto-secundario hover:border-nervura-verde transition-colors active:bg-nervura-creme w-full justify-center"
        >
          <SlidersHorizontal size={16} />
          Filtrar e Ordenar
          {totalFiltros > 0 && (
            <span className="ml-1 bg-nervura-verde text-nervura-creme rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalFiltros}
            </span>
          )}
        </button>
      </div>

      {/* Drawer mobile */}
      {drawerAberto && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setDrawerAberto(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col lg:hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-nervura-borda">
              <h3 className="font-serif text-lg text-nervura-texto-principal">Filtros</h3>
              <button
                onClick={() => setDrawerAberto(false)}
                className="p-2 -mr-2 text-nervura-texto-muted"
                aria-label="Fechar filtros"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              <ConteudoFiltros onClose={() => setDrawerAberto(false)} />
            </div>
            <div className="p-4 border-t border-nervura-borda">
              <button
                onClick={() => setDrawerAberto(false)}
                className="btn-primary w-full py-3.5 text-base"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sidebar desktop — visível só em lg+ */}
      <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
        <ConteudoFiltros />
      </aside>
    </>
  );
}
