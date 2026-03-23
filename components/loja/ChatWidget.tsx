"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle, Bot, Minimize2, Loader2 } from "lucide-react";

interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

const SAUDACAO: Mensagem = {
  role: "assistant",
  content:
    "Olá! 👋 Sou a Vitória, sua consultora de moda da Nervura Brasil.\n\nPosso te ajudar com:\n• Dúvidas sobre produtos e tamanhos\n• Preços e promoções\n• Informações sobre entrega\n• Qualquer dúvida sobre a loja\n\nComo posso te ajudar hoje?",
};

const PERGUNTAS_RAPIDAS = [
  "Quais produtos estão em promoção?",
  "Como funciona a troca?",
  "Qual meu tamanho?",
  "Prazo de entrega",
];

export function ChatWidget() {
  const [aberto, setAberto] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([SAUDACAO]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarBolha, setMostrarBolha] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mostra bolha de notificação após 8s
  useEffect(() => {
    const t = setTimeout(() => setMostrarBolha(true), 8000);
    return () => clearTimeout(t);
  }, []);

  // Scroll automático para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Foca o input quando abre
  useEffect(() => {
    if (aberto && !minimizado) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [aberto, minimizado]);

  const abrirChat = () => {
    setAberto(true);
    setMinimizado(false);
    setMostrarBolha(false);
  };

  const enviar = useCallback(
    async (texto?: string) => {
      const msg = (texto ?? input).trim();
      if (!msg || carregando) return;

      const novaMensagemUser: Mensagem = { role: "user", content: msg };
      const novasMensagens = [...mensagens, novaMensagemUser];
      setMensagens(novasMensagens);
      setInput("");
      setCarregando(true);

      // Placeholder da resposta (streaming)
      const idxResposta = novasMensagens.length;
      setMensagens((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: novasMensagens.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMensagens((prev) => {
            const atualizado = [...prev];
            atualizado[idxResposta] = {
              role: "assistant",
              content:
                err.error ??
                "Desculpe, tive um problema. Tente novamente ou fale pelo WhatsApp! 😊",
            };
            return atualizado;
          });
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let textoAcumulado = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            textoAcumulado += decoder.decode(value, { stream: true });
            const textoFinal = textoAcumulado;
            setMensagens((prev) => {
              const atualizado = [...prev];
              atualizado[idxResposta] = { role: "assistant", content: textoFinal };
              return atualizado;
            });
          }
        }
      } catch {
        setMensagens((prev) => {
          const atualizado = [...prev];
          atualizado[idxResposta] = {
            role: "assistant",
            content: "Erro de conexão. Verifique sua internet e tente novamente.",
          };
          return atualizado;
        });
      } finally {
        setCarregando(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, mensagens, carregando]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      {!aberto && (
        <div className="fixed bottom-24 left-5 z-40 flex flex-col items-start gap-2">
          {/* Bolha de notificação */}
          {mostrarBolha && (
            <div
              className="bg-white border border-nervura-borda rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-lg text-sm text-nervura-texto-principal max-w-[200px] animate-bounce-soft cursor-pointer"
              onClick={abrirChat}
            >
              <p className="font-medium">Precisa de ajuda? 😊</p>
              <p className="text-nervura-texto-muted text-xs mt-0.5">Pode me perguntar!</p>
            </div>
          )}

          <button
            onClick={abrirChat}
            className="w-14 h-14 bg-nervura-verde rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform group relative"
            aria-label="Abrir chat"
          >
            <MessageCircle size={26} className="text-nervura-creme" />
            {/* Indicador online */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </button>
        </div>
      )}

      {/* Janela do chat */}
      {aberto && (
        <div
          className={`fixed bottom-24 left-5 z-50 bg-white rounded-2xl shadow-2xl border border-nervura-borda flex flex-col transition-all duration-300 ${
            minimizado ? "h-14 w-72" : "w-[340px] sm:w-[380px] h-[520px]"
          }`}
        >
          {/* Header */}
          <div className="bg-nervura-verde rounded-t-2xl px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 bg-nervura-ouro rounded-full flex items-center justify-center">
                <Bot size={18} className="text-nervura-verde" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-nervura-verde" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-nervura-creme font-semibold text-sm leading-tight">Vitória</p>
              <p className="text-nervura-texto-muted text-xs">Consultora Nervura Brasil • Online</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimizado((v) => !v)}
                className="p-1.5 hover:bg-nervura-verde-medio rounded-lg transition-colors"
                aria-label="Minimizar"
              >
                <Minimize2 size={15} className="text-nervura-creme" />
              </button>
              <button
                onClick={() => setAberto(false)}
                className="p-1.5 hover:bg-nervura-verde-medio rounded-lg transition-colors"
                aria-label="Fechar chat"
              >
                <X size={15} className="text-nervura-creme" />
              </button>
            </div>
          </div>

          {!minimizado && (
            <>
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-nervura-creme/30">
                {mensagens.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 bg-nervura-ouro rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                        <Bot size={12} className="text-nervura-verde" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-nervura-verde text-nervura-creme rounded-tr-sm"
                          : "bg-white text-nervura-texto-principal rounded-tl-sm shadow-sm border border-nervura-borda/50"
                      }`}
                    >
                      {msg.content === "" && carregando ? (
                        <span className="flex items-center gap-1.5 text-nervura-texto-muted">
                          <Loader2 size={12} className="animate-spin" />
                          <span className="text-xs">digitando...</span>
                        </span>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Perguntas rápidas (só no início) */}
              {mensagens.length <= 1 && (
                <div className="px-3 pb-2 flex gap-1.5 flex-wrap border-t border-nervura-borda/40 pt-2 bg-white">
                  {PERGUNTAS_RAPIDAS.map((p) => (
                    <button
                      key={p}
                      onClick={() => enviar(p)}
                      disabled={carregando}
                      className="text-xs bg-nervura-creme border border-nervura-borda text-nervura-texto-secundario px-2.5 py-1 rounded-full hover:bg-nervura-verde hover:text-nervura-creme hover:border-nervura-verde transition-colors disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-nervura-borda bg-white rounded-b-2xl flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua dúvida..."
                    disabled={carregando}
                    className="flex-1 bg-nervura-creme/60 border border-nervura-borda rounded-xl px-3.5 py-2 text-sm text-nervura-texto-principal placeholder:text-nervura-texto-muted focus:outline-none focus:border-nervura-verde transition-colors disabled:opacity-60"
                  />
                  <button
                    onClick={() => enviar()}
                    disabled={!input.trim() || carregando}
                    className="w-9 h-9 bg-nervura-verde rounded-xl flex items-center justify-center hover:bg-nervura-verde-medio transition-colors disabled:opacity-40 flex-shrink-0"
                    aria-label="Enviar mensagem"
                  >
                    {carregando ? (
                      <Loader2 size={15} className="text-nervura-creme animate-spin" />
                    ) : (
                      <Send size={15} className="text-nervura-creme" />
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-nervura-texto-muted mt-1.5">
                  IA pode cometer erros •{" "}
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5541999999999"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-nervura-verde"
                  >
                    Falar com humano
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
