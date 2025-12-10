import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

// --- Configuration ---
// Set this to TRUE to attempt connecting to your local NestJS backend
const USE_NESTJS_BACKEND = false; 
const NESTJS_BACKEND_URL = 'http://localhost:3000/api/chat/stream';

// Define the DTO (Data Transfer Object) expected by the NestJS Controller
interface ChatDto {
  messages: { role: string; content: string }[];
  model: string;
  systemInstruction?: string;
  appId?: string; // Added appId so backend knows which Agent is active
}

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Please set the API_KEY env variable.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Connects to a NestJS Backend.
 * Assumes a NestJS Controller with a POST endpoint that streams Server-Sent Events (SSE) or raw text.
 */
const streamFromNestJS = async (
  history: Message[],
  newMessage: string,
  systemInstruction: string,
  appId: string,
  onChunk: (text: string) => void,
  onComplete: () => void
) => {
  try {
    const payload: ChatDto = {
      model: 'gemini-2.5-flash',
      systemInstruction,
      appId, // Identify the agent
      messages: [
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: newMessage }
      ]
    };

    console.log(`Connecting to NestJS Backend [${appId}]:`, NESTJS_BACKEND_URL);

    const response = await fetch(NESTJS_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
       throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
    }

    if (!response.body) throw new Error("No response body from backend");

    // Handle Streaming Response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      onChunk(text);
    }
    onComplete();

  } catch (error) {
    console.error("NestJS Backend Error:", error);
    onChunk(`\n\n**System Alert:** Could not connect to NestJS backend at ${NESTJS_BACKEND_URL}. \nReason: ${error instanceof Error ? error.message : 'Unknown Error'}.\n\nFalling back to client-side mode for this demo.`);
    
    // Optional: Failover to Client Side if backend is down
    console.log("Falling back to client-side Gemini...");
    await streamFromGeminiClient(history, newMessage, systemInstruction, onChunk, onComplete);
  }
};

/**
 * Direct Client-Side Gemini Implementation
 */
const streamFromGeminiClient = async (
  history: Message[],
  newMessage: string,
  systemInstruction: string,
  onChunk: (text: string) => void,
  onComplete: () => void
) => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';

    // IMPORTANT: History should only contain previous messages.
    // The current `newMessage` is passed separately to `sendMessageStream`.
    // Ensure history is mapped correctly to valid turns (User <-> Model).
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
    if (error instanceof Error) {
        console.error("Error Details:", error.message);
        if (error.message.includes("400")) {
            console.error("This is often caused by invalid chat history (e.g. two User messages in a row).");
        }
    }
    onChunk("\n\n**Error:** Unable to connect to the AI service. Please check your API key or network connection.");
    onComplete();
  }
};

export const streamResponse = async (
  history: Message[],
  newMessage: string,
  systemInstruction: string,
  appId: string,
  onChunk: (text: string) => void,
  onComplete: () => void
) => {
  // If NestJS is configured, try it first
  if (USE_NESTJS_BACKEND) {
    await streamFromNestJS(history, newMessage, systemInstruction, appId, onChunk, onComplete);
  } else {
    // Default to client-side for demo purposes
    await streamFromGeminiClient(history, newMessage, systemInstruction, onChunk, onComplete);
  }
};