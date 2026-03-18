"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Layers,
  Palette,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/promocoes", label: "Promoções", icon: Tag },
  { href: "/admin/colecoes", label: "Coleções", icon: Layers },
  { href: "/admin/aparencia", label: "Aparência", icon: Palette },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 bg-nervura-verde flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-nervura-verde-medio">
        <h1 className="font-serif text-xl text-nervura-creme">Nervura Brasil</h1>
        <p className="text-nervura-texto-muted text-xs mt-0.5">Painel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-nervura-ouro text-nervura-verde"
                  : "text-nervura-texto-muted hover:bg-nervura-verde-medio hover:text-nervura-creme"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-nervura-verde-medio space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-xs text-nervura-texto-muted hover:text-nervura-creme transition-colors"
        >
          <ExternalLink size={14} />
          Ver loja
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 px-4 py-2 text-xs text-nervura-texto-muted hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}
