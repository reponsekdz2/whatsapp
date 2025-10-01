import { GoogleGenAI, Type } from "@google/genai";
import type { Chat } from "@google/genai";

// FIX: Per guidelines, API key must be from process.env.API_KEY exclusively. Removed fallback and conditional warning.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const chatSessions = new Map<string, Chat>();

export function getChatSession(conversationId: string, systemInstruction: string): Chat {
  if (chatSessions.has(conversationId)) {
    return chatSessions.get(conversationId)!;
  }

  const newChat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction,
    }
  });

  chatSessions.set(conversationId, newChat);
  return newChat;
}

export async function generateReplySuggestions(message: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following message, generate three short, relevant, and natural-sounding reply suggestions. The message is: "${message}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    });
    const json = JSON.parse(response.text);
    return json.suggestions || [];
  } catch (error) {
    console.error("Error generating reply suggestions:", error);
    return [];
  }
}

// Utility to convert a File object to a base64 string
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the "data:mime/type;base64," prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};
