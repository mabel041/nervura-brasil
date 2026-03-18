const SUPERFRETE_URL = process.env.SUPERFRETE_SANDBOX === "true"
  ? "https://sandbox.superfrete.com"
  : "https://api.superfrete.com";

const TOKEN = process.env.SUPERFRETE_TOKEN!;
const CEP_ORIGEM = process.env.SUPERFRETE_CEP_ORIGEM!;

export interface OpcaoFrete {
  id: number;
  nome: string;
  preco: number;
  prazo: number;    // dias úteis
  descricao: string;
}

interface SuperFreteResultado {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: { min: number; max: number };
  custom_delivery_time: number;
  custom_delivery_range: { min: number; max: number };
  packages: unknown[];
  additional_services: { receipt: boolean; own_hand: boolean; collect: boolean };
  company: { id: number; name: string; picture: string };
  error?: string;
}

export async function calcularFrete(
  cepDestino: string,
  totalItens: number,  // valor declarado p/ seguro
  quantidadeItens: number
): Promise<OpcaoFrete[]> {
  // Dimensões padrão para roupas femininas (por pacote consolidado)
  const pesoKg = Math.max(0.3, quantidadeItens * 0.35);
  const altCm  = Math.min(99, 5 + quantidadeItens * 3);
  const largCm = 30;
  const compCm = 20;

  const body = {
    from: CEP_ORIGEM?.replace(/\D/g, ""),
    to:   cepDestino.replace(/\D/g, ""),
    services: "1,2,17",   // PAC, SEDEX, Mini Envios
    own_hand: false,
    receipt: false,
    insurance_value: totalItens,
    use_insurance_value: true,
    package: {
      weight: pesoKg,
      height: altCm,
      width:  largCm,
      length: compCm,
    },
  };

  const res = await fetch(`${SUPERFRETE_URL}/api/v0/calculator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      "User-Agent": "Nervura Brasil (nervurabrasil@gmail.com)",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`SuperFrete HTTP ${res.status}`);
  }

  const data: SuperFreteResultado[] = await res.json();

  return data
    .filter((s) => !s.error && parseFloat(s.custom_price || s.price) > 0)
    .map((s) => ({
      id:        s.id,
      nome:      s.name,
      preco:     parseFloat(s.custom_price || s.price),
      prazo:     s.custom_delivery_time || s.delivery_time,
      descricao: `${s.company.name} — até ${s.custom_delivery_range?.max || s.delivery_range?.max || s.delivery_time} dias úteis`,
    }))
    .sort((a, b) => a.preco - b.preco);
}
