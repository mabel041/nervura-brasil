import { z } from "zod";

export const checkoutSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^[\d\s()\-+]+$/, "Telefone inválido"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(14, "CPF inválido")
    .regex(/^[\d.\-]+$/, "CPF inválido"),
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  rua: z.string().min(3, "Rua obrigatória"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "Estado deve ser 2 letras"),
  formaPagamento: z.enum(["pix", "cartao"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const produtoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório"),
  descricao: z.string().min(10, "Descrição obrigatória"),
  preco: z.number().positive("Preço deve ser positivo"),
  precoPromo: z.number().positive("Preço promocional deve ser positivo").optional().nullable(),
  colecoes: z.array(z.enum(["copa-2026", "canelado", "basics"])).min(1, "Selecione ao menos uma coleção"),
  material: z.string().optional(),
  destaque: z.boolean().default(false),
  ativo: z.boolean().default(true),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

export const cupomSchema = z.object({
  codigo: z.string().min(3, "Código obrigatório").toUpperCase(),
  tipo: z.enum(["percentual", "fixo"]),
  valor: z.number().positive("Valor deve ser positivo"),
  minPedido: z.number().positive().optional().nullable(),
  maxUsos: z.number().int().positive().optional().nullable(),
  expiraEm: z.string().optional().nullable(),
  ativo: z.boolean().default(true),
});

export type CupomFormData = z.infer<typeof cupomSchema>;

export const configuracaoSchema = z.object({
  tikTokPixelId: z.string().optional(),
  metaPixelId: z.string().optional(),
  whatsappNumero: z.string().optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  crmApiKey: z.string().optional(),
  crmTipo: z.enum(["rdstation", "hubspot"]).optional().nullable(),
  emailRemetente: z.string().email().optional().or(z.literal("")),
});
