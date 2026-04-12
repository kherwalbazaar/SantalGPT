import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useScript } from '../context/ScriptContext';

export default function InputBar({ onSendMessage }) {
  const { scriptMode } = useScript();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

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
          {/* Voice Input Button */}
          {isSupported && (
            <button
              onClick={toggleRecording}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-earthyGreen/10 text-earthyGreen hover:bg-earthyGreen/20'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
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
              className="w-full px-4 py-3 bg-white border-2 border-earthyGreen/20 rounded-xl focus:border-earthyGreen focus:outline-none transition-colors font-olChiki text-sm md:text-base"
              disabled={isRecording}
            />
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
