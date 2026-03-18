"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCarrinho } from "@/store/carrinho";
import { formatCurrency } from "@/lib/utils";
import { CardProduto } from "./CardProduto";
import { trackEvent } from "@/components/PixelProvider";

interface Variacao {
  id: string;
  cor: string;
  tamanho: string;
  estoque: number;
}

interface Produto {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  preco: number;
  precoPromo?: number | null;
  imagens: string[];
  imagensPorCor?: Record<string, string[]> | null;
  video?: string | null;
  colecao: string;
  material?: string | null;
  variacoes: Variacao[];
}

interface Props {
  produto: Produto;
  relacionados: Produto[];
}

export function ProdutoDetalhes({ produto, relacionados }: Props) {
  const [imagemSelecionada, setImagemSelecionada] = useState(0);
  const [corSelecionada, setCorSelecionada] = useState<string>("");
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>("");
  const [adicionado, setAdicionado] = useState(false);
  const [galeriaVisivel, setGaleriaVisivel] = useState(true);
  const { adicionarItem } = useCarrinho();

  const cores = Array.from(new Set(produto.variacoes.map((v) => v.cor)));
  const tamanhos = Array.from(new Set(produto.variacoes.map((v) => v.tamanho)));

  const estoqueDisponivel = (cor: string, tamanho: string) => {
    const v = produto.variacoes.find((v) => v.cor === cor && v.tamanho === tamanho);
    return v?.estoque ?? 0;
  };

  const tamanhoDisponivel = (tamanho: string) => {
    if (!corSelecionada) return true;
    return estoqueDisponivel(corSelecionada, tamanho) > 0;
  };

  // Determina a galeria ativa baseada na cor selecionada
  const galeriaAtiva: string[] =
    corSelecionada &&
    produto.imagensPorCor &&
    produto.imagensPorCor[corSelecionada] &&
    produto.imagensPorCor[corSelecionada].length > 0
      ? produto.imagensPorCor[corSelecionada]
      : produto.imagens;

  const precoAtual = produto.precoPromo ?? produto.preco;
  const mostrarVideo = imagemSelecionada === -1 && produto.video;
  const imagem = galeriaAtiva[imagemSelecionada] ?? galeriaAtiva[0];

  const handleAdicionarCarrinho = () => {
    if (!corSelecionada || !tamanhoSelecionado) return;
    adicionarItem({
      produtoId: produto.id,
      slug: produto.slug,
      nome: produto.nome,
      imagem: produto.imagens[0] ?? "",
      preco: precoAtual,
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
      quantidade: 1,
    });
    trackEvent("AddToCart", { content_name: produto.nome, value: precoAtual, currency: "BRL" });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-nervura-texto-muted mb-6">
        <Link href="/" className="hover:text-nervura-verde transition-colors">Home</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-nervura-verde transition-colors">Catálogo</Link>
        <span>/</span>
        <span className="text-nervura-texto-principal">{produto.nome}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Galeria */}
        <div>
          <div
            className="relative aspect-[3/4] rounded-xl overflow-hidden bg-nervura-creme-escuro transition-opacity duration-200"
            style={{ opacity: galeriaVisivel ? 1 : 0 }}
          >
            {mostrarVideo ? (
              <video
                src={produto.video!}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={imagem}
                alt={produto.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>
          {(galeriaAtiva.length > 1 || produto.video) && (
            <div
              className="flex gap-2 mt-3 overflow-x-auto pb-1 transition-opacity duration-200"
              style={{ opacity: galeriaVisivel ? 1 : 0 }}
            >
              {produto.video && (
                <button
                  onClick={() => setImagemSelecionada(-1)}
                  className={`relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all bg-black flex items-center justify-center ${
                    imagemSelecionada === -1
                      ? "border-nervura-verde"
                      : "border-transparent hover:border-nervura-borda"
                  }`}
                >
                  <span className="text-white text-2xl">▶</span>
                </button>
              )}
              {galeriaAtiva.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagemSelecionada(i)}
                  className={`relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    imagemSelecionada === i
                      ? "border-nervura-verde"
                      : "border-transparent hover:border-nervura-borda"
                  }`}
                >
                  <Image src={img} alt={`${produto.nome} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/catalogo?colecao=${produto.colecao}`}
              className="text-nervura-ouro font-sans text-xs uppercase tracking-widest hover:text-nervura-verde transition-colors"
            >
              {produto.colecao === "copa-2026" ? "Copa 2026" : produto.colecao}
            </Link>
            <h1 className="font-serif text-3xl lg:text-4xl text-nervura-texto-principal mt-2">
              {produto.nome}
            </h1>
          </div>

          {/* Preço */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-3xl text-nervura-verde">
              {formatCurrency(precoAtual)}
            </span>
            {produto.precoPromo && produto.precoPromo < produto.preco && (
              <span className="text-nervura-texto-muted text-lg line-through">
                {formatCurrency(produto.preco)}
              </span>
            )}
          </div>

          {/* Cor */}
          <div>
            <label className="label">
              Cor: {corSelecionada && <span className="font-semibold">{corSelecionada}</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {cores.map((cor) => (
                <button
                  key={cor}
                  onClick={() => {
                    setGaleriaVisivel(false);
                    setTimeout(() => {
                      setCorSelecionada(cor);
                      setTamanhoSelecionado("");
                      // Se há imagens específicas para a cor, começa na primeira; senão, usa índice da cor
                      const temImagensCor =
                        produto.imagensPorCor &&
                        produto.imagensPorCor[cor] &&
                        produto.imagensPorCor[cor].length > 0;
                      if (temImagensCor) {
                        setImagemSelecionada(0);
                      } else {
                        const corIndex = cores.indexOf(cor);
                        setImagemSelecionada(corIndex < produto.imagens.length ? corIndex : 0);
                      }
                      setGaleriaVisivel(true);
                    }, 200);
                  }}
                  className={`border rounded-md px-4 py-2 text-sm transition-all ${
                    corSelecionada === cor
                      ? "bg-nervura-verde text-nervura-creme border-nervura-verde"
                      : "border-nervura-borda text-nervura-texto-secundario hover:border-nervura-verde"
                  }`}
                >
                  {cor}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho */}
          <div>
            <label className="label">
              Tamanho: {tamanhoSelecionado && <span className="font-semibold">{tamanhoSelecionado}</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {tamanhos.map((t) => {
                const disponivel = tamanhoDisponivel(t);
                const selecionado = tamanhoSelecionado === t;
                return (
                  <button
                    key={t}
                    onClick={() => disponivel && setTamanhoSelecionado(t)}
                    disabled={!disponivel}
                    className={`border rounded-md w-12 h-10 text-sm font-medium transition-all ${
                      selecionado
                        ? "bg-nervura-verde text-nervura-creme border-nervura-verde"
                        : disponivel
                        ? "border-nervura-borda text-nervura-texto-secundario hover:border-nervura-verde"
                        : "border-nervura-borda text-nervura-borda cursor-not-allowed line-through"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {corSelecionada && tamanhoSelecionado && (
              <p className="text-xs mt-2 text-nervura-texto-muted">
                Estoque: {estoqueDisponivel(corSelecionada, tamanhoSelecionado)} unidades
              </p>
            )}
          </div>

          {/* Botão */}
          <button
            onClick={handleAdicionarCarrinho}
            disabled={!corSelecionada || !tamanhoSelecionado}
            className={`btn-primary w-full flex items-center justify-center gap-2 text-base py-4 ${
              adicionado ? "bg-green-600" : ""
            }`}
          >
            <ShoppingBag size={20} />
            {adicionado ? "Adicionado!" : "Adicionar ao Carrinho"}
          </button>

          {!corSelecionada || !tamanhoSelecionado ? (
            <p className="text-xs text-nervura-texto-muted text-center -mt-3">
              Selecione a cor e o tamanho para adicionar
            </p>
          ) : null}

          {/* Descrição */}
          <div className="border-t border-nervura-borda pt-4">
            <h3 className="font-serif text-lg mb-2">Descrição</h3>
            <p className="text-nervura-texto-secundario text-sm leading-relaxed">
              {produto.descricao}
            </p>
            {produto.material && (
              <p className="text-sm text-nervura-texto-muted mt-2">
                <span className="font-medium">Material:</span> {produto.material}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {relacionados.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-3xl text-center mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relacionados.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-nervura-texto-muted hover:text-nervura-verde transition-colors">
          <ChevronLeft size={16} /> Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
