"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const COLECOES = [
  { value: "", label: "Todas as Coleções" },
  { value: "copa-2026", label: "Copa 2026" },
  { value: "canelado", label: "Canelado" },
  { value: "basics", label: "Basics" },
];

const TAMANHOS = ["PP", "P", "M", "G", "GG"];

const CORES = [
  "Preto",
  "Branco",
  "Verde",
  "Rosa",
  "Azul",
  "Bege",
  "Vermelho",
  "Amarelo",
];

const ORDENACAO = [
  { value: "criadoEm_desc", label: "Mais Recentes" },
  { value: "preco_asc", label: "Menor Preço" },
  { value: "preco_desc", label: "Maior Preço" },
  { value: "nome_asc", label: "A–Z" },
];

export function FiltrosCatalogo() {
  const router = useRouter();
  const params = useSearchParams();

  const atualizar = useCallback(
    (chave: string, valor: string) => {
      const p = new URLSearchParams(params.toString());
      if (valor) {
        p.set(chave, valor);
      } else {
        p.delete(chave);
      }
      p.delete("page"); // reset page on filter change
      router.push(`/catalogo?${p.toString()}`);
    },
    [params, router]
  );

  const limpar = () => router.push("/catalogo");

  const temFiltros =
    params.has("colecao") ||
    params.has("tamanho") ||
    params.has("cor") ||
    params.has("precoMin") ||
    params.has("precoMax");

  return (
    <aside className="w-full lg:w-64 space-y-6">
      {/* Ordenação */}
      <div>
        <label className="label">Ordenar por</label>
        <select
          value={params.get("orderBy") ?? "criadoEm_desc"}
          onChange={(e) => atualizar("orderBy", e.target.value)}
          className="input-field text-sm"
        >
          {ORDENACAO.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Coleção */}
      <div>
        <label className="label">Coleção</label>
        <div className="space-y-1">
          {COLECOES.map((c) => (
            <button
              key={c.value}
              onClick={() => atualizar("colecao", c.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                (params.get("colecao") ?? "") === c.value
                  ? "bg-nervura-verde text-nervura-creme font-medium"
                  : "text-nervura-texto-secundario hover:bg-nervura-creme-escuro"
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
              className={`border rounded-md px-3 py-1 text-sm transition-colors ${
                params.get("tamanho") === t
                  ? "bg-nervura-verde text-nervura-creme border-nervura-verde"
                  : "border-nervura-borda text-nervura-texto-secundario hover:border-nervura-verde"
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
        <div className="space-y-1">
          {CORES.map((c) => (
            <button
              key={c}
              onClick={() => atualizar("cor", params.get("cor") === c ? "" : c)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
                params.get("cor") === c
                  ? "text-nervura-verde font-medium"
                  : "text-nervura-texto-secundario hover:text-nervura-texto-principal"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  params.get("cor") === c ? "bg-nervura-verde" : "bg-nervura-borda"
                }`}
              />
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
          <span className="text-nervura-texto-muted">–</span>
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

      {/* Limpar */}
      {temFiltros && (
        <button
          onClick={limpar}
          className="w-full text-sm text-nervura-texto-muted hover:text-nervura-verde underline transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </aside>
  );
}
