import { useState } from 'react';
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, BookOpen, Home, History, Settings, Mail, Users, Trash } from 'lucide-react';
import { useScript } from '../context/ScriptContext';
import { learningResources, categories } from '../data/learningResources';

export default function Sidebar({ isOpen, onClose, chatHistory, currentChatId, onSelectChat, onDeleteChat, onNewChat, onAboutClick, onHomeClick }) {
  const { scriptMode, toggleScript } = useScript();
  const [showResources, setShowResources] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
        {/* Main Actions */}
        <div className="p-4 border-b border-earthyGreen/10">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-earthyGreen text-white rounded-xl hover:bg-earthyGreen/90 transition-colors font-olChiki shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>{scriptMode === 'olchiki' ? 'ᱱᱟᱶᱟ ᱨᱚᱯᱚᱲ' : 'New Chat'}</span>
          </button>
        </div>

        {/* Chat Activity */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
              <History className="w-4 h-4" />
              {scriptMode === 'olchiki' ? 'ᱱᱟᱜᱟᱢ' : 'History'}
            </h3>
            
            <div>
              {chatHistory.length > 0 ? (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id
                        ? 'bg-earthyGreen/10 border border-earthyGreen/30'
                        : 'hover:bg-gray-100 border border-transparent'
                    }`}
                    onClick={() => {
                      onSelectChat(chat.id);
                      onClose();
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 font-olChiki truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                      title={scriptMode === 'olchiki' ? 'ᱢᱮᱴᱟᱣ ᱢᱮ' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4 font-olChiki">
                  {scriptMode === 'olchiki' ? 'ᱪᱷᱟᱹᱲ ᱵᱟᱹᱱᱩᱭᱟ' : 'No chats yet'}
                </p>
              )}
            </div>
          </div>

          {/* Knowledge & Resources */}
          <div className="border-t border-earthyGreen/10">
            <button
              onClick={() => setShowResources(!showResources)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {scriptMode === 'olchiki' ? 'ᱥᱟᱱᱛᱟᱲᱤ ᱥᱮᱪᱮᱫ' : 'Learn Santali'}
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

          {/* Tools Section */}
          <div className="border-t border-earthyGreen/10">
            <button
              onClick={() => setShowTools(!showTools)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {scriptMode === 'olchiki' ? 'ᱥᱟᱯᱟᱵᱽ' : 'Tools'}
              </h3>
              {showTools ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {showTools && (
              <div className="p-4 pt-0 space-y-2">
                <a
                  href="/ol-chiki-chart.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-cream rounded-lg hover:shadow-md transition-all border border-earthyGreen/10 hover:border-earthyGreen/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <h4 className="text-sm font-semibold text-earthyGreen font-olChiki">
                        {scriptMode === 'olchiki' ? 'ᱚᱞ ᱪᱤᱠᱤ ᱪᱟᱨᱴ' : 'Ol Chiki Chart'}
                      </h4>
                      <p className="text-xs text-gray-600 font-olChiki">
                        {scriptMode === 'olchiki' ? 'ᱚᱞ ᱪᱤᱠᱤ ᱪᱮᱫ ᱠᱟᱱᱟ' : 'Learn the alphabet'}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="border-t border-earthyGreen/10">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {scriptMode === 'olchiki' ? 'ᱥᱟᱡᱟᱣ' : 'Settings'}
              </h3>
              {showSettings ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {showSettings && (
              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    toggleScript();
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">🔤</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱚᱞ ᱪᱤᱠᱤ' : 'Ol Chiki'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {scriptMode === 'olchiki' ? 'ᱤᱝᱞᱤᱥ' : 'English'}
                    </p>
                  </div>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">👤</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱟᱢᱟᱜ ᱩᱯᱨᱩᱢ' : 'Profile'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setShowTheme(!showTheme)}
                  className="w-full flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌓</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800 font-olChiki">
                        {scriptMode === 'olchiki' ? 'ᱨᱚᱝ ᱵᱚᱫᱚᱞ' : 'Appearance / Theme'}
                      </p>
                    </div>
                  </div>
                  {showTheme ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {showTheme && (
                  <div className="ml-8">
                    <button
                      onClick={() => setSelectedTheme('light')}
                      className="w-full flex items-center justify-between gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">☀️</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-800 font-olChiki">
                            {scriptMode === 'olchiki' ? 'ᱢᱟᱨᱥᱟᱞ' : 'Light'}
                          </p>
                        </div>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-colors ${selectedTheme === 'light' ? 'bg-earthyGreen' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${selectedTheme === 'light' ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTheme('dark')}
                      className="w-full flex items-center justify-between gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🌙</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-800 font-olChiki">
                            {scriptMode === 'olchiki' ? 'ᱧᱩᱛ' : 'Dark'}
                          </p>
                        </div>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-colors ${selectedTheme === 'dark' ? 'bg-earthyGreen' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${selectedTheme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTheme('system')}
                      className="w-full flex items-center justify-between gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💻</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-800 font-olChiki">
                            {scriptMode === 'olchiki' ? 'ᱥᱤᱥᱴᱮᱢ' : 'System'}
                          </p>
                        </div>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-colors ${selectedTheme === 'system' ? 'bg-earthyGreen' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${selectedTheme === 'system' ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                      </div>
                    </button>
                  </div>
                )}
                <button
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">🌐</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱯᱟᱹᱨᱥᱤ' : 'Language'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="w-full flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔔</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800 font-olChiki">
                        {scriptMode === 'olchiki' ? 'ᱞᱟᱹᱭ ᱡᱚᱝ' : 'Notifications'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${notificationsEnabled ? 'bg-earthyGreen' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                  </div>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">🔒</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱩᱠᱩ ᱠᱟᱛᱷᱟ' : 'Privacy & Security'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setShowClearDataConfirm(true)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">🗑️</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱰᱮᱴᱟ ᱢᱩᱪᱟᱹᱫ' : 'Clear Data'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <span className="text-xl">🚪</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-600 font-olChiki">
                      {scriptMode === 'olchiki' ? 'ᱵᱟᱦᱮᱨᱚᱜ' : 'Log Out'}
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* App Info */}
          <div className="border-t border-earthyGreen/10 p-4 space-y-2">
            <button
              onClick={() => {
                onAboutClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="w-5 h-5 text-earthyGreen" />
              <span className="text-sm text-gray-700 font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱟᱞᱮ ᱵᱟᱵᱚᱛ ᱛᱮ' : 'About Us'}
              </span>
            </button>
            <button
              onClick={() => {
                setShowContact(true);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700 font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱥᱟᱹᱜᱟᱹᱭ' : 'Contact'}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-earthyGreen font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱥᱟᱹᱜᱟṭ' : 'Contact'}
              </h2>
              <button
                onClick={() => setShowContact(false)}
                className="p-2 rounded-lg hover:bg-earthyGreen/10 transition-colors"
              >
                <Mail className="w-5 h-5 text-earthyGreen" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱟᱞᱮ ᱥᱟᱞᱟᱜ ᱥᱟᱹᱜᱟṭ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱫ ᱦᱚᱲᱢᱚ ᱾' : 'Contact information coming soon.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {showClearDataConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-earthyGreen font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱰᱮᱴᱟ ᱢᱩᱪᱟᱹᱫ' : 'Clear Data'}
              </h2>
              <button
                onClick={() => setShowClearDataConfirm(false)}
                className="p-2 rounded-lg hover:bg-earthyGreen/10 transition-colors"
              >
                <span className="text-xl">🗑️</span>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 font-olChiki">
                {scriptMode === 'olchiki' 
                  ? 'ᱟᱢ ᱫᱚ ᱟᱢᱟᱜ ᱡᱷᱚᱴᱟ ᱰᱮᱴᱟ ᱢᱮᱴᱟᱣ ᱥᱟᱱᱟᱲᱟᱭᱟᱢ ᱥᱮᱫ? ᱱᱚᱣᱟ ᱠᱟᱹᱢᱤ ᱫᱚ ᱵᱟᱝ ᱦᱮᱲᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ ᱾'
                  : 'Are you sure you want to clear all your data? This action cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearDataConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-olChiki"
                >
                  {scriptMode === 'olchiki' ? 'ᱵᱟᱝ' : 'No'}
                </button>
                <button
                  onClick={() => {
                    setShowClearDataConfirm(false);
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-olChiki"
                >
                  {scriptMode === 'olchiki' ? 'ᱦᱚᱭ' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-earthyGreen font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱵᱟᱦᱮᱨᱚᱜ' : 'Log Out'}
              </h2>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="p-2 rounded-lg hover:bg-earthyGreen/10 transition-colors"
              >
                <span className="text-xl">🚪</span>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 font-olChiki">
                {scriptMode === 'olchiki' 
                  ? 'ᱟᱢ ᱫᱚ ᱟᱢᱟᱜ ᱠᱷᱟᱛᱟ ᱠᱷᱚᱲᱤ ᱵᱟᱦᱮᱨᱚᱜ ᱥᱟᱱᱟᱲᱟᱭᱟᱢ ᱥᱮᱫ?'
                  : 'Are you sure you want to log out of your account?'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-olChiki"
                >
                  {scriptMode === 'olchiki' ? 'ᱵᱟᱝ' : 'No'}
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    // Logout logic can be added here
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-olChiki"
                >
                  {scriptMode === 'olchiki' ? 'ᱦᱚᱭ' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
