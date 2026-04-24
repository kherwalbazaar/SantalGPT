import { useState, useEffect } from 'react';

const CHATS_STORAGE_KEY = 'santalgpt_chats';

export default function useChatHistory() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Load chats from localStorage on mount
  useEffect(() => {
    try {
      const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats);
        
        // Remove duplicate chats by ID (keep first occurrence)
        const uniqueChats = parsedChats.filter((chat, index, self) =>
          index === self.findIndex((c) => c.id === chat.id)
        );
        
        setChats(uniqueChats);
        
        // Set current chat to the most recent one, or create new
        if (uniqueChats.length > 0) {
          setCurrentChatId(uniqueChats[0].id);
        } else {
          createNewChat();
        }
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      createNewChat();
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'ᱱᱟᱶᱟ ᱜᱟᱞᱢᱟᱨᱟᱣ', // "New Conversation" in Ol Chiki
      messages: [],
      createdAt: new Date().toISOString(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const addMessage = (role, content) => {
    setChats(prev => {
      const updatedChats = prev.map(chat => {
        if (chat.id === currentChatId) {
          const newMessages = [
            ...chat.messages,
            {
              role,
              content,
              timestamp: new Date().toISOString(),
            }
          ];
          
          // Update title based on first user message
          let newTitle = chat.title;
          if (role === 'user' && chat.messages.length === 0) {
            newTitle = content.substring(0, 40) + (content.length > 40 ? '...' : '');
          }
          
          return { ...chat, messages: newMessages, title: newTitle };
        }
        return chat;
      });
      
      return updatedChats;
    });
  };

  const editMessage = (messageTimestamp, newContent) => {
    setChats(prev => {
      const updatedChats = prev.map(chat => {
        if (chat.id === currentChatId) {
          const updatedMessages = chat.messages.map(msg => {
            if (msg.timestamp === messageTimestamp && msg.role === 'user') {
              return {
                ...msg,
                content: newContent,
                edited: true,
                editedAt: new Date().toISOString(),
              };
            }
            return msg;
          });
          
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });
      
      return updatedChats;
    });
  };

  const loadChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = (chatId) => {
    setChats(prev => {
      const updatedChats = prev.filter(chat => chat.id !== chatId);
      
      // If we deleted the current chat, switch to another or create new
      if (chatId === currentChatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id);
        } else {
          createNewChat();
        }
      }
      
      return updatedChats;
    });
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null;
  };

  const getRecentChats = () => {
    return chats.slice(0, 10); // Return last 10 chats
  };

  return {
    chats,
    currentChatId,
    currentChat: getCurrentChat(),
    addMessage,
    editMessage,
    createNewChat,
    loadChat,
    deleteChat,
    getRecentChats,
  };
}
