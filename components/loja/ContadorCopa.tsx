"use client";

import { useEffect, useState } from "react";

const COPA_DATE = new Date("2026-06-11T20:00:00-03:00");

interface Tempo {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcular(): Tempo {
  const diff = Math.max(0, COPA_DATE.getTime() - Date.now());
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

export function ContadorCopa() {
  const [tempo, setTempo] = useState<Tempo>({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    setTempo(calcular());
    const timer = setInterval(() => setTempo(calcular()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unidades = [
    { valor: tempo.dias, label: "dias" },
    { valor: tempo.horas, label: "horas" },
    { valor: tempo.minutos, label: "min" },
    { valor: tempo.segundos, label: "seg" },
  ];

  if (!montado) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {unidades.map((u, i) => (
        <div key={u.label} className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-nervura-verde/15 bg-[#fffaf1] font-sans text-2xl font-semibold tabular-nums text-nervura-verde sm:h-20 sm:w-20 sm:text-3xl">
              {String(u.valor).padStart(2, "0")}
            </div>
            <span className="mt-2 block font-sans text-[10px] uppercase tracking-[0.22em] text-nervura-texto-muted">
              {u.label}
            </span>
          </div>
          {i < 3 && <span className="mb-5 text-lg font-semibold text-nervura-ouro sm:text-2xl">:</span>}
        </div>
      ))}
    </div>
  );
}
