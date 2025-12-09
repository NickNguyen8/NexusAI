import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

// In a real production environment with NestJS:
// This service would fetch from `https://api.yourdomain.com/v1/chat/completions`
// The NestJS backend would hold the API_KEY and handle the GoogleGenAI call.
// For this frontend-only demo, we call Gemini directly.

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Please set the API_KEY env variable.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const streamResponse = async (
  history: Message[],
  newMessage: string,
  systemInstruction: string,
  onChunk: (text: string) => void,
  onComplete: () => void
) => {
  try {
    const ai = getClient();
    
    // Transform history for Gemini
    // Note: Gemini 2.5 Flash is efficient and powerful
    const model = 'gemini-2.5-flash';

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
    
    onComplete();
  } catch (error) {
    console.error("Error calling AI Service:", error);
    onChunk("\n\n**Error:** Unable to connect to the AI service. Please check your API key or network connection.");
    onComplete();
  }
};
