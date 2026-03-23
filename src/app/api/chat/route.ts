import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

const anthropic = new Anthropic();

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    : null;

function generaEmbeddingFallback(testo: string): number[] {
  const embedding = new Array(1536).fill(0);
  const parole = testo.toLowerCase().split(/\s+/);
  for (let i = 0; i < parole.length; i++) {
    const parola = parole[i];
    for (let j = 0; j < parola.length; j++) {
      const idx = (parola.charCodeAt(j) * (i + 1) * (j + 1)) % 1536;
      embedding[idx] += 1 / (i + 1);
    }
  }
  const mag = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1;
  return embedding.map((v) => v / mag);
}

async function cercaDocumenti(domanda: string): Promise<string> {
  if (!supabase) return "";
  try {
    const embedding = generaEmbeddingFallback(domanda);
    const { data, error } = await supabase.rpc("cerca_documenti", {
      query_embedding: embedding,
      match_count: 4,
    });
    if (error || !data || data.length === 0) return "";
    const contesti = data
      .filter((d: { similarity: number }) => d.similarity > 0.3)
      .map((d: { contenuto: string; fonte: string }) =>
        `[Fonte: ${d.fonte}]\n${d.contenuto}`
      )
      .join("\n\n---\n\n");
    return contesti;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const ultimaDomanda = messages[messages.length - 1]?.content || "";
    const contestoDocumenti = await cercaDocumenti(ultimaDomanda);

    const systemPromptCompleto = contestoDocumenti
      ? `${SYSTEM_PROMPT}\n\n━━━━━━━━━━━━━━━━━━━━━━\nDOCUMENTI DI RIFERIMENTO\n━━━━━━━━━━━━━━━━━━━━━━\nUsa queste informazioni aggiuntive per rispondere in modo più dettagliato:\n\n${contestoDocumenti}`
      : SYSTEM_PROMPT;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPromptCompleto,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
    }

    return NextResponse.json({ message: content.text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
