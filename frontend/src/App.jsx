import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ScriptProvider } from './context/ScriptContext';
import useChatHistory from './hooks/useChatHistory';
import BackgroundPattern from './components/BackgroundPattern';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import InputBar from './components/InputBar';
import Sidebar from './components/Sidebar';
import AboutUs from './components/AboutUs';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editValue, setEditValue] = useState(undefined);
  const [editingMessageTimestamp, setEditingMessageTimestamp] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setShowInstallPrompt(false);
    }
  };
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
  // Use same-origin /api in production, or NEXT_PUBLIC_API_URL when explicitly provided.
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
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
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F0F9F1' }}>
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
          onAboutClick={() => setShowAbout(true)}
          onHomeClick={() => setShowAbout(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          {showAbout ? (
            <AboutUs onBack={() => setShowAbout(false)} />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* PWA Install Prompt */}
        {showInstallPrompt && (
          <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-2xl p-4 z-50 border border-earthyGreen/20">
            <div className="flex items-start gap-3">
              <img src="/santal-gpt.png" alt="SantalGPT" className="w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-earthyGreen font-olChiki">Install SantalGPT</h3>
                <p className="text-sm text-gray-600 font-olChiki mt-1">
                  Install app for better experience
                </p>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full mt-3 bg-earthyGreen text-white py-2 rounded-lg font-olChiki hover:bg-earthyGreen/90 transition-colors"
            >
              Install
            </button>
          </div>
        )}
      </div>
    </ScriptProvider>
  );
}

export default App;
