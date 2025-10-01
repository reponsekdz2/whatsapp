import React from 'react';
import type { Conversation } from '../types';
import { ConversationListItem } from './ConversationListItem';

interface SidebarProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  activeConversationId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
  activeConversationId,
}) => {
  const lastMessage = (convo: Conversation) => {
    return convo.messages[convo.messages.length - 1];
  };

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-[#111B21] border-r border-[#222E35] flex flex-col">
      <header className="p-4 py-3 bg-[#202C33] flex-shrink-0">
        <h1 className="text-xl font-semibold text-[#E9EDEF]">Gemini Chat</h1>
      </header>
      <div className="flex-grow overflow-y-auto">
        {conversations.map(convo => (
          <ConversationListItem
            key={convo.id}
            contactName={convo.contact.name}
            contactAvatarUrl={convo.contact.avatarUrl}
            lastMessage={lastMessage(convo)?.text || 'No messages yet'}
            lastMessageTimestamp={lastMessage(convo)?.timestamp}
            isActive={convo.id === activeConversationId}
            onClick={() => onSelectConversation(convo.id)}
          />
        ))}
      </div>
    </aside>
  );
};
