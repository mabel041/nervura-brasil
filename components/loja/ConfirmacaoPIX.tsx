"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, Loader2, CheckCircle } from "lucide-react";
import { useCarrinho } from "@/store/carrinho";

interface Props {
  pedidoId: string;
  qrCodeBase64: string;
  copiaCola: string;
}

export function ConfirmacaoPIX({ pedidoId, qrCodeBase64, copiaCola }: Props) {
  const router = useRouter();
  const { limpar } = useCarrinho();
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    limpar();
  }, [limpar]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pedidos/${pedidoId}/status`);
        const data = await res.json();
        if (data.mpStatus === "approved") {
          clearInterval(interval);
          router.refresh();
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [pedidoId, router]);

  const copiar = () => {
    navigator.clipboard.writeText(copiaCola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-nervura-borda overflow-hidden max-w-md mx-auto">
      <div className="bg-nervura-verde p-6 text-center text-nervura-creme">
        <h1 className="font-serif text-3xl">Pague com PIX</h1>
        <p className="text-nervura-texto-muted mt-1 text-sm">Escaneie o QR Code ou copie o código</p>
      </div>

      <div className="p-6 space-y-6 text-center">
        {qrCodeBase64 && (
          <div className="flex justify-center">
            <Image
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              width={220}
              height={220}
              className="rounded-lg border border-nervura-borda"
            />
          </div>
        )}

        <div>
          <p className="text-xs text-nervura-texto-muted mb-2">Código copia e cola:</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={copiaCola}
              className="input-field text-xs bg-nervura-creme flex-1"
            />
            <button onClick={copiar} className={`btn-primary px-3 py-2 ${copiado ? "bg-green-600" : ""}`}>
              {copiado ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          </div>
          {copiado && <p className="text-green-600 text-xs mt-1">Copiado!</p>}
        </div>

        <div className="flex items-center justify-center gap-2 text-nervura-texto-muted text-sm animate-pulse">
          <Loader2 size={16} className="animate-spin" />
          Aguardando confirmação do pagamento...
        </div>

        <p className="text-xs text-nervura-texto-muted">
          Esta página atualiza automaticamente quando o pagamento for confirmado.
        </p>
      </div>
    </div>
  );
}
