import { useState, useCallback } from 'react';
import { getChatSession, generateReplySuggestions } from '../services/geminiService';
import type { Message, Conversation } from '../types';
import { MessageStatus } from '../types';

export const useChat = (
  conversation: Conversation,
  onNewMessage: (conversationId: string, message: Message) => void
) => {
  const [isResponding, setIsResponding] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const sendMessage = useCallback(async (
    text: string,
    options?: {
      image?: { data: string; mimeType: string };
      audio?: { url: string; };
    }
  ) => {
    clearSuggestions();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString(),
      status: MessageStatus.SENDING,
      imageUrl: options?.image ? `data:${options.image.mimeType};base64,${options.image.data}` : undefined,
      audioUrl: options?.audio?.url,
    };
    onNewMessage(conversation.id, userMessage);
    setIsResponding(true);

    const chatSession = getChatSession(conversation.id, conversation.systemInstruction);

    const aiMessagePlaceholder: Message = {
        id: `ai-${Date.now()}`,
        sender: 'contact',
        text: '...',
        timestamp: new Date().toISOString(),
        status: MessageStatus.SENDING,
    };
    onNewMessage(conversation.id, aiMessagePlaceholder);

    try {
      const parts = options?.image
        ? [{ inlineData: { data: options.image.data, mimeType: options.image.mimeType } }, { text }]
        : [{ text }];

      const stream = await chatSession.sendMessageStream({
        message: { parts }
      });

      let fullResponse = '';
      
      // FIX: Refactored streaming logic to update a single message object instead of creating new ones, providing a smoother UI experience.
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        const streamedMessageUpdate: Message = {
          ...aiMessagePlaceholder,
          text: fullResponse + '▌',
        };
        onNewMessage(conversation.id, streamedMessageUpdate); 
      }
      
      const finalAiMessage: Message = {
        ...aiMessagePlaceholder,
        text: fullResponse,
        status: MessageStatus.SENT,
        timestamp: new Date().toISOString(),
      };
      onNewMessage(conversation.id, finalAiMessage);

      // Generate suggestions after getting the final response
      if(fullResponse) {
          const newSuggestions = await generateReplySuggestions(fullResponse);
          setSuggestions(newSuggestions);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        // FIX: Re-use the placeholder message ID to replace it with an error message in the UI.
        id: aiMessagePlaceholder.id,
        sender: 'contact',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        status: MessageStatus.ERROR,
      };
      onNewMessage(conversation.id, errorMessage);
    } finally {
      setIsResponding(false);
    }
  }, [conversation.id, conversation.systemInstruction, onNewMessage, clearSuggestions]);

  return { isResponding, sendMessage, suggestions, clearSuggestions };
};
