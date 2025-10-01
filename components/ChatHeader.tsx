import React from 'react';
import type { User } from '../types';

interface ChatHeaderProps {
  contact: User;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <header className="flex items-center p-3 border-b border-[#222E35] bg-[#202C33] flex-shrink-0">
      <img
        src={contact.avatarUrl}
        alt={contact.name}
        className="w-10 h-10 rounded-full mr-4 object-cover"
      />
      <div>
        <p className="text-lg font-semibold text-white">{contact.name}</p>
        <p className="text-sm text-[#00A884]">Online</p>
      </div>
    </header>
  );
};
