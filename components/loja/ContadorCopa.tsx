"use client";

import { useEffect, useState } from "react";

const COPA_DATE = new Date("2026-06-11T20:00:00-03:00"); // Abertura Copa 2026

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
    <div className="flex items-center justify-center gap-4">
      {unidades.map((u, i) => (
        <div key={u.label} className="flex items-center gap-4">
          <div className="text-center">
            <div className="bg-nervura-ouro text-nervura-verde font-bold font-mono text-3xl sm:text-4xl w-16 sm:w-20 h-16 sm:h-20 rounded-lg flex items-center justify-center tabular-nums">
              {String(u.valor).padStart(2, "0")}
            </div>
            <span className="text-nervura-texto-muted text-xs mt-1 block">{u.label}</span>
          </div>
          {i < 3 && (
            <span className="text-nervura-ouro font-bold text-2xl mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
