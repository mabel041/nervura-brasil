import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  console.warn("MP_ACCESS_TOKEN não configurado");
}

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? "",
  options: { timeout: 5000 },
});

export const payment = new Payment(mp);
export const preference = new Preference(mp);
