const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in .env");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  tools: [{ googleSearch: {} }],
  generationConfig: { maxOutputTokens: 2048, temperature: 0.2 },
});

async function generateResponse({ systemPrompt, userMessage, pdfPart, history }) {
  const currentParts = [];
  if (pdfPart) currentParts.push(pdfPart);
  currentParts.push({ text: userMessage || "Analyse this document using your full framework." });

  const contents = [];
  for (const turn of history) {
    contents.push({ role: turn.role, parts: [{ text: turn.content }] });
  }
  contents.push({ role: "user", parts: currentParts });

  const result = await model.generateContent({ systemInstruction: systemPrompt, contents });
  const candidate = result.response.candidates?.[0];
  const text = candidate?.content?.parts?.filter(p => p.text).map(p => p.text).join("") || "";

  const sources = [];
  const seen = new Set();
  for (const chunk of candidate?.groundingMetadata?.groundingChunks || []) {
    if (chunk.web?.uri && !seen.has(chunk.web.uri)) {
      seen.add(chunk.web.uri);
      sources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
    }
  }
  return { text, sources };
}
module.exports = { generateResponse };
