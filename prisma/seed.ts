import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGENS_COPA = [
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
  "https://images.unsplash.com/photo-1511719434606-32ef99ee8a46?w=800",
];

const IMAGENS_CANELADO = [
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
  "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800",
];

const IMAGENS_BASICS = [
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800",
  "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
  "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
];

const CORES = ["Preto", "Branco", "Verde"];
const TAMANHOS = ["PP", "P", "M", "G", "GG"];

function gerarVariacoes(cores: string[]) {
  return cores.flatMap((cor) =>
    TAMANHOS.map((tamanho) => ({
      cor,
      tamanho,
      estoque: Math.floor(Math.random() * 20) + 5,
    }))
  );
}

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados existentes
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.variacao.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.cupom.deleteMany();
  await prisma.configuracao.deleteMany();

  // === PRODUTOS COPA 2026 ===
  const produtosCopa = [
    {
      nome: "Cropped Copa Brasil Verde",
      slug: "cropped-copa-brasil-verde",
      descricao: "Cropped exclusivo da coleção Copa 2026. Tecido leve e sustentável, perfeito para torcer com estilo. Corte moderno e confortável.",
      preco: 129.90,
      precoPromo: 89.90,
      imagens: [IMAGENS_COPA[0], IMAGENS_COPA[1]],
      colecoes: ["copa-2026"],
      material: "92% Algodão, 8% Elastano",
      destaque: true,
    },
    {
      nome: "Body Copa Amarelo Ouro",
      slug: "body-copa-amarelo-ouro",
      descricao: "Body elegante em amarelo vibrante. A peça mais esperada da coleção Copa 2026. Versátil para looks do dia a dia.",
      preco: 149.90,
      imagens: [IMAGENS_COPA[1], IMAGENS_COPA[2]],
      colecoes: ["copa-2026"],
      material: "95% Viscose, 5% Elastano",
      destaque: true,
    },
    {
      nome: "Set Copa Verde e Amarelo",
      slug: "set-copa-verde-amarelo",
      descricao: "Conjunto top + shorts especial Copa 2026. Tecido esportivo com acabamento premium. Para torcer com muito estilo!",
      preco: 249.90,
      precoPromo: 199.90,
      imagens: [IMAGENS_COPA[2], IMAGENS_COPA[3]],
      colecoes: ["copa-2026"],
      material: "85% Poliamida, 15% Elastano",
      destaque: false,
    },
    {
      nome: "Regata Copa Brasil",
      slug: "regata-copa-brasil",
      descricao: "Regata confortável com bordado exclusivo da Nervura Brasil Copa 2026. Algodão premium de alta qualidade.",
      preco: 89.90,
      imagens: [IMAGENS_COPA[3], IMAGENS_COPA[0]],
      colecoes: ["copa-2026"],
      material: "100% Algodão",
      destaque: false,
    },
  ];

  // === PRODUTOS CANELADO ===
  const produtosCanelado = [
    {
      nome: "Conjunto Canelado Preto",
      slug: "conjunto-canelado-preto",
      descricao: "O clássico conjunto canelado em preto. Top + legging de alta compressão. Perfeito para academia e uso casual.",
      preco: 199.90,
      precoPromo: 159.90,
      imagens: [IMAGENS_CANELADO[0], IMAGENS_CANELADO[1]],
      colecoes: ["canelado"],
      material: "90% Poliamida, 10% Elastano",
      destaque: true,
    },
    {
      nome: "Top Canelado Bege",
      slug: "top-canelado-bege",
      descricao: "Top canelado em bege neutro, básico essencial do guarda-roupa feminino. Confortável e versátil para qualquer look.",
      preco: 89.90,
      imagens: [IMAGENS_CANELADO[1], IMAGENS_CANELADO[2]],
      colecoes: ["canelado"],
      material: "92% Algodão canelado, 8% Elastano",
      destaque: false,
    },
    {
      nome: "Legging Canelada Verde",
      slug: "legging-canelada-verde",
      descricao: "Legging canelada em verde nervura, com cintura alta e tecido de alta compressão. Modelagem que valoriza a silhueta.",
      preco: 129.90,
      imagens: [IMAGENS_CANELADO[2], IMAGENS_CANELADO[3]],
      colecoes: ["canelado"],
      material: "88% Poliamida, 12% Elastano",
      destaque: true,
    },
    {
      nome: "Body Canelado Off-White",
      slug: "body-canelado-off-white",
      descricao: "Body canelado em off-white com decote sutil. Peça versátil que combina com qualquer look. Acabamento premium.",
      preco: 119.90,
      imagens: [IMAGENS_CANELADO[3], IMAGENS_CANELADO[4]],
      colecoes: ["canelado"],
      material: "95% Algodão, 5% Elastano",
      destaque: false,
    },
    {
      nome: "Short Canelado Rosa",
      slug: "short-canelado-rosa",
      descricao: "Short canelado em rosa candy, cintura alta e modelagem confortável. Para treinos e looks casuais cheios de personalidade.",
      preco: 99.90,
      precoPromo: 79.90,
      imagens: [IMAGENS_CANELADO[4], IMAGENS_CANELADO[5]],
      colecoes: ["canelado"],
      material: "90% Poliamida, 10% Elastano",
      destaque: false,
    },
    {
      nome: "Conjunto Canelado Rosé",
      slug: "conjunto-canelado-rose",
      descricao: "Conjunto top + calça canelado em rosé. Tecido de altíssima qualidade com toque suave e caimento perfeito.",
      preco: 229.90,
      imagens: [IMAGENS_CANELADO[5], IMAGENS_CANELADO[0]],
      colecoes: ["canelado"],
      material: "92% Viscose, 8% Elastano",
      destaque: true,
    },
  ];

  // === PRODUTOS BASICS ===
  const produtosBasics = [
    {
      nome: "T-Shirt Essential Preta",
      slug: "tshirt-essential-preta",
      descricao: "A t-shirt essencial que todo guarda-roupa feminino precisa. Algodão premium, caimento perfeito e durabilidade garantida.",
      preco: 79.90,
      imagens: [IMAGENS_BASICS[0], IMAGENS_BASICS[1]],
      colecoes: ["basics"],
      material: "100% Algodão 30.1",
      destaque: false,
    },
    {
      nome: "Calça Wide Leg Bege",
      slug: "calca-wide-leg-bege",
      descricao: "Calça wide leg em bege, a tendência que não sai de moda. Cintura alta, modelagem fluida e elegante para qualquer ocasião.",
      preco: 179.90,
      precoPromo: 149.90,
      imagens: [IMAGENS_BASICS[1], IMAGENS_BASICS[2]],
      colecoes: ["basics"],
      material: "100% Linho",
      destaque: true,
    },
    {
      nome: "Vestido Midi Branco",
      slug: "vestido-midi-branco",
      descricao: "Vestido midi branco com detalhe em renda no decote. Elegância e delicadeza para looks especiais e do dia a dia.",
      preco: 219.90,
      imagens: [IMAGENS_BASICS[2], IMAGENS_BASICS[3]],
      colecoes: ["basics"],
      material: "95% Viscose, 5% Elastano",
      destaque: true,
    },
    {
      nome: "Blazer Oversized Creme",
      slug: "blazer-oversized-creme",
      descricao: "Blazer oversized em tom creme, peça coringa para looks sofisticados. Perfeito para trabalho e eventos.",
      preco: 299.90,
      precoPromo: 249.90,
      imagens: [IMAGENS_BASICS[3], IMAGENS_BASICS[4]],
      colecoes: ["basics"],
      material: "60% Poliéster, 40% Viscose",
      destaque: true,
    },
    {
      nome: "Shorts Jeans Vintage",
      slug: "shorts-jeans-vintage",
      descricao: "Shorts jeans com lavagem vintage, barra desfiada. Peça casual e despojada para looks de verão com muito estilo.",
      preco: 119.90,
      imagens: [IMAGENS_BASICS[4], IMAGENS_BASICS[5]],
      colecoes: ["basics"],
      material: "100% Algodão",
      destaque: false,
    },
    {
      nome: "Blusa Cropped Linho",
      slug: "blusa-cropped-linho",
      descricao: "Blusa cropped em linho natural, leveza e sofisticação. Acabamento artesanal com bordado exclusivo Nervura Brasil.",
      preco: 139.90,
      imagens: [IMAGENS_BASICS[5], IMAGENS_BASICS[0]],
      colecoes: ["basics"],
      material: "100% Linho",
      destaque: false,
    },
  ];

  // Criar todos os produtos
  for (const p of [...produtosCopa, ...produtosCanelado, ...produtosBasics]) {
    const cores = p.colecoes.includes("copa-2026") ? ["Verde", "Amarelo", "Branco"] : CORES;
    await prisma.produto.create({
      data: {
        ...p,
        precoPromo: p.precoPromo ?? null,
        variacoes: { create: gerarVariacoes(cores) },
      },
    });
  }

  // === CUPONS ===
  await prisma.cupom.createMany({
    data: [
      {
        codigo: "COPA10",
        tipo: "percentual",
        valor: 10,
        maxUsos: 500,
        ativo: true,
      },
      {
        codigo: "NERVURA20",
        tipo: "fixo",
        valor: 20,
        minPedido: 150,
        maxUsos: 200,
        ativo: true,
      },
      {
        codigo: "PRIMEIRACOMPRA",
        tipo: "percentual",
        valor: 15,
        maxUsos: 1000,
        ativo: true,
      },
    ],
  });

  // === CONFIGURAÇÃO ===
  await prisma.configuracao.create({
    data: {
      id: "config",
      whatsappNumero: process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5541999999999",
      tikTokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
      instagramUrl: "https://instagram.com/nervurabrasil",
      tiktokUrl: "https://tiktok.com/@nervurabrasil",
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log("   • 16 produtos criados (Copa 2026, Canelado, Basics)");
  console.log("   • 3 cupons criados (COPA10, NERVURA20, PRIMEIRACOMPRA)");
  console.log("   • Configuração inicial criada");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
