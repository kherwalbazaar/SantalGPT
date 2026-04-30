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

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app' 
  : 'http://localhost:8000';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editValue, setEditValue] = useState(undefined);
  const [editingMessageTimestamp, setEditingMessageTimestamp] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [inputHasText, setInputHasText] = useState(false);

  // Initialize chat history
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    currentChat,
    chats,
    currentChatId,
    createNewChat,
    loadChat,
    deleteChat,
    isLoading,
    error,
    clearError,
  } = useChatHistory();

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
    }
  };

  // Initialize app
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleSendMessage = async (message) => {
    // If editing, delete the specific message being edited
    if (editValue !== undefined && editingMessageTimestamp !== null) {
      deleteMessage(editingMessageTimestamp);
      setEditValue(undefined);
      setEditingMessageTimestamp(null);
    }

    // Add user message
    addMessage('user', message);

    // Fallback response - backend not configured
    setTimeout(() => {
      addMessage('ai', 'ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ');
    }, 1000);
    
    // Clear suggestion text after sending
    setSuggestionText('');
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = (chatId) => {
    loadChat(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    deleteChat(chatId);
  };

  const handleEditMessage = (content, timestamp) => {
    setEditValue(content);
    setEditingMessageTimestamp(timestamp);
    setInputHasText(true); // Set to true since we're editing with content
  };

  const handleSuggestionClick = (text) => {
    setSuggestionText(text);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-earthyGreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SantalGPT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <BackgroundPattern />
      
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-earthyGreen/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-earthyGreen">Install SantalGPT</p>
              <p className="text-sm text-gray-600">Get the app experience on your device</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Not now
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-1 text-sm bg-earthyGreen text-white rounded hover:bg-earthyGreen/90"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-3 max-w-sm">
          <div className="flex items-start gap-2">
            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 text-sm font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main App */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatHistory={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onNewChat={handleNewChat}
          onAboutClick={() => setShowAbout(true)}
          onHomeClick={() => setShowAbout(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header
            onToggleSidebar={() => setSidebarOpen(true)}
          />
          
          <ChatContainer
            messages={messages || []}
            isLoading={isLoading}
            editValue={editValue}
            editingMessageTimestamp={editingMessageTimestamp}
            onEditMessage={handleEditMessage}
            onSuggestionClick={handleSuggestionClick}
            inputHasText={inputHasText}
          />
          
          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            editValue={editValue}
            setEditValue={setEditValue}
            editingMessageTimestamp={editingMessageTimestamp}
            setEditingMessageTimestamp={setEditingMessageTimestamp}
            initialValue={editValue}
            suggestion={suggestionText}
            onInputChange={setInputHasText}
          />
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <AboutUs onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <ScriptProvider>
      <App />
    </ScriptProvider>
  );
}

export default AppWrapper;
