import Link from "next/link";

interface RodapeSociaisProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  whatsappNumero?: string;
}

export function RodapeSociais({
  instagramUrl,
  tiktokUrl,
  facebookUrl,
  whatsappNumero,
}: RodapeSociaisProps) {
  const tel = whatsappNumero ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5541999999999";

  return (
    <footer className="bg-nervura-verde text-nervura-creme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marca */}
          <div>
            <h3 className="font-serif text-2xl mb-3">Nervura Brasil</h3>
            <p className="text-nervura-texto-muted text-sm leading-relaxed">
              Moda feminina brasileira com identidade. Peças exclusivas que celebram
              a força e elegância da mulher brasileira.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans font-semibold text-nervura-ouro mb-4 uppercase text-xs tracking-widest">
              Loja
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/copa-2026", label: "Copa 2026" },
                { href: "/catalogo?colecao=canelado", label: "Canelado" },
                { href: "/catalogo?colecao=basics", label: "Basics" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-nervura-texto-muted hover:text-nervura-creme transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sociais */}
          <div>
            <h4 className="font-sans font-semibold text-nervura-ouro mb-4 uppercase text-xs tracking-widest">
              Siga-nos
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nervura-texto-muted hover:text-nervura-creme transition-colors flex items-center gap-2"
                >
                  📸 Instagram
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nervura-texto-muted hover:text-nervura-creme transition-colors flex items-center gap-2"
                >
                  🎵 TikTok
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nervura-texto-muted hover:text-nervura-creme transition-colors flex items-center gap-2"
                >
                  👤 Facebook
                </a>
              )}
              <a
                href={`https://wa.me/${tel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nervura-texto-muted hover:text-nervura-creme transition-colors flex items-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-nervura-verde-medio mt-8 pt-6 text-center text-xs text-nervura-texto-muted">
          © {new Date().getFullYear()} Nervura Brasil. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
