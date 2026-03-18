"use client";

import { MessageCircle } from "lucide-react";

interface BotaoWhatsAppProps {
  numero?: string;
}

export function BotaoWhatsApp({ numero }: BotaoWhatsAppProps) {
  const tel = numero ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5541999999999";
  const mensagem = encodeURIComponent(
    "Olá! Vim pelo site da Nervura Brasil e gostaria de saber mais sobre os produtos. 😊"
  );

  return (
    <a
      href={`https://wa.me/${tel}?text=${mensagem}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
        Falar no WhatsApp
      </span>
    </a>
  );
}
