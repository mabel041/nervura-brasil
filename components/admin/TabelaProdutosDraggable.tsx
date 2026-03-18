"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, Edit, GripVertical } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BotaoExcluirProduto } from "./BotaoExcluirProduto";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  precoPromo: number | null;
  imagens: string[];
  ativo: boolean;
  colecoes: string[];
  ordem: number;
}

function LinhaArrastavel({ produto }: { produto: Produto }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: produto.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors ${isDragging ? "bg-nervura-creme shadow-lg" : ""}`}
    >
      {/* Handle de arrastar */}
      <td className="px-2 py-3 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors p-1 touch-none"
          title="Arrastar para reordenar"
        >
          <GripVertical size={18} />
        </button>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {produto.imagens[0] && (
            <div className="relative w-10 h-12 rounded overflow-hidden flex-shrink-0">
              <Image src={produto.imagens[0]} alt={produto.nome} fill className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{produto.nome}</p>
            <p className="text-xs text-gray-400">{produto.slug}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-gray-600">
        {produto.colecoes.join(", ")}
      </td>

      <td className="px-4 py-3 text-right text-sm font-medium">
        {produto.precoPromo ? (
          <div>
            <span className="text-nervura-verde">{formatCurrency(produto.precoPromo)}</span>
            <span className="text-gray-400 line-through text-xs ml-1">{formatCurrency(produto.preco)}</span>
          </div>
        ) : (
          formatCurrency(produto.preco)
        )}
      </td>

      <td className="px-4 py-3 text-center">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${produto.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {produto.ativo ? "Ativo" : "Inativo"}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <Link href={`/produto/${produto.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-nervura-verde transition-colors" title="Ver na loja">
            <Eye size={16} />
          </Link>
          <Link href={`/admin/produtos/${produto.id}`} className="p-1.5 text-gray-400 hover:text-nervura-verde transition-colors" title="Editar">
            <Edit size={16} />
          </Link>
          <BotaoExcluirProduto id={produto.id} nome={produto.nome} />
        </div>
      </td>
    </tr>
  );
}

export function TabelaProdutosDraggable({ produtosIniciais }: { produtosIniciais: Produto[] }) {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const salvarOrdem = useCallback(async (lista: Produto[]) => {
    setSalvando(true);
    await fetch("/api/admin/produtos/reordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: lista.map((p) => p.id) }),
    });
    setSalvando(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = produtos.findIndex((p) => p.id === active.id);
    const newIndex = produtos.findIndex((p) => p.id === over.id);
    const novaLista = arrayMove(produtos, oldIndex, newIndex);

    setProdutos(novaLista);
    salvarOrdem(novaLista);
  }

  return (
    <div className="space-y-2">
      {(salvando || salvo) && (
        <div className={`text-xs px-3 py-1.5 rounded-lg w-fit transition-all ${salvo ? "bg-green-100 text-green-700" : "bg-nervura-creme text-nervura-verde"}`}>
          {salvando ? "💾 Salvando ordem..." : "✅ Ordem salva!"}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-2 py-3 w-8"></th>
              <th className="px-4 py-3 text-left">Produto</th>
              <th className="px-4 py-3 text-left">Coleção</th>
              <th className="px-4 py-3 text-right">Preço</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={produtos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <tbody className="divide-y divide-gray-100">
                {produtos.map((p) => (
                  <LinhaArrastavel key={p.id} produto={p} />
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <GripVertical size={12} /> Arraste pelo ícone <GripVertical size={12} /> para reordenar. A ordem é salva automaticamente.
      </p>
    </div>
  );
}
