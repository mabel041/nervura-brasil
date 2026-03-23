"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

interface Props {
  conversionId: string;   // ex: AW-17868003171/eKr3CIi52I0cEOOukMhC
  transactionId: string;  // número do pedido
  valor: number;
}

export function GoogleAdsConversao({ conversionId, transactionId, valor }: Props) {
  useEffect(() => {
    if (!conversionId) return;

    const disparar = () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: conversionId,
          transaction_id: transactionId,
          value: valor,
          currency: "BRL",
        });
      }
    };

    // Tenta imediatamente e também após 2s (caso gtag ainda não tenha carregado)
    disparar();
    const timer = setTimeout(disparar, 2000);
    return () => clearTimeout(timer);
  }, [conversionId, transactionId, valor]);

  return null;
}
