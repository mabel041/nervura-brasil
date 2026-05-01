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
    <div className="relative border-b border-[#20382c]/10 bg-[#e7dcc4] px-4 py-2.5 text-[#20382c]">
      <div className="editorial-shell flex items-center justify-center gap-3 text-center font-sans text-[11px] font-medium uppercase tracking-[0.22em]">
        <span>{texto}</span>
        {linkHref && linkLabel && (
          <Link href={linkHref} className="border-b border-current font-semibold transition-colors hover:border-transparent">
            {linkLabel}
          </Link>
        )}
      </div>
      <button
        onClick={() => setFechado(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#20382c]/55 transition-colors hover:text-[#20382c]"
        aria-label="Fechar banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
