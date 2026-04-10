import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXTENSOES_PERMITIDAS = ["jpg", "jpeg", "png", "webp", "gif"];
const TAMANHO_MAX = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
  }

  // Validar tamanho
  if (file.size > TAMANHO_MAX) {
    return NextResponse.json({ error: "Arquivo muito grande. Máximo 10MB." }, { status: 400 });
  }

  // Validar extensão (do nome do arquivo)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSOES_PERMITIDAS.includes(ext)) {
    return NextResponse.json({ error: "Formato inválido. Use JPG, PNG, WEBP ou GIF." }, { status: 400 });
  }

  // Validar MIME pelo conteúdo real do arquivo (magic bytes)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mimeReal = detectarMime(buffer);

  if (!mimeReal || !TIPOS_PERMITIDOS.includes(mimeReal)) {
    return NextResponse.json({ error: "Arquivo inválido. Somente imagens são permitidas." }, { status: 400 });
  }

  const filename = `produtos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("produtos")
    .upload(filename, buffer, {
      contentType: mimeReal, // usa MIME detectado, não o enviado pelo cliente
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage
    .from("produtos")
    .getPublicUrl(filename);

  return NextResponse.json({ url: data.publicUrl });
}

// Detecção de MIME por magic bytes (sem depender do client)
function detectarMime(buffer: Buffer): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return "image/gif";
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return "image/webp";
  return null;
}
