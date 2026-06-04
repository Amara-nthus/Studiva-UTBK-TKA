// Minimal Lovable AI Gateway client (no external SDK dependency).
const BASE_URL = "https://ai.gateway.lovable.dev/v1";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
}

export async function callLovableAI(opts: {
  model?: string;
  messages: ChatMessage[];
  response_format?: { type: "json_object" };
}): Promise<string> {
  const directKey = process.env.GEMINI_API_KEY;
  if (directKey) {
    return callDirectGemini(directKey, opts);
  }

  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY atau GEMINI_API_KEY tidak terkonfigurasi di file .env");
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-3.5-flash",
      messages: opts.messages,
      ...(opts.response_format ? { response_format: opts.response_format } : {}),
    }),
  });
  if (res.status === 429) throw new Error("Lovable AI sedang sibuk (rate limit). Coba lagi sebentar.");
  if (res.status === 402) throw new Error("Kredit Lovable AI habis. Tambahkan kredit di Settings.");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callDirectGemini(
  apiKey: string,
  opts: {
    model?: string;
    messages: ChatMessage[];
    response_format?: { type: "json_object" };
  }
): Promise<string> {
  // Map models correctly (use gemini-3.1-flash-lite as the stable/fallback model to avoid quota limits)
  let modelName = opts.model ? opts.model.replace(/^google\//, "") : "gemini-3.1-flash-lite";
  if (modelName === "gemini-3.5-flash" || modelName === "gemini-2.5-flash" || modelName === "gemini-2.0-flash") {
    modelName = "gemini-3.1-flash-lite";
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Extract system instruction
  const systemMsg = opts.messages.find((m) => m.role === "system");
  const systemInstruction = systemMsg
    ? { parts: [{ text: typeof systemMsg.content === "string" ? systemMsg.content : "" }] }
    : undefined;

  // Map messages to Gemini API format (role must be "user" or "model")
  const contents = opts.messages
    .filter((m) => m.role !== "system")
    .map((m) => {
      const role = m.role === "assistant" ? "model" : "user";
      let textContent = "";
      if (typeof m.content === "string") {
        textContent = m.content;
      } else if (Array.isArray(m.content)) {
        textContent = m.content
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("\n");
      }
      return {
        role,
        parts: [{ text: textContent }],
      };
    });

  const body: any = {
    contents,
    ...(systemInstruction ? { systemInstruction } : {}),
  };

  if (opts.response_format?.type === "json_object") {
    body.generationConfig = {
      responseMimeType: "application/json",
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return textResult ?? "";
}

export function extractJSON<T = unknown>(text: string): T {
  // models sometimes wrap with ```json ... ```
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned) as T;
}

