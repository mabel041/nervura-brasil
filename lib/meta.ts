import crypto from "crypto";

interface MetaBrowserData {
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
}

interface MetaItem {
  id: string;
  quantity: number;
  item_price: number;
}

interface MetaUserDataInput {
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

interface SendMetaEventInput {
  pixelId?: string | null;
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userData: MetaUserDataInput;
  customData?: Record<string, unknown>;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeString(value?: string | null) {
  if (!value) return undefined;
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeDigits(value?: string | null) {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits || undefined;
}

function normalizePhone(value?: string | null) {
  const digits = normalizeDigits(value);
  if (!digits) return undefined;

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

function normalizeCountry(value?: string | null) {
  const normalized = normalizeString(value);
  return normalized || "br";
}

function buildUserData(input: MetaUserDataInput) {
  const userData: Record<string, unknown> = {};

  const email = normalizeString(input.email);
  const phone = normalizePhone(input.phone);
  const cpf = normalizeDigits(input.cpf);
  const city = normalizeString(input.city);
  const state = normalizeString(input.state);
  const zip = normalizeDigits(input.zip);
  const country = normalizeCountry(input.country);
  const externalId = normalizeString(input.externalId);

  if (email) userData.em = [sha256(email)];
  if (phone) userData.ph = [sha256(phone)];
  if (cpf) userData.external_id = [sha256(cpf)];
  if (city) userData.ct = [sha256(city)];
  if (state) userData.st = [sha256(state)];
  if (zip) userData.zp = [sha256(zip)];
  if (country) userData.country = [sha256(country)];
  if (externalId) userData.external_id = [...((userData.external_id as string[]) ?? []), sha256(externalId)];

  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  return userData;
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (!forwardedFor) return undefined;
  return forwardedFor.split(",")[0]?.trim();
}

export function getBrowserDataFromBody(value: unknown): MetaBrowserData | undefined {
  if (!value || typeof value !== "object") return undefined;

  const browserData = value as MetaBrowserData;
  return {
    eventSourceUrl: browserData.eventSourceUrl,
    fbp: browserData.fbp,
    fbc: browserData.fbc,
  };
}

export function mapItemsToMetaContents<
  T extends { produtoId?: string | null; id?: string | null; quantidade?: number | null; item_price?: number | null; preco?: number | null; precoUnit?: number | null }
>(items: T[]): MetaItem[] {
  return items.map((item) => ({
    id: item.produtoId ?? item.id ?? "",
    quantity: item.quantidade ?? 1,
    item_price: item.item_price ?? item.preco ?? item.precoUnit ?? 0,
  }));
}

export async function sendMetaEvent({
  pixelId,
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: SendMetaEventInput) {
  const accessToken =
    process.env.META_CONVERSIONS_API_ACCESS_TOKEN ||
    process.env.FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return { ok: false, skipped: true };
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: eventId,
        event_source_url: eventSourceUrl,
        user_data: buildUserData(userData),
        custom_data: customData,
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao enviar evento para Meta CAPI:", errorText);
  }

  return { ok: response.ok, skipped: false };
}
