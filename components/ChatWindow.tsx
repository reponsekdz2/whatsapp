import React from 'react';
import type { Conversation, Message } from '../types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';
import { ReplySuggestions } from './ReplySuggestions';

interface ChatWindowProps {
  conversation: Conversation;
  onNewMessage: (conversationId: string, message: Message) => void;
}

// FIX: Simplified component by removing local state management for messages. It now relies on the `conversation` prop as the single source of truth, which is updated by the parent `App` component. This resolves UI inconsistencies during message streaming.
export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onNewMessage }) => {
  const { isResponding, sendMessage, suggestions, clearSuggestions } = useChat(conversation, onNewMessage);

  const handleSendSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
    clearSuggestions();
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#0b141a]">
      <div className="absolute top-0 left-0 w-full h-full whatsapp-bg-pattern z-0"></div>
      <div className="relative z-10 flex-1 flex flex-col h-full">
        <ChatHeader contact={conversation.contact} />
        <MessageList messages={conversation.messages} isResponding={isResponding} contactAvatarUrl={conversation.contact.avatarUrl}/>
        <div className='flex flex-col'>
            {suggestions.length > 0 && (
                <ReplySuggestions suggestions={suggestions} onSelectSuggestion={handleSendSuggestion} />
            )}
            <ChatInput onSendMessage={sendMessage} isResponding={isResponding} />
        </div>
      </div>
    </div>
  );
};
