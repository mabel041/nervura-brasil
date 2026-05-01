"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCarrinho } from "@/store/carrinho";
import { CarrinhoDrawer } from "./CarrinhoDrawer";

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { setAberto, totalItens } = useCarrinho();
  const qtd = totalItens();

  const navLinks = [
    { href: "/catalogo", label: "Catalogo" },
    { href: "/copa-2026", label: "Copa 2026" },
    { href: "/#nossa-historia", label: "Nossa Historia" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#1a472a]/10 bg-[#fcf9f8]/90 text-[#18211c] backdrop-blur-xl">
        <div className="editorial-grid">
          <div className="grid min-h-[4.8rem] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-['var(--font-space-grotesk)'] text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-200 ${
                    index === 0
                      ? "border-b border-[#1a472a] pb-1 text-[#1a472a]"
                      : "text-[#5f665f] hover:text-[#1a472a]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link href="/" className="justify-self-start md:justify-self-center">
              <div className="flex flex-col">
                <span className="font-['var(--font-space-grotesk)'] text-[9px] uppercase tracking-[0.34em] text-[#9f8a52]">Nervura</span>
                <span className="font-serif text-[2rem] font-medium tracking-[-0.04em] text-[#1a472a]">Brasil</span>
              </div>
            </Link>

            <div className="flex items-center justify-self-end gap-3">
              <button
                onClick={() => setAberto(true)}
                className="relative text-[#1a472a] transition-colors duration-200 hover:text-[#9f8a52]"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={20} />
                {qtd > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a472a] text-[10px] font-bold text-[#fcf9f8]">
                    {qtd > 9 ? "9+" : qtd}
                  </span>
                )}
              </button>

              <button
                className="text-[#1a472a] transition-colors hover:text-[#9f8a52] md:hidden"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Menu"
              >
                {menuAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {menuAberto && (
            <nav className="border-t border-[#1a472a]/10 pb-5 pt-4 md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 font-['var(--font-space-grotesk)'] text-[11px] font-medium uppercase tracking-[0.22em] text-[#5f665f] transition-colors hover:text-[#1a472a]"
                  onClick={() => setMenuAberto(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <CarrinhoDrawer />
    </>
  );
}
