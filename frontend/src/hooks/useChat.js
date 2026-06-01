import { useState, useCallback } from "react";
const API_URL = import.meta.env.VITE_API_URL || "";

export function useChat(toolId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const resetChat = useCallback(() => { setMessages([]); setHistory([]); }, []);

  const sendMessage = useCallback(async ({ text, pdfFile }) => {
    if (!text && !pdfFile) return;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", text, fileName: pdfFile?.name }]);
    try {
      const formData = new FormData();
      formData.append("toolId", toolId);
      if (text) formData.append("message", text);
      if (pdfFile) formData.append("pdf", pdfFile);
      formData.append("history", JSON.stringify(history));

      const res = await fetch(`${API_URL}/api/chat`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || "Request failed");
      }
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply, sources: data.sources || [] }]);
      setHistory(prev => [
        ...prev,
        { role: "user", content: text || "(PDF document)" },
        { role: "model", content: data.reply },
      ]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "error", text: err.message }]);
    } finally {
      setIsLoading(false);
    }
  }, [toolId, history]);

  return { messages, isLoading, sendMessage, resetChat };
}
