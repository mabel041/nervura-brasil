import type { Metadata } from "next";
import { CheckoutForm } from "@/components/loja/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-nervura-creme py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl text-nervura-texto-principal mb-2 text-center">
          Finalizar Compra
        </h1>
        <p className="text-center text-nervura-texto-muted text-sm mb-8">
          Pagamento 100% seguro — Mercado Pago
        </p>
        <CheckoutForm />
      </div>
    </div>
  );
}
