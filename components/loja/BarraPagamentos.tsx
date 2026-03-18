export function BarraPagamentos() {
  return (
    <section className="bg-nervura-creme border-t border-nervura-borda py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Métodos de pagamento */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <p className="text-xs font-semibold text-nervura-texto-secundario uppercase tracking-widest">
            Pagamento seguro
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {/* Visa */}
            <div className="bg-white border border-nervura-borda rounded px-2 py-1 flex items-center justify-center h-8 w-14">
              <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" aria-label="Visa" className="w-full h-auto">
                <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="bg-white border border-nervura-borda rounded px-2 py-1 flex items-center justify-center h-8 w-14">
              <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                <circle cx="13" cy="12" r="10" fill="#EB001B" />
                <circle cx="25" cy="12" r="10" fill="#F79E1B" />
                <path d="M19 5.8a10 10 0 0 1 0 12.4A10 10 0 0 1 19 5.8z" fill="#FF5F00" />
              </svg>
            </div>
            {/* Elo */}
            <div className="bg-white border border-nervura-borda rounded px-2 py-1 flex items-center justify-center h-8 w-14">
              <svg viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg" aria-label="Elo">
                <text x="0" y="15" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#FFD700">elo</text>
              </svg>
            </div>
            {/* Hipercard */}
            <div className="bg-white border border-nervura-borda rounded px-2 py-1 flex items-center justify-center h-8 w-16">
              <svg viewBox="0 0 70 20" xmlns="http://www.w3.org/2000/svg" aria-label="Hipercard">
                <text x="0" y="15" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#B6091C">hiper</text>
              </svg>
            </div>
            {/* PIX */}
            <div className="bg-white border border-nervura-borda rounded px-2 py-1 flex items-center justify-center h-8 w-14">
              <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" aria-label="PIX">
                <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#32BCAD">PIX</text>
              </svg>
            </div>
            {/* Boleto */}
            <div className="bg-white border border-nervura-borda rounded px-2 py-1 flex items-center justify-center h-8 w-16">
              <svg viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg" aria-label="Boleto">
                <rect x="0" y="3" width="3" height="14" fill="#222" />
                <rect x="5" y="3" width="2" height="14" fill="#222" />
                <rect x="9" y="3" width="3" height="14" fill="#222" />
                <rect x="14" y="3" width="1" height="14" fill="#222" />
                <rect x="17" y="3" width="3" height="14" fill="#222" />
                <rect x="22" y="3" width="2" height="14" fill="#222" />
                <rect x="26" y="3" width="3" height="14" fill="#222" />
                <text x="32" y="14" fontFamily="Arial" fontSize="9" fill="#555">boleto</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Badges de segurança */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white border border-nervura-borda rounded-lg px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1A4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <p className="text-[10px] font-bold text-nervura-verde leading-tight">Compra Segura</p>
              <p className="text-[9px] text-nervura-texto-muted leading-tight">100% protegida</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-nervura-borda rounded-lg px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1A4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <p className="text-[10px] font-bold text-nervura-verde leading-tight">SSL Protegido</p>
              <p className="text-[9px] text-nervura-texto-muted leading-tight">Dados criptografados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
