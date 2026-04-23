import { useState, useEffect } from 'react';
import { ScriptProvider } from './context/ScriptContext';
import useChatHistory from './hooks/useChatHistory';
import BackgroundPattern from './components/BackgroundPattern';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import InputBar from './components/InputBar';
import Sidebar from './components/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editValue, setEditValue] = useState(undefined);
  const [editingMessageTimestamp, setEditingMessageTimestamp] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    currentChat,
    addMessage,
    editMessage,
    createNewChat,
    loadChat,
    deleteChat,
    getRecentChats,
  } = useChatHistory();

  // Set initialized state after hook loads
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // API Configuration
  // Use relative path for production (Vercel), localhost for development
  // VITE_API_URL can be set to override for testing
  const isDev = import.meta.env.DEV;
  const API_BASE_URL = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:8000' : '');

  const handleEditMessage = (messageTimestamp, newContent) => {
    editMessage(messageTimestamp, newContent);
  };

  const handleEditMessageContent = (content, timestamp) => {
    setEditValue(content);
    setEditingMessageTimestamp(timestamp);
  };

  const handleSuggestionClick = (text) => {
    setEditValue(text);
  };

  const handleSendMessage = async (message) => {
    // If editing, delete the specific message being edited
    if (editValue !== undefined && editingMessageTimestamp !== null) {
      deleteChat(editingMessageTimestamp);
      setEditValue(undefined);
      setEditingMessageTimestamp(null);
    }

    // Add user message
    addMessage('user', message);
    setIsLoading(true);

    try {
      // Send message to backend API
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: [], // Can be extended to include conversation history
        }),
      });

      const data = await response.json();
      
      if (!data.reply) {
        throw new Error('No reply from server');
      }
      
      // Add AI response (handles both success and error responses from backend)
      addMessage('ai', data.reply);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      // Fallback response when API is not working
      addMessage('ai', 'ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ScriptProvider>
      <div className="flex h-screen bg-cream overflow-hidden">
        <BackgroundPattern />
        
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatHistory={getRecentChats()}
          currentChatId={currentChat?.id}
          onSelectChat={loadChat}
          onDeleteChat={deleteChat}
          onNewChat={createNewChat}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4">
              <ChatContainer
                messages={currentChat?.messages || []}
                isLoading={isLoading}
                onEditMessage={handleEditMessage}
                onEditMessageContent={handleEditMessageContent}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          </div>
          
          <InputBar onSendMessage={handleSendMessage} initialValue={editValue} />
        </div>
      </div>
    </ScriptProvider>
  );
}

export default App;
