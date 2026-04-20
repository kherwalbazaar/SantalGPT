import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useScript } from '../context/ScriptContext';
import { MessageCircle } from 'lucide-react';

export default function ChatContainer({ messages, isLoading, onEditMessage, onEditMessageContent, onSuggestionClick }) {
  const { scriptMode } = useScript();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-12">
      {messages.length === 0 ? (
        // Welcome Screen
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
          <div className="w-20 h-20 bg-earthyGreen/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-earthyGreen" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-earthyGreen font-olChiki">
              {scriptMode === 'olchiki' ? 'ᱥᱟᱱᱛᱟᱲᱜᱤᱯᱤᱴᱤ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ' : 'Welcome to SantalGPT'}
            </h2>
            <p className="text-gray-600 max-w-md font-olChiki">
              {scriptMode === 'olchiki'
                ? 'ᱟᱯᱱᱟᱨ ᱫᱚ ᱥᱟᱱᱛᱟᱲ ᱥᱟᱶᱛᱟ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱮᱟᱭᱤ ᱾ ᱤᱧ ᱟᱯᱱᱟᱨ ᱪᱮᱫ ᱜᱚᱲᱚ ᱫᱟᱲᱮᱭᱟᱜ ᱟ?'
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
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} onEdit={onEditMessage} onEditMessageContent={onEditMessageContent} />
          ))}
          
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
