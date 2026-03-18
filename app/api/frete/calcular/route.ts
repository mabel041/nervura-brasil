import { NextRequest, NextResponse } from "next/server";

const CEP_ORIGEM = process.env.SUPERFRETE_CEP_ORIGEM ?? "83010420";

function calcularFrete(cepDestino: string) {
  const prefixo = parseInt(cepDestino.substring(0, 2), 10);

  let pac = 18.90;
  let sedex = 32.90;

  if (prefixo >= 80 && prefixo <= 87) {
    // Paraná (origem)
    pac = 12.90; sedex = 22.90;
  } else if (prefixo >= 1 && prefixo <= 19) {
    // São Paulo
    pac = 15.90; sedex = 27.90;
  } else if (prefixo >= 20 && prefixo <= 28) {
    // Rio de Janeiro
    pac = 16.90; sedex = 28.90;
  } else if (prefixo >= 88 && prefixo <= 89) {
    // Santa Catarina
    pac = 13.90; sedex = 24.90;
  } else if (prefixo >= 90 && prefixo <= 99) {
    // Rio Grande do Sul
    pac = 14.90; sedex = 25.90;
  } else if (prefixo >= 30 && prefixo <= 39) {
    // Minas Gerais
    pac = 17.90; sedex = 29.90;
  } else if (prefixo >= 40 && prefixo <= 48) {
    // Bahia
    pac = 19.90; sedex = 34.90;
  } else if (prefixo >= 60 && prefixo <= 63) {
    // Ceará
    pac = 21.90; sedex = 37.90;
  } else if (prefixo >= 70 && prefixo <= 73) {
    // Distrito Federal / Goiás
    pac = 20.90; sedex = 35.90;
  }

  return [
    {
      id: 1,
      nome: "PAC (Correios)",
      preco: pac,
      prazo: 10,
      descricao: "8 a 12 dias úteis",
      codigo: "pac",
    },
    {
      id: 2,
      nome: "SEDEX (Correios)",
      preco: sedex,
      prazo: 3,
      descricao: "2 a 5 dias úteis",
      codigo: "sedex",
    },
  ];
}

export async function POST(req: NextRequest) {
  const { cep } = await req.json();

  const cepLimpo = (cep ?? "").replace(/\D/g, "");
  if (cepLimpo.length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  try {
    // Valida o CEP via ViaCEP
    const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      next: { revalidate: 3600 },
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.erro) {
        return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 });
      }
    }
  } catch {
    // Se a validação falhar por rede, continua mesmo assim
  }

  const opcoes = calcularFrete(cepLimpo);
  return NextResponse.json({ opcoes, cepOrigem: CEP_ORIGEM });
}
