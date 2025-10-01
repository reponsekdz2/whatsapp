import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { WelcomeScreen } from './components/WelcomeScreen';
import type { Conversation } from './types';
import { mockConversations } from './data/mockData';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  // FIX: Updated message handler to support updating messages in-place, which is necessary for streaming responses.
  const handleNewMessage = (conversationId: string, message: import('./types').Message) => {
    setConversations(prev =>
      prev.map(convo => {
        if (convo.id !== conversationId) {
          return convo;
        }

        const messageIndex = convo.messages.findIndex(m => m.id === message.id);
        let newMessages;
        if (messageIndex !== -1) {
          // Update existing message for streaming
          newMessages = [...convo.messages];
          newMessages[messageIndex] = message;
        } else {
          // Add new message
          newMessages = [...convo.messages, message];
        }
        
        return {
          ...convo,
          messages: newMessages,
        };

      }).sort((a, b) => {
        const lastMsgA = a.messages[a.messages.length - 1];
        const lastMsgB = b.messages[b.messages.length - 1];
        if (!lastMsgA || !lastMsgB) return 0;
        return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
      })
    );
  };
  
  return (
    <div className="h-screen w-screen bg-[#111B21] text-[#E9EDEF] flex antialiased overflow-hidden">
      <div className="h-full w-full flex">
        <Sidebar
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversationId}
        />
        <main className="flex-1 h-full flex flex-col bg-[#0b141a]">
          {activeConversation ? (
            <ChatWindow
              key={activeConversation.id}
              conversation={activeConversation}
              onNewMessage={handleNewMessage}
            />
          ) : (
            <WelcomeScreen />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
