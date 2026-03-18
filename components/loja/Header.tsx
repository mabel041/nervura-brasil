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
    { href: "/catalogo", label: "Catálogo" },
    { href: "/copa-2026", label: "Copa 2026" },
    { href: "/#nossa-historia", label: "Nossa História" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-nervura-verde shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-nervura-creme tracking-wide">
                Nervura Brasil
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-nervura-ouro font-sans text-sm font-medium hover:text-nervura-creme transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAberto(true)}
                className="relative text-nervura-creme hover:text-nervura-ouro transition-colors duration-200"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={24} />
                {qtd > 0 && (
                  <span className="absolute -top-2 -right-2 bg-nervura-ouro text-nervura-verde text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {qtd > 9 ? "9+" : qtd}
                  </span>
                )}
              </button>

              {/* Menu mobile */}
              <button
                className="md:hidden text-nervura-creme hover:text-nervura-ouro transition-colors"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Menu"
              >
                {menuAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Nav mobile */}
          {menuAberto && (
            <nav className="md:hidden pb-4 border-t border-nervura-verde-medio pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-nervura-ouro font-sans text-sm font-medium hover:text-nervura-creme transition-colors"
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
