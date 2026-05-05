import "server-only";
import { getServerEnv, hasGeminiKey } from "./env.server";


/**
 * Server-only Gemini client.
 *
 * BFF principle: The browser NEVER sees GEMINI_API_KEY.
 * This module is only imported from /app/api/* route handlers.
 */

const GEMINI_FLASH_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// gemini-embedding-001: 3072 dims (as of 2025)
const GEMINI_EMBED_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

export interface GeminiCallOptions {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  maxOutputTokens?: number;
}

export interface GeminiResult {
  text: string;
  latencyMs: number;
  isMock: boolean;
}

/**
 * Generate a 768-dimensional embedding using Google text-embedding-004.
 * Returns null (not throws) when API key is missing — callers should fallback to keyword search.
 */
export async function embedText(text: string): Promise<number[] | null> {
  if (!hasGeminiKey()) return null;
  const { GEMINI_API_KEY } = getServerEnv();

  try {
    const res = await fetch(`${GEMINI_EMBED_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text: text.slice(0, 2048) }] },
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    type EmbedResp = { embedding?: { values?: number[] } };
    const json = (await res.json()) as EmbedResp;
    return json.embedding?.values ?? null;
  } catch {
    return null;
  }
}

export async function callGemini(opts: GeminiCallOptions): Promise<GeminiResult> {
  const start = Date.now();

  if (!hasGeminiKey()) {
    // Graceful fallback to a canned response so demo works without API key.
    return {
      text: opts.jsonMode ? JSON.stringify({ mock: true, prompt: opts.userPrompt }) : `[mock response — set GEMINI_API_KEY for live AI]\n\nQuery: "${opts.userPrompt}"\n\nThailandGPT would now consult its verified supplier knowledge base, identify high-confidence matches, surface the relevant local intelligence, and return structured answers along with citations.`,
      latencyMs: 12,
      isMock: true,
    };
  }

  const { GEMINI_API_KEY } = getServerEnv();

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: opts.userPrompt }],
      },
    ],
    systemInstruction: {
      role: "system",
      parts: [{ text: opts.systemPrompt }],
    },
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: opts.maxOutputTokens ?? 2048,
      ...(opts.jsonMode && { responseMimeType: "application/json" }),
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  const res = await fetch(`${GEMINI_FLASH_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    // Avoid leaking the key into logs
    throw new Error(`Gemini API error ${res.status}: ${errBody.slice(0, 200)}`);
  }

  type GeminiResp = {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const json = (await res.json()) as GeminiResp;
  const text =
    json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

  return {
    text,
    latencyMs: Date.now() - start,
    isMock: false,
  };
}
