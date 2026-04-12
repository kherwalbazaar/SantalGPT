import { useState } from 'react';
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
  const {
    currentChat,
    addMessage,
    editMessage,
    createNewChat,
    loadChat,
    deleteChat,
    getRecentChats,
  } = useChatHistory();

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleEditMessage = (messageTimestamp, newContent) => {
    editMessage(messageTimestamp, newContent);
  };

  const handleSendMessage = async (message) => {
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

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Add AI response
      addMessage('ai', data.reply);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      // Fallback to mock response if API fails
      const mockResponse = generateMockResponse(message);
      addMessage('ai', mockResponse);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock AI response generator
  const generateMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Detect greetings
    const greetings = ['hi', 'hello', 'hlo', 'hii', 'hii', 'hey', 'hola', 'namaste', 'joaar', 'johar'];
    const isGreeting = greetings.some(greeting => message === greeting || message.startsWith(greeting + ' '));
    
    if (isGreeting) {
      return "How can I help you today? 😊";
    }
    
    // Other contextual responses
    const responses = [
      "ᱱᱚᱣᱟ ᱫᱚ ᱵᱟᱹᱲᱛᱤ ᱜᱟᱱ ᱜᱚᱲᱚ ᱠᱟᱱᱟ ᱾ ᱤᱧ ᱟᱯᱱᱟᱨ ᱟᱨᱦᱚᱸ ᱜᱚᱲᱚ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ!",
      "ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱫᱚ ᱟᱹᱰᱤ ᱢᱟᱨᱮ ᱟᱨ ᱥᱚᱨᱮᱥ ᱠᱟᱱᱟ ᱾",
      "ᱚᱞ ᱪᱤᱠᱤ ᱫᱚ ᱨᱚᱜᱷᱩᱱᱟᱛᱷ ᱢᱩᱨᱢᱩ ᱛᱮᱭᱟᱨ ᱞᱮᱫᱼᱟ ᱑᱙᱒᱕ ᱥᱟᱹᱦᱤᱛ ᱨᱮ ᱾",
      "ᱤᱧ ᱟᱯᱱᱟᱨ ᱥᱟᱱᱛᱟᱲ ᱥᱟᱶᱛᱟ ᱵᱟᱵᱚᱫᱽ ᱛᱮ ᱠᱩᱠᱞᱤ ᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ ᱾",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

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
          
          <ChatContainer
            messages={currentChat?.messages || []}
            isLoading={isLoading}
            onEditMessage={handleEditMessage}
          />
          
          <InputBar onSendMessage={handleSendMessage} />
        </div>
      </div>
    </ScriptProvider>
  );
}

export default App;
