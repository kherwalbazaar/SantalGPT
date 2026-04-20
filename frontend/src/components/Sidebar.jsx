import { useState } from 'react';
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useScript } from '../context/ScriptContext';
import { learningResources, categories } from '../data/learningResources';

export default function Sidebar({ isOpen, onClose, chatHistory, currentChatId, onSelectChat, onDeleteChat, onNewChat }) {
  const { scriptMode } = useScript();
  const [showResources, setShowResources] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredResources = activeCategory === 'all'
    ? learningResources
    : learningResources.filter(r => r.category === activeCategory);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl md:shadow-none border-r border-earthyGreen/10 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-earthyGreen/10">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-earthyGreen text-white rounded-xl hover:bg-earthyGreen/90 transition-colors font-olChiki"
          >
            <Plus className="w-5 h-5" />
            <span>{scriptMode === 'olchiki' ? 'ᱱᱟᱶᱟ ᱜᱟᱞᱢᱟᱨᱟᱣ' : 'New Chat'}</span>
          </button>
        </div>

        {/* Recent History */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              {scriptMode === 'olchiki' ? 'ᱥᱮᱫᱟᱭ ᱜᱟᱞᱢᱟᱨᱟᱣ' : 'Recent History'}
            </h3>
            
            <div className="space-y-0">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    chat.id === currentChatId
                      ? 'bg-earthyGreen/10 border border-earthyGreen/30'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                >
                  <BookOpen className="w-4 h-4 text-earthyGreen flex-shrink-0" />
                  <p className="flex-1 text-sm text-gray-700 truncate font-olChiki">
                    {chat.title}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources Section */}
          <div className="border-t border-earthyGreen/10">
            <button
              onClick={() => setShowResources(!showResources)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {scriptMode === 'olchiki' ? 'ᱥᱤᱠᱱᱟᱹᱛ ᱡᱚᱱᱚᱲ' : 'Learning Resources'}
              </h3>
              {showResources ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {showResources && (
              <div className="p-4 pt-0 space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors font-olChiki ${
                        activeCategory === cat.id
                          ? 'bg-earthyGreen text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {scriptMode === 'olchiki' ? cat.labelOl : cat.label}
                    </button>
                  ))}
                </div>

                {/* Resources List */}
                <div className="space-y-3">
                  {filteredResources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-cream rounded-lg hover:shadow-md transition-all border border-earthyGreen/10 hover:border-earthyGreen/30"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{resource.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-earthyGreen font-olChiki truncate">
                            {scriptMode === 'olchiki' ? resource.title : resource.titleLatin}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 font-olChiki line-clamp-2">
                            {scriptMode === 'olchiki' ? resource.descriptionOl : resource.description}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
