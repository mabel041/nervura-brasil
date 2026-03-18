"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

interface BannerPromocaoProps {
  texto: string;
  linkHref?: string;
  linkLabel?: string;
}

export function BannerPromocao({ texto, linkHref, linkLabel }: BannerPromocaoProps) {
  const [fechado, setFechado] = useState(false);

  if (fechado) return null;

  return (
    <div className="bg-nervura-ouro text-nervura-verde py-2 px-4 relative">
      <div className="max-w-7xl mx-auto text-center text-sm font-sans font-medium flex items-center justify-center gap-2">
        <span>{texto}</span>
        {linkHref && linkLabel && (
          <Link href={linkHref} className="underline font-bold hover:no-underline">
            {linkLabel}
          </Link>
        )}
      </div>
      <button
        onClick={() => setFechado(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-nervura-verde hover:text-nervura-texto-principal transition-colors"
        aria-label="Fechar banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
