"use client";

import { useEffect } from "react";

import { trackEvent } from "@/components/PixelProvider";

interface PurchaseItem {
  id: string;
  quantity: number;
  item_price: number;
}

interface Props {
  orderNumber: string;
  value: number;
  items: PurchaseItem[];
}

export function MetaPurchaseTracker({ orderNumber, value, items }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const eventId = `purchase:${orderNumber}`;
    const storageKey = `meta_purchase_sent:${eventId}`;
    if (window.localStorage.getItem(storageKey)) return;

    window.localStorage.setItem(storageKey, "1");
    trackEvent(
      "Purchase",
      {
        content_ids: items.map((item) => item.id),
        contents: items,
        content_type: "product",
        currency: "BRL",
        num_items: items.reduce((acc, item) => acc + item.quantity, 0),
        order_id: orderNumber,
        value,
      },
      { eventId }
    );
  }, [items, orderNumber, value]);

  return null;
}
