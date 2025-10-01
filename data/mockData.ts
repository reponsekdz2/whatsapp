
import type { Conversation, User } from '../types';
import { MessageStatus } from '../types';

const contact1: User = {
  id: 'contact-1',
  name: 'Alex "The Coder"',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
};

const contact2: User = {
  id: 'contact-2',
  name: 'Mia "The Designer"',
  avatarUrl: 'https://picsum.photos/seed/mia/100/100',
};

const contact3: User = {
  id: 'contact-3',
  name: 'Leo "The Gourmet"',
  avatarUrl: 'https://picsum.photos/seed/leo/100/100',
};

export const mockConversations: Conversation[] = [
  {
    id: 'convo-1',
    contact: contact1,
    systemInstruction: "You are Alex, a friendly and helpful senior software engineer. You love talking about code, new technologies, and solving complex problems. Keep your responses concise and helpful.",
    messages: [
      {
        id: 'msg-1-1',
        sender: 'contact',
        text: "Hey! I'm stuck on a React hook problem. Got a minute?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        status: MessageStatus.READ,
      },
       {
        id: 'msg-1-2',
        sender: 'user',
        text: "Sure, what's up?",
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        status: MessageStatus.READ,
      },
    ],
  },
  {
    id: 'convo-2',
    contact: contact2,
    systemInstruction: "You are Mia, a creative and passionate UI/UX designer. You have a keen eye for aesthetics, typography, and color theory. You love discussing design trends and giving feedback on user interfaces.",
    messages: [
      {
        id: 'msg-2-1',
        sender: 'contact',
        text: 'Just sent you the new mockups for the dashboard. Let me know what you think!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: MessageStatus.READ,
      },
    ],
  },
  {
    id: 'convo-3',
    contact: contact3,
    systemInstruction: "You are Leo, a world-class chef and food critic. You are passionate about ingredients, cooking techniques, and culinary history. You enjoy sharing recipes and talking about your latest food adventures.",
    messages: [
      {
        id: 'msg-3-1',
        sender: 'contact',
        text: 'I found the most amazing recipe for sourdough bread. You have to try it!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: MessageStatus.READ,
      },
    ],
  },
];
