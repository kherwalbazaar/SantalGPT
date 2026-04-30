import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { 
  createChat, 
  getChat, 
  getUserChats, 
  addMessageToChat, 
  updateChat,
  deleteChat 
} from '../services/firestoreService';

export function useSecureChat() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's chats on mount
  useEffect(() => {
    if (currentUser) {
      loadChats();
    }
  }, [currentUser]);

  // Load current chat when ID changes
  useEffect(() => {
    if (currentChatId && currentUser) {
      loadChat(currentChatId);
    }
  }, [currentChatId, currentUser]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const userChats = await getUserChats(currentUser.uid);
      setChats(userChats);
      
      // Set current chat to most recent if none selected
      if (!currentChatId && userChats.length > 0) {
        setCurrentChatId(userChats[0].id);
      }
    } catch (error) {
      console.error('Load chats error:', error);
      setError('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      setIsLoading(true);
      const chat = await getChat(currentUser.uid, chatId);
      setCurrentChat(chat);
    } catch (error) {
      console.error('Load chat error:', error);
      setError('Failed to load chat');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      setIsLoading(true);
      const newChat = await createChat(currentUser.uid, {
        title: 'ᱱᱟᱶᱟ ᱜᱟᱞᱢᱟᱨᱟᱣ', // "New Conversation" in Ol Chiki
        userId: currentUser.uid,
      });
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setCurrentChat(newChat);
      
      return newChat.id;
    } catch (error) {
      console.error('Create chat error:', error);
      setError('Failed to create new chat');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message, editingMessageIndex = null) => {
    if (!currentUser || !currentChatId) {
      throw new Error('User not authenticated or no chat selected');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Prepare message data
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      let updatedChat;
      
      if (editingMessageIndex !== null) {
        // Editing existing message
        const messages = [...currentChat.messages];
        messages[editingMessageIndex] = userMessage;
        
        updatedChat = {
          ...currentChat,
          messages,
        };
        
        // Update in Firestore
        await updateChat(currentUser.uid, currentChatId, updatedChat);
      } else {
        // Add new message
        updatedChat = await addMessageToChat(currentUser.uid, currentChatId, userMessage);
      }

      setCurrentChat(updatedChat);
      
      // Update chat in the list
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId ? updatedChat : chat
      ));

      // Get chat history for API
      const apiHistory = updatedChat.messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }));

      // Send to secure backend API
      const response = await apiService.sendMessage(message, apiHistory);

      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        status: response.status,
      };

      const finalChat = await addMessageToChat(currentUser.uid, currentChatId, aiMessage);
      setCurrentChat(finalChat);
      
      // Update chat in the list
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId ? finalChat : chat
      ));

      // Update chat title if this is the first message
      if (updatedChat.messages.length === 1) {
        const title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
        await updateChat(currentUser.uid, currentChatId, { title });
        
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId ? { ...chat, title } : chat
        ));
      }

      return response;
    } catch (error) {
      console.error('Send message error:', error);
      setError('Failed to send message');
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: 'ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ',
        timestamp: new Date().toISOString(),
        status: 'error',
      };

      const errorChat = await addMessageToChat(currentUser.uid, currentChatId, errorMessage);
      setCurrentChat(errorChat);
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId ? errorChat : chat
      ));
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChatById = async (chatId) => {
    try {
      setIsLoading(true);
      await deleteChat(currentUser.uid, chatId);
      
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If deleted current chat, select another or create new
      if (chatId === currentChatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id);
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.error('Delete chat error:', error);
      setError('Failed to delete chat');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    chats,
    currentChat,
    currentChatId,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    deleteChat: deleteChatById,
    selectChat,
    loadChats,
    clearError,
  };
}
