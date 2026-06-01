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
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#fffdf8]">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid h-14 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-200 ${
                    index === 0
                      ? "border-b border-nervura-verde pb-1 text-nervura-verde"
                      : "text-nervura-texto-secundario hover:text-nervura-verde"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link href="/" className="justify-self-start md:justify-self-center">
              <span className="font-serif text-[1.7rem] font-semibold tracking-[-0.03em] text-nervura-verde">
                Nervura Brasil
              </span>
            </Link>

            <div className="flex items-center justify-self-end gap-3">
              <button
                onClick={() => setAberto(true)}
                className="relative text-nervura-verde transition-colors duration-200 hover:text-nervura-ouro"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={20} />
                {qtd > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-nervura-ouro text-[10px] font-bold text-nervura-texto-principal">
                    {qtd > 9 ? "9+" : qtd}
                  </span>
                )}
              </button>

              <button
                className="text-nervura-verde transition-colors hover:text-nervura-ouro md:hidden"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Menu"
              >
                {menuAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {menuAberto && (
            <nav className="border-t border-nervura-verde/10 pb-5 pt-4 md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-nervura-texto-secundario transition-colors hover:text-nervura-verde"
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
