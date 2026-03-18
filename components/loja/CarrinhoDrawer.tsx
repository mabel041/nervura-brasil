"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCarrinho } from "@/store/carrinho";
import { formatCurrency } from "@/lib/utils";

export function CarrinhoDrawer() {
  const {
    itens,
    aberto,
    setAberto,
    cupom,
    removerItem,
    atualizarQuantidade,
    removerCupom,
    aplicarCupom,
    subtotal,
    desconto,
    total,
  } = useCarrinho();

  const [codigoCupom, setCodigoCupom] = useState("");
  const [cupomErro, setCupomErro] = useState("");
  const [cupomLoading, setCupomLoading] = useState(false);

  const aplicar = async () => {
    if (!codigoCupom.trim()) return;
    setCupomLoading(true);
    setCupomErro("");
    try {
      const res = await fetch("/api/cupons/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigoCupom, subtotal: subtotal() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCupomErro(data.error ?? "Cupom inválido");
      } else {
        aplicarCupom(data);
        setCodigoCupom("");
      }
    } catch {
      setCupomErro("Erro ao validar cupom");
    } finally {
      setCupomLoading(false);
    }
  };

  if (!aberto) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setAberto(false)}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-nervura-branco-quente z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nervura-borda bg-nervura-verde">
          <h2 className="font-serif text-xl text-nervura-creme flex items-center gap-2">
            <ShoppingBag size={20} />
            Seu Carrinho
          </h2>
          <button
            onClick={() => setAberto(false)}
            className="text-nervura-creme hover:text-nervura-ouro transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-nervura-texto-muted gap-4 py-16">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="font-serif text-xl">Carrinho vazio</p>
              <button
                onClick={() => setAberto(false)}
                className="btn-primary text-sm"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            itens.map((item) => (
              <div
                key={`${item.produtoId}-${item.cor}-${item.tamanho}`}
                className="flex gap-3 bg-white rounded-lg p-3 border border-nervura-borda"
              >
                <div className="relative w-20 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imagem}
                    alt={item.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-nervura-texto-principal text-sm truncate">
                    {item.nome}
                  </p>
                  <p className="text-xs text-nervura-texto-muted mt-0.5">
                    {item.cor} · {item.tamanho}
                  </p>
                  <p className="text-nervura-verde font-semibold text-sm mt-1">
                    {formatCurrency(item.preco)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-nervura-borda rounded-md">
                      <button
                        onClick={() =>
                          atualizarQuantidade(item.produtoId, item.cor, item.tamanho, item.quantidade - 1)
                        }
                        className="px-2 py-1 hover:bg-nervura-creme transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-nervura-borda">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() =>
                          atualizarQuantidade(item.produtoId, item.cor, item.tamanho, item.quantidade + 1)
                        }
                        className="px-2 py-1 hover:bg-nervura-creme transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removerItem(item.produtoId, item.cor, item.tamanho)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="border-t border-nervura-borda p-4 space-y-3 bg-white">
            {/* Cupom */}
            {cupom ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <Tag size={14} />
                  <span className="font-medium">{cupom.codigo}</span>
                  <span>— {cupom.tipo === "percentual" ? `${cupom.valor}%` : formatCurrency(cupom.valor)} off</span>
                </div>
                <button onClick={removerCupom} className="text-green-600 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cupom de desconto"
                    value={codigoCupom}
                    onChange={(e) => setCodigoCupom(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && aplicar()}
                    className="input-field text-sm py-2 uppercase"
                  />
                  <button
                    onClick={aplicar}
                    disabled={cupomLoading}
                    className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                  >
                    {cupomLoading ? "..." : "Aplicar"}
                  </button>
                </div>
                {cupomErro && <p className="text-red-500 text-xs mt-1">{cupomErro}</p>}
              </div>
            )}

            {/* Totais */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-nervura-texto-secundario">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal())}</span>
              </div>
              {desconto() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- {formatCurrency(desconto())}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-nervura-texto-principal text-base pt-1 border-t border-nervura-borda">
                <span>Total</span>
                <span>{formatCurrency(total())}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setAberto(false)}
              className="btn-primary w-full text-center block text-sm"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
