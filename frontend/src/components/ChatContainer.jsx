import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useScript } from '../context/ScriptContext';
import { MessageCircle } from 'lucide-react';

export default function ChatContainer({ messages, isLoading, onEditMessage, onEditMessageContent, onSuggestionClick, inputHasText }) {
  const { scriptMode } = useScript();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24 md:px-8 md:pt-6 md:pb-6 lg:px-12 lg:pt-6 lg:pb-6">
      {/* Date Display */}
      {messages.length > 0 && (
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm text-gray-600 font-olChiki shadow-sm">
            {today}
          </span>
        </div>
      )}
      {messages.length === 0 ? (
        // Welcome Screen
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="/santal-gpt.png" alt="SantalGPT" className="w-20 h-20 object-contain rounded-full" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-earthyGreen font-olChiki">
              {scriptMode === 'olchiki' ? 'ᱥᱟᱱᱛᱟᱲᱜᱤᱯᱤᱴᱤ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ' : 'Welcome to SantalGPT'}
            </h2>
            <p className="text-gray-600 max-w-md font-olChiki">
              {scriptMode === 'olchiki'
                ? 'ᱤᱧ ᱫᱚ ᱥᱟᱱᱛᱟᱲ ᱥᱟᱶᱛᱟ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱮᱟᱭᱤ (AI) ᱠᱟᱹᱱᱟᱹᱧ ᱾ ᱤᱧ ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟᱧ ᱜᱚᱲᱚ ᱟᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ?'
                : 'I am an AI for the Santali community. How can I assist you today?'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mt-8">
            {[
              {
                ol: 'ᱤᱧ ᱪᱮᱫ ᱞᱮᱠᱟ ᱜᱚᱲᱚ ᱧᱟᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?',
                latin: 'What kind of help can I get?',
              },
              {
                ol: 'ᱚᱞ ᱪᱤᱠᱤ ᱪᱮᱫ ᱠᱟᱱᱟ?',
                latin: 'What is Ol Chiki script?',
              },
              {
                ol: 'ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟṹᱨᱥᱤ ᱥᱤᱠᱱᱟᱹᱛ',
                latin: 'Learn Santali language',
              },
              {
                ol: 'ᱥᱟᱱᱛᱟᱲ ᱫᱷᱚᱨᱚᱢ ᱟᱨ ᱥᱟᱶᱛᱟ',
                latin: 'Santali culture and traditions',
              },
            ].map((suggestion, index) => (
              <div
                key={index}
                onClick={() => onSuggestionClick && onSuggestionClick(scriptMode === 'olchiki' ? suggestion.ol : suggestion.latin)}
                className="p-4 bg-white border border-earthyGreen/20 rounded-xl hover:border-earthyGreen/40 hover:shadow-md transition-all cursor-pointer"
              >
                <p className="text-sm text-gray-700 font-olChiki">
                  {scriptMode === 'olchiki' ? suggestion.ol : suggestion.latin}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Messages List
        <>
          {(() => {
            // Find the last user message index
            let lastUserMessageIndex = -1;
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === 'user') {
                lastUserMessageIndex = i;
                break;
              }
            }
            return messages.map((message, index) => (
              <MessageBubble 
                key={index} 
                message={message} 
                onEdit={onEditMessage} 
                onEditMessageContent={onEditMessageContent}
                isLastUserMessage={index === lastUserMessageIndex}
                inputHasText={inputHasText}
              />
            ));
          })()}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-earthyGreen text-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
