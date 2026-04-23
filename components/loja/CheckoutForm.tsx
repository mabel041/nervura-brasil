"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, CreditCard, Smartphone, Loader2, Copy, Truck } from "lucide-react";
import { useCarrinho } from "@/store/carrinho";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validacoes";
import { formatCurrency } from "@/lib/utils";
import { createMetaEventId, getMetaBrowserData, trackEvent } from "@/components/PixelProvider";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MercadoPago?: any;
  }
}

type Parcela = { installments: number; installment_amount: number; total_amount: number; recommended_message: string };
type OpcaoFrete = { id: number; nome: string; preco: number; prazo: number; descricao: string };

export function CheckoutForm() {
  const router = useRouter();
  const { itens, cupom, subtotal, desconto, total, limpar } = useCarrinho();
  const [tab, setTab] = useState<"pix" | "cartao">("pix");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; copiaCola: string; pedidoId: string } | null>(null);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState(1);
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[]>([]);
  const [freteSelecionado, setFreteSelecionado] = useState<OpcaoFrete | null>(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteErro, setFreteErro] = useState("");
  const cardFormRef = useRef<{ getCardFormData: () => Promise<Record<string, unknown>> } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { formaPagamento: "pix" },
  });

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    if (tab === "cartao" && !window.MercadoPago) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.onload = () => initCardForm();
      document.head.appendChild(script);
    } else if (tab === "cartao" && window.MercadoPago) {
      initCardForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const initCardForm = () => {
    if (!window.MercadoPago) return;
    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "pt-BR" });
    const cf = mp.cardForm({
      amount: String(total().toFixed(2)),
      iframe: true,
      form: {
        id: "form-checkout",
        cardNumber: { id: "form-checkout__cardNumber", placeholder: "Número do cartão" },
        expirationDate: { id: "form-checkout__expirationDate", placeholder: "MM/YY" },
        securityCode: { id: "form-checkout__securityCode", placeholder: "CVV" },
        cardholderName: { id: "form-checkout__cardholderName", placeholder: "Nome no cartão" },
        issuer: { id: "form-checkout__issuer", placeholder: "Banco" },
        installments: { id: "form-checkout__installments", placeholder: "Parcelas" },
        identificationNumber: { id: "form-checkout__identificationNumber" },
        cardholderEmail: { id: "form-checkout__cardholderEmail" },
      },
      callbacks: {
        onFormMounted: (err: unknown) => err && console.warn("CardForm error:", err),
        onInstallmentsReceived: (_err: unknown, data: { payer_costs: Parcela[] }) => {
          setParcelas(data?.payer_costs ?? []);
        },
      },
    });
    cardFormRef.current = cf;
  };

  // Auto-preencher CEP + calcular frete
  const cep = watch("cep");
  useEffect(() => {
    const c = cep?.replace(/\D/g, "");
    if (c?.length === 8) {
      // Preencher endereço
      fetch(`/api/cep/${c}`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.error) {
            setValue("rua", d.rua ?? "");
            setValue("bairro", d.bairro ?? "");
            setValue("cidade", d.cidade ?? "");
            setValue("estado", d.estado ?? "");
          }
        })
        .catch(() => {});

      // Calcular frete
      setFreteLoading(true);
      setFreteErro("");
      setOpcoesFrete([]);
      setFreteSelecionado(null);
      fetch("/api/frete/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: c,
          totalItens: subtotal(),
          quantidadeItens: itens.reduce((acc, i) => acc + i.quantidade, 0),
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.opcoes?.length) {
            setOpcoesFrete(d.opcoes);
            setFreteSelecionado(d.opcoes[0]);
          } else {
            setFreteErro("Não foi possível calcular o frete para este CEP.");
          }
        })
        .catch(() => setFreteErro("Erro ao calcular frete."))
        .finally(() => setFreteLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep, setValue]);

  // Polling PIX
  useEffect(() => {
    if (!pixData?.pedidoId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/pedidos/${pixData.pedidoId}/status`);
      const data = await res.json();
      if (data.mpStatus === "approved") {
        clearInterval(interval);
        limpar();
        router.push(`/pedido/${pixData.pedidoId}`);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pixData, limpar, total, router]);

  const onSubmit = async (form: CheckoutFormData) => {
    if (itens.length === 0) return;
    setLoading(true);
    setErro("");

    const endereco = {
      cep: form.cep,
      rua: form.rua,
      numero: form.numero,
      complemento: form.complemento,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
    };

    const freteValor = freteSelecionado?.preco ?? 0;
    const totalComFrete = total() + freteValor;
    const metaContents = itens.map((item) => ({
      id: item.produtoId,
      quantity: item.quantidade,
      item_price: item.preco,
    }));
    const metaContentIds = itens.map((item) => item.produtoId);
    const metaNumItems = itens.reduce((acc, item) => acc + item.quantidade, 0);
    const initiateCheckoutEventId = createMetaEventId("initiate_checkout");
    const browserData = getMetaBrowserData();

    const base = {
      itens: itens.map((i) => ({
        produtoId: i.produtoId,
        cor: i.cor,
        tamanho: i.tamanho,
        quantidade: i.quantidade,
        preco: i.preco,
      })),
      cupom,
      subtotal: subtotal(),
      desconto: desconto(),
      total: totalComFrete,
      freteValor,
      freteServico: freteSelecionado?.nome ?? null,
      fretePrazo: freteSelecionado?.prazo ?? null,
      meta: {
        initiateCheckoutEventId,
        browserData,
      },
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      cpf: form.cpf,
      endereco,
    };

    trackEvent(
      "InitiateCheckout",
      {
        content_ids: metaContentIds,
        contents: metaContents,
        content_type: "product",
        currency: "BRL",
        num_items: metaNumItems,
        value: totalComFrete,
      },
      { eventId: initiateCheckoutEventId }
    );

    try {
      if (form.formaPagamento === "pix") {
        const res = await fetch("/api/checkout/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Erro no pagamento PIX");
        setPixData({ qrCodeBase64: data.qrCodeBase64, copiaCola: data.copiaCola, pedidoId: data.pedidoId });
      } else {
        const formData = await cardFormRef.current?.getCardFormData();
        const res = await fetch("/api/checkout/cartao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...base, ...formData, installments: parcelasSelecionadas }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Erro no pagamento");
        limpar();
        router.push(`/pedido/${data.pedidoId}`);
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  // PIX QR Code exibido
  if (pixData) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 bg-white rounded-xl p-8 shadow-md border border-nervura-borda">
        <div className="flex items-center justify-center gap-2 text-nervura-verde">
          <Smartphone size={24} />
          <h2 className="font-serif text-2xl">Pague com PIX</h2>
        </div>
        <p className="text-nervura-texto-muted text-sm">
          Escaneie o QR Code abaixo ou copie o código. Aprovação em segundos!
        </p>
        {pixData.qrCodeBase64 && (
          <div className="flex justify-center">
            <Image
              src={`data:image/png;base64,${pixData.qrCodeBase64}`}
              alt="QR Code PIX"
              width={220}
              height={220}
            />
          </div>
        )}
        <div>
          <p className="text-xs text-nervura-texto-muted mb-2">Código copia e cola:</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={pixData.copiaCola}
              className="input-field text-xs bg-nervura-creme"
            />
            <button
              onClick={() => navigator.clipboard.writeText(pixData.copiaCola)}
              className="btn-primary px-3 py-2"
              title="Copiar"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-nervura-texto-muted text-sm animate-pulse">
          <Loader2 size={16} className="animate-spin" />
          Aguardando pagamento...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="lg:col-span-2">
        <form id="form-checkout" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados pessoais */}
          <section className="bg-white rounded-xl p-6 border border-nervura-borda">
            <h2 className="font-serif text-xl mb-4">Dados Pessoais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Nome completo</label>
                <input {...register("nome")} className="input-field" placeholder="Seu nome completo" />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
              </div>
              <div>
                <label className="label">E-mail</label>
                <input {...register("email")} type="email" className="input-field" placeholder="seu@email.com" id="form-checkout__cardholderEmail" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Telefone</label>
                <input {...register("telefone")} className="input-field" placeholder="(11) 99999-9999" />
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
              </div>
              <div>
                <label className="label">CPF</label>
                <input {...register("cpf")} className="input-field" placeholder="000.000.000-00" id="form-checkout__identificationNumber" />
                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
              </div>
            </div>
          </section>

          {/* Endereço */}
          <section className="bg-white rounded-xl p-6 border border-nervura-borda">
            <h2 className="font-serif text-xl mb-4">Endereço de Entrega</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">CEP</label>
                <input {...register("cep")} className="input-field" placeholder="00000-000" maxLength={9} />
                {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label">Rua</label>
                <input {...register("rua")} className="input-field" placeholder="Rua, Avenida..." />
                {errors.rua && <p className="text-red-500 text-xs mt-1">{errors.rua.message}</p>}
              </div>
              <div>
                <label className="label">Número</label>
                <input {...register("numero")} className="input-field" placeholder="123" />
                {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero.message}</p>}
              </div>
              <div>
                <label className="label">Complemento</label>
                <input {...register("complemento")} className="input-field" placeholder="Apto, bloco..." />
              </div>
              <div>
                <label className="label">Bairro</label>
                <input {...register("bairro")} className="input-field" placeholder="Seu bairro" />
                {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro.message}</p>}
              </div>
              <div>
                <label className="label">Cidade</label>
                <input {...register("cidade")} className="input-field" placeholder="Sua cidade" />
                {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>}
              </div>
              <div>
                <label className="label">Estado (UF)</label>
                <input {...register("estado")} className="input-field" placeholder="SP" maxLength={2} />
                {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>}
              </div>
            </div>
          </section>

          {/* Frete */}
          <section className="bg-white rounded-xl p-6 border border-nervura-borda">
            <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
              <Truck size={20} className="text-nervura-verde" /> Frete
            </h2>
            {freteLoading && (
              <div className="flex items-center gap-2 text-nervura-texto-muted text-sm">
                <Loader2 size={16} className="animate-spin" /> Calculando frete...
              </div>
            )}
            {freteErro && (
              <p className="text-red-500 text-sm">{freteErro}</p>
            )}
            {!freteLoading && opcoesFrete.length === 0 && !freteErro && (
              <p className="text-nervura-texto-muted text-sm">Preencha o CEP acima para calcular o frete.</p>
            )}
            {opcoesFrete.length > 0 && (
              <div className="space-y-2">
                {opcoesFrete.map((op) => (
                  <label
                    key={op.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      freteSelecionado?.id === op.id
                        ? "border-nervura-verde bg-nervura-creme"
                        : "border-nervura-borda hover:border-nervura-verde"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="frete"
                        checked={freteSelecionado?.id === op.id}
                        onChange={() => setFreteSelecionado(op)}
                        className="accent-nervura-verde"
                      />
                      <div>
                        <p className="font-medium text-sm">{op.nome}</p>
                        <p className="text-xs text-nervura-texto-muted">{op.descricao}</p>
                      </div>
                    </div>
                    <span className="font-bold text-nervura-verde text-sm">{formatCurrency(op.preco)}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Pagamento */}
          <section className="bg-white rounded-xl p-6 border border-nervura-borda">
            <h2 className="font-serif text-xl mb-4">Forma de Pagamento</h2>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
              {(["pix", "cartao"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setValue("formaPagamento", t); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                    tab === t
                      ? "border-nervura-verde bg-nervura-verde text-nervura-creme"
                      : "border-nervura-borda text-nervura-texto-secundario hover:border-nervura-verde"
                  }`}
                >
                  {t === "pix" ? <><Smartphone size={18} /> PIX</> : <><CreditCard size={18} /> Cartão de Crédito</>}
                </button>
              ))}
            </div>

            {tab === "pix" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <CheckCircle size={16} />
                  PIX — Aprovação imediata
                </div>
                <p className="text-green-600">Após confirmar, você receberá o QR Code para pagamento. Pague no app do seu banco e o pedido será confirmado em segundos.</p>
              </div>
            )}

            {tab === "cartao" && (
              <div className="space-y-4">
                <div>
                  <label className="label">Número do Cartão</label>
                  <div id="form-checkout__cardNumber" className="input-field h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Validade</label>
                    <div id="form-checkout__expirationDate" className="input-field h-10" />
                  </div>
                  <div>
                    <label className="label">CVV</label>
                    <div id="form-checkout__securityCode" className="input-field h-10" />
                  </div>
                </div>
                <div>
                  <label className="label">Nome no Cartão</label>
                  <div id="form-checkout__cardholderName" className="input-field h-10" />
                </div>
                <div className="hidden">
                  <div id="form-checkout__issuer" />
                </div>
                {parcelas.length > 0 && (
                  <div>
                    <label className="label">Parcelas</label>
                    <select
                      value={parcelasSelecionadas}
                      onChange={(e) => setParcelasSelecionadas(Number(e.target.value))}
                      className="input-field"
                      id="form-checkout__installments"
                    >
                      {parcelas.map((p) => (
                        <option key={p.installments} value={p.installments}>
                          {p.recommended_message}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </section>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || itens.length === 0}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Processando...</>
            ) : (
              <>{tab === "pix" ? "Gerar PIX" : "Pagar com Cartão"} — {formatCurrency(total() + (freteSelecionado?.preco ?? 0))}</>
)}
          </button>
        </form>
      </div>

      {/* Resumo do pedido */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl p-6 border border-nervura-borda sticky top-24 space-y-4">
          <h2 className="font-serif text-xl">Resumo do Pedido</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {itens.map((item) => (
              <div key={`${item.produtoId}-${item.cor}-${item.tamanho}`} className="flex gap-3">
                <div className="relative w-14 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.imagem} alt={item.nome} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <p className="font-medium line-clamp-1">{item.nome}</p>
                  <p className="text-nervura-texto-muted text-xs">{item.cor} · {item.tamanho} · x{item.quantidade}</p>
                  <p className="text-nervura-verde font-semibold">{formatCurrency(item.preco * item.quantidade)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-nervura-borda pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-nervura-texto-secundario">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal())}</span>
            </div>
            {desconto() > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto ({cupom?.codigo})</span>
                <span>- {formatCurrency(desconto())}</span>
              </div>
            )}
            <div className="flex justify-between text-nervura-texto-secundario">
              <span>Frete {freteSelecionado ? `(${freteSelecionado.nome})` : ""}</span>
              <span>{freteSelecionado ? formatCurrency(freteSelecionado.preco) : "—"}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-nervura-borda">
              <span>Total</span>
              <span className="text-nervura-verde">
                {formatCurrency(total() + (freteSelecionado?.preco ?? 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
