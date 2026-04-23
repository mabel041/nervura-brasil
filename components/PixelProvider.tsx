"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ttq?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

interface PixelEventOptions {
  eventId?: string;
}

interface BrowserMetaData {
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function ensureMetaClickCookie() {
  if (typeof window === "undefined" || typeof document === "undefined") return undefined;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return getCookie("_fbc");

  const existing = getCookie("_fbc");
  if (existing) return existing;

  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  document.cookie = `_fbc=${encodeURIComponent(fbc)}; path=/; max-age=7776000; SameSite=Lax`;
  return fbc;
}

export function createMetaEventId(prefix: string) {
  return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
}

export function getMetaBrowserData(): BrowserMetaData {
  if (typeof window === "undefined") return {};

  return {
    eventSourceUrl: window.location.href,
    fbp: getCookie("_fbp"),
    fbc: ensureMetaClickCookie(),
  };
}

export function trackEvent(
  event: string,
  data?: Record<string, unknown>,
  options?: PixelEventOptions
) {
  if (typeof window !== "undefined" && window.fbq) {
    if (options?.eventId) {
      window.fbq("track", event, data, { eventID: options.eventId });
    } else {
      window.fbq("track", event, data);
    }
  }

  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, data);
  }
}

export function PixelProvider({
  metaPixelId,
  tiktokPixelId,
  googleAnalyticsId,
  googleAdsId,
}: {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleAnalyticsId?: string | null;
  googleAdsId?: string | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstPageViewRef = useRef(true);

  useEffect(() => {
    ensureMetaClickCookie();

    const gaId = googleAnalyticsId;
    const adsId = googleAdsId;
    if ((gaId || adsId) && !window.gtag) {
      const trackingId = gaId || adsId!;
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(gtagScript);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        ${gaId ? `gtag('config', '${gaId}');` : ""}
        ${adsId ? `gtag('config', '${adsId}');` : ""}
      `;
      document.head.appendChild(inlineScript);
    }

    if (metaPixelId && !window.fbq) {
      const script = document.createElement("script");
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    if (tiktokPixelId && !window.ttq) {
      const script = document.createElement("script");
      script.innerHTML = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      document.head.appendChild(script);
    }
  }, [metaPixelId, tiktokPixelId, googleAnalyticsId, googleAdsId]);

  useEffect(() => {
    if (firstPageViewRef.current) {
      firstPageViewRef.current = false;
      return;
    }

    trackEvent("PageView");
  }, [pathname, searchParams]);

  return null;
}
