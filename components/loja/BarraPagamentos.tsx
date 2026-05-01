export function BarraPagamentos() {
  return (
    <section className="border-t border-black/5 bg-[#f4ecd9] px-4 py-5">
      <div className="editorial-shell flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-2">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-nervura-texto-secundario">
            Pagamento seguro
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-7 w-12 items-center justify-center border border-nervura-verde/10 bg-white px-2 py-1">
              <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" aria-label="Visa" className="h-auto w-full">
                <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">
                  VISA
                </text>
              </svg>
            </div>
            <div className="flex h-7 w-12 items-center justify-center border border-nervura-verde/10 bg-white px-2 py-1">
              <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                <circle cx="13" cy="12" r="10" fill="#EB001B" />
                <circle cx="25" cy="12" r="10" fill="#F79E1B" />
                <path d="M19 5.8a10 10 0 0 1 0 12.4A10 10 0 0 1 19 5.8z" fill="#FF5F00" />
              </svg>
            </div>
            <div className="flex h-7 w-12 items-center justify-center border border-nervura-verde/10 bg-white px-2 py-1">
              <svg viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg" aria-label="Elo">
                <text x="0" y="15" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#FFD700">
                  elo
                </text>
              </svg>
            </div>
            <div className="flex h-7 w-14 items-center justify-center border border-nervura-verde/10 bg-white px-2 py-1">
              <svg viewBox="0 0 70 20" xmlns="http://www.w3.org/2000/svg" aria-label="Hipercard">
                <text x="0" y="15" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#B6091C">
                  hiper
                </text>
              </svg>
            </div>
            <div className="flex h-7 w-12 items-center justify-center border border-nervura-verde/10 bg-white px-2 py-1">
              <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" aria-label="PIX">
                <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#32BCAD">
                  PIX
                </text>
              </svg>
            </div>
            <div className="flex h-7 w-14 items-center justify-center border border-nervura-verde/10 bg-white px-2 py-1">
              <svg viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg" aria-label="Boleto">
                <rect x="0" y="3" width="3" height="14" fill="#222" />
                <rect x="5" y="3" width="2" height="14" fill="#222" />
                <rect x="9" y="3" width="3" height="14" fill="#222" />
                <rect x="14" y="3" width="1" height="14" fill="#222" />
                <rect x="17" y="3" width="3" height="14" fill="#222" />
                <rect x="22" y="3" width="2" height="14" fill="#222" />
                <rect x="26" y="3" width="3" height="14" fill="#222" />
                <text x="32" y="14" fontFamily="Arial" fontSize="9" fill="#555">
                  boleto
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-nervura-verde/10 bg-white px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1A4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] leading-tight text-nervura-verde">
                Compra Segura
              </p>
              <p className="text-[10px] leading-tight text-nervura-texto-muted">100% protegida</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-nervura-verde/10 bg-white px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1A4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] leading-tight text-nervura-verde">
                SSL Protegido
              </p>
              <p className="text-[10px] leading-tight text-nervura-texto-muted">Dados criptografados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
