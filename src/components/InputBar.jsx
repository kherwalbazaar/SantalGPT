import { useState, useRef, useEffect } from 'react';
import { Send, Plus, X, Edit3, Camera, Image, FileText, Brain, Search, Mic, MicOff } from 'lucide-react';
import { useScript } from '../context/ScriptContext';

export default function InputBar({ onSendMessage, initialValue }) {
  const { scriptMode } = useScript();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const menuRef = useRef(null);

  // Update message when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined) {
      setMessage(initialValue);
      setIsEditing(true);
      inputRef.current?.focus();
    } else {
      setIsEditing(false);
    }
  }, [initialValue]);

  const handleCancelEdit = () => {
    setMessage('');
    setIsEditing(false);
    inputRef.current?.focus();
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Check if Speech Recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'sat-IN'; // Santali language code (fallback to browser default)

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsEditing(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="sticky bottom-0 z-40 bg-cream border-t border-earthyGreen/10 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4 md:px-8">
        <div className="flex items-end gap-2 md:gap-3">
          {/* Plus Button with Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleToggleMenu}
              className="flex-shrink-0 p-3 rounded-xl bg-earthyGreen/10 text-earthyGreen hover:bg-earthyGreen/20 transition-all duration-200"
              aria-label="Show options"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-[200px]">
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      // Handle Camera
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Camera className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱠᱮᱢᱮᱨᱟ' : 'Camera'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      // Handle Photos
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Image className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱯᱷᱚᱴᱚ' : 'Photos'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      // Handle File
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱯᱷᱟᱭᱤᱞ' : 'File'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      // Handle Thinking
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Brain className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱥᱮᱫᱟᱭ' : 'Thinking'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      // Handle Deep research
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱜᱟᱹᱦᱨ ᱥᱮᱫᱟᱭ' : 'Deep research'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <div className="relative">
              {isEditing && (
                <div className="absolute top-0 left-0 right-0 -mt-6 flex items-center justify-between px-2 py-1 bg-terracotta/10 rounded-t-lg border border-terracotta/30">
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-terracotta" />
                    <span className="text-xs font-medium text-terracotta">
                      {scriptMode === 'olchiki' ? 'ᱥᱩᱫᱫᱷ ᱦᱚᱛ' : 'Editing message'}
                    </span>
                  </div>
                  <button
                    onClick={handleCancelEdit}
                    className="p-0.5 hover:bg-terracotta/20 rounded transition-colors"
                    aria-label="Cancel edit"
                  >
                    <X className="w-3.5 h-3.5 text-terracotta" />
                  </button>
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  scriptMode === 'olchiki'
                    ? 'ᱱᱚᱸᱰᱮ ᱠᱩᱠᱞᱤ ᱚᱞ ᱢᱮ...'
                    : 'Write your question here...'
                }
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:border-earthyGreen focus:outline-none transition-colors font-olChiki text-sm md:text-base ${
                  isEditing ? 'border-terracotta/50' : 'border-earthyGreen/20'
                } pr-12`}
                disabled={isRecording}
              />
              {/* Mic Button Inside Input */}
              {isSupported && (
                <button
                  onClick={toggleRecording}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-earthyGreen/10 text-earthyGreen hover:bg-earthyGreen/20'
                  }`}
                  aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
              message.trim()
                ? 'bg-terracotta text-white hover:bg-terracotta/90 shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="mt-2 text-center text-sm text-red-500 font-medium animate-pulse">
            {scriptMode === 'olchiki' ? 'ᱨᱚᱲ ᱫᱚᱦᱚ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...' : 'Recording...'}
          </div>
        )}
      </div>
    </div>
  );
}
