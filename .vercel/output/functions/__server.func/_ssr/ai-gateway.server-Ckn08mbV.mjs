const BASE_URL = "https://ai.gateway.lovable.dev/v1";
async function callLovableAI(opts) {
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
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-3.5-flash",
      messages: opts.messages,
      ...opts.response_format ? { response_format: opts.response_format } : {}
    })
  });
  if (res.status === 429) throw new Error("Lovable AI sedang sibuk (rate limit). Coba lagi sebentar.");
  if (res.status === 402) throw new Error("Kredit Lovable AI habis. Tambahkan kredit di Settings.");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
async function callDirectGemini(apiKey, opts) {
  let modelName = opts.model ? opts.model.replace(/^google\//, "") : "gemini-3.1-flash-lite";
  if (modelName === "gemini-3.5-flash" || modelName === "gemini-2.5-flash" || modelName === "gemini-2.0-flash") {
    modelName = "gemini-3.1-flash-lite";
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const systemMsg = opts.messages.find((m) => m.role === "system");
  const systemInstruction = systemMsg ? { parts: [{ text: typeof systemMsg.content === "string" ? systemMsg.content : "" }] } : void 0;
  const contents = await Promise.all(
    opts.messages.filter((m) => m.role !== "system").map(async (m) => {
      const role = m.role === "assistant" ? "model" : "user";
      const parts = [];
      if (typeof m.content === "string") {
        parts.push({ text: m.content });
      } else if (Array.isArray(m.content)) {
        for (const part of m.content) {
          if (part.type === "text") {
            parts.push({ text: part.text });
          } else if (part.type === "image_url") {
            try {
              const response = await fetch(part.image_url.url);
              if (!response.ok) {
                throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
              }
              const contentType = response.headers.get("content-type") || "image/jpeg";
              const arrayBuffer = await response.arrayBuffer();
              const base64Data = Buffer.from(arrayBuffer).toString("base64");
              parts.push({
                inlineData: {
                  mimeType: contentType,
                  data: base64Data
                }
              });
            } catch (fetchErr) {
              console.error("Error fetching image for Gemini:", fetchErr);
              throw fetchErr;
            }
          }
        }
      }
      return {
        role,
        parts
      };
    })
  );
  const body = {
    contents,
    ...systemInstruction ? { systemInstruction } : {}
  };
  if (opts.response_format?.type === "json_object") {
    body.generationConfig = {
      responseMimeType: "application/json"
    };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return textResult ?? "";
}
function extractJSON(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}
export {
  callLovableAI,
  extractJSON
};
