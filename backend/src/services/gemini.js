const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not set in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  tools: [{ googleSearch: {} }],
  generationConfig: { maxOutputTokens: 2048, temperature: 0.2 },
});

async function generateResponse({ systemPrompt, userMessage, pdfPart, history }) {
  const currentParts = [];
  if (pdfPart) {
    currentParts.push(pdfPart);
  }

  if (userMessage || !pdfPart) {
    currentParts.push({ text: userMessage || "Analyse this document using your full framework." });
  }

  const contents = [];
  if (history && Array.isArray(history)) {
    for (const turn of history) {
      contents.push({
        role: turn.role === "assistant" ? "model" : turn.role,
        parts: [{ text: turn.content }]
      });
    }
  }

  contents.push({ role: "user", parts: currentParts });

  const result = await model.generateContent({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents
  });

  const text = result.response.text();
  const candidate = result.response.candidates?.[0];

  const sources = [];
  const seen = new Set();

  if (candidate?.groundingMetadata?.groundingChunks) {
    for (const chunk of candidate.groundingMetadata.groundingChunks) {
      if (chunk.web?.uri && !seen.has(chunk.web.uri)) {
        seen.add(chunk.web.uri);
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri
        });
      }
    }
  }

  return { text, sources };
}

module.exports = { generateResponse };
