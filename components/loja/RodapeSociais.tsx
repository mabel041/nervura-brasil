import Link from "next/link";
import { Mail } from "lucide-react";

interface RodapeSociaisProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  whatsappNumero?: string;
}

function IconeInstagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}

function IconeTikTok() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#010101" />
      <path
        d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5 2.592 2.592 0 0 1-2.59-2.5 2.592 2.592 0 0 1 2.59-2.5c.27 0 .53.04.77.1V9.83a5.712 5.712 0 0 0-.77-.06 5.679 5.679 0 0 0-5.68 5.68 5.679 5.679 0 0 0 5.68 5.68 5.679 5.679 0 0 0 5.68-5.68V9.19a7.355 7.355 0 0 0 4.3 1.37V7.47a4.29 4.29 0 0 1-2.96-1.65z"
        fill="white"
      />
      <path
        d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5 2.592 2.592 0 0 1-2.59-2.5 2.592 2.592 0 0 1 2.59-2.5c.27 0 .53.04.77.1V9.83a5.712 5.712 0 0 0-.77-.06 5.679 5.679 0 0 0-5.68 5.68 5.679 5.679 0 0 0 5.68 5.68 5.679 5.679 0 0 0 5.68-5.68V9.19a7.355 7.355 0 0 0 4.3 1.37V7.47a4.29 4.29 0 0 1-2.96-1.65z"
        fill="#69C9D0"
        opacity="0.5"
      />
    </svg>
  );
}

function IconeWhatsApp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#25D366" />
      <path
        d="M12 4.2a7.8 7.8 0 0 0-6.73 11.69L4 20l4.26-1.24A7.8 7.8 0 1 0 12 4.2zm4.56 10.97c-.19.54-1.12 1.04-1.54 1.08-.38.04-.74.17-2.48-.52-2.07-.83-3.4-2.95-3.5-3.08-.1-.13-.82-1.09-.82-2.08s.52-1.48.7-1.68c.19-.2.41-.25.55-.25l.4.01c.13 0 .3-.05.47.36.18.42.62 1.51.67 1.62.05.11.08.24.02.38-.06.14-.09.22-.18.34-.09.12-.19.26-.27.35-.09.1-.19.2-.08.4.11.19.5.82 1.07 1.33.73.65 1.35.85 1.54.95.19.1.3.08.41-.05.11-.13.47-.55.6-.74.13-.19.25-.16.43-.1.18.06 1.15.54 1.35.64.2.1.33.15.38.23.05.08.05.47-.14 1.01z"
        fill="white"
      />
    </svg>
  );
}

export function RodapeSociais({
  instagramUrl,
  tiktokUrl,
  facebookUrl,
  whatsappNumero,
}: RodapeSociaisProps) {
  const tel = whatsappNumero ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5541999999999";

  return (
    <footer className="border-t border-black/5 bg-[#f7f2e8] text-nervura-verde">
      <div className="editorial-shell py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h3 className="mb-4 font-serif text-3xl font-semibold tracking-[-0.03em]">Nervura Brasil</h3>
            <p className="max-w-sm text-sm leading-7 text-nervura-texto-secundario">
              Moda feminina brasileira com identidade. Pecas de presenca calma, corte preciso e materia viva.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-nervura-texto-muted">
              Loja
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/catalogo", label: "Catalogo" },
                { href: "/copa-2026", label: "Copa 2026" },
                { href: "/catalogo?colecao=canelado", label: "Canelado" },
                { href: "/catalogo?colecao=basics", label: "Basics" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-nervura-texto-muted">
              Siga-nos
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                  <IconeInstagram /> Instagram
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                  <IconeTikTok /> TikTok
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <rect width="24" height="24" rx="5" fill="#1877F2" />
                    <path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="white" />
                  </svg>
                  Facebook
                </a>
              )}
              <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                <IconeWhatsApp /> WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-nervura-texto-muted">
              Contato
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:contato@nervurabrasil.com" className="flex items-center gap-2 text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                <Mail size={18} /> contato@nervurabrasil.com
              </a>
              <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nervura-texto-secundario transition-colors hover:text-nervura-verde">
                <IconeWhatsApp /> Falar no WhatsApp
              </a>
              <p className="mt-1 text-xs leading-relaxed text-nervura-texto-muted">
                Seg-Sex, 9h as 18h
                <br />
                Respondemos em ate 24h
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-nervura-verde/10 pt-6 text-xs text-nervura-texto-muted sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Nervura Brasil. Todos os direitos reservados.</span>
          <a href="mailto:contato@nervurabrasil.com" className="transition-colors hover:text-nervura-verde">
            contato@nervurabrasil.com
          </a>
        </div>
      </div>
    </footer>
  );
}
