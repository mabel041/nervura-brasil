"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrinho {
  produtoId: string;
  slug: string;
  nome: string;
  imagem: string;
  preco: number;
  cor: string;
  tamanho: string;
  quantidade: number;
}

export interface CupomAplicado {
  codigo: string;
  tipo: "percentual" | "fixo";
  valor: number;
  minPedido?: number | null;
}

interface CarrinhoState {
  itens: ItemCarrinho[];
  aberto: boolean;
  cupom: CupomAplicado | null;
  adicionarItem: (item: ItemCarrinho) => void;
  removerItem: (produtoId: string, cor: string, tamanho: string) => void;
  atualizarQuantidade: (produtoId: string, cor: string, tamanho: string, quantidade: number) => void;
  aplicarCupom: (cupom: CupomAplicado) => void;
  removerCupom: () => void;
  limpar: () => void;
  setAberto: (aberto: boolean) => void;
  subtotal: () => number;
  desconto: () => number;
  total: () => number;
  totalItens: () => number;
}

export const useCarrinho = create<CarrinhoState>()(
  persist(
    (set, get) => ({
      itens: [],
      aberto: false,
      cupom: null,

      adicionarItem: (novoItem) => {
        set((state) => {
          const existente = state.itens.find(
            (i) =>
              i.produtoId === novoItem.produtoId &&
              i.cor === novoItem.cor &&
              i.tamanho === novoItem.tamanho
          );
          if (existente) {
            return {
              itens: state.itens.map((i) =>
                i.produtoId === novoItem.produtoId &&
                i.cor === novoItem.cor &&
                i.tamanho === novoItem.tamanho
                  ? { ...i, quantidade: i.quantidade + novoItem.quantidade }
                  : i
              ),
              aberto: true,
            };
          }
          return { itens: [...state.itens, novoItem], aberto: true };
        });
      },

      removerItem: (produtoId, cor, tamanho) => {
        set((state) => ({
          itens: state.itens.filter(
            (i) => !(i.produtoId === produtoId && i.cor === cor && i.tamanho === tamanho)
          ),
        }));
      },

      atualizarQuantidade: (produtoId, cor, tamanho, quantidade) => {
        if (quantidade <= 0) {
          get().removerItem(produtoId, cor, tamanho);
          return;
        }
        set((state) => ({
          itens: state.itens.map((i) =>
            i.produtoId === produtoId && i.cor === cor && i.tamanho === tamanho
              ? { ...i, quantidade }
              : i
          ),
        }));
      },

      aplicarCupom: (cupom) => set({ cupom }),
      removerCupom: () => set({ cupom: null }),
      limpar: () => set({ itens: [], cupom: null }),
      setAberto: (aberto) => set({ aberto }),

      subtotal: () => {
        return get().itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
      },

      desconto: () => {
        const cupom = get().cupom;
        if (!cupom) return 0;
        const sub = get().subtotal();
        if (cupom.minPedido && sub < cupom.minPedido) return 0;
        if (cupom.tipo === "percentual") return (sub * cupom.valor) / 100;
        return Math.min(cupom.valor, sub);
      },

      total: () => {
        return Math.max(0, get().subtotal() - get().desconto());
      },

      totalItens: () => {
        return get().itens.reduce((acc, item) => acc + item.quantidade, 0);
      },
    }),
    {
      name: "nervura-carrinho",
      partialize: (state) => ({ itens: state.itens, cupom: state.cupom }),
    }
  )
);
