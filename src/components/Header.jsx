import { Menu, ToggleLeft, ToggleRight, Info, X } from 'lucide-react';
import { useScript } from '../context/ScriptContext';
import { useState } from 'react';

export default function Header({ onToggleSidebar }) {
  const { scriptMode, toggleScript } = useScript();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream shadow-md border-b border-earthyGreen/10">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Left: Logo and Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-earthyGreen/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-earthyGreen" />
            </button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-earthyGreen rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ᱥ</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-earthyGreen font-olChiki -mt-4">
                  SantalGPT
                </h1>
              </div>
              <p className="text-xs text-gray-500 -mt-5 ml-12">Santali Open AI</p>
            </div>
          </div>

          {/* Right: Script Switcher and Help */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Script Switcher */}
            <button
              onClick={toggleScript}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-earthyGreen/10 hover:bg-earthyGreen/20 transition-all duration-200"
              aria-label={`Switch to ${scriptMode === 'olchiki' ? 'Latin' : 'Ol Chiki'} script`}
            >
              {scriptMode === 'olchiki' ? (
                <ToggleLeft className="w-5 h-5 text-earthyGreen" />
              ) : (
                <ToggleRight className="w-5 h-5 text-earthyGreen" />
              )}
              <span className="text-sm font-medium text-earthyGreen hidden sm:inline">
                {scriptMode === 'olchiki' ? 'ᱚᱞ ᱪᱤᱠᱤ' : 'Latin'}
              </span>
            </button>

            {/* Help Icon */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-lg hover:bg-earthyGreen/10 transition-colors"
              aria-label="Help and cultural information"
            >
              <Info className="w-5 h-5 text-earthyGreen" />
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-cream rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-cream border-b border-earthyGreen/10 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-earthyGreen font-olChiki">
                {scriptMode === 'olchiki' ? 'ᱜᱚᱲᱚ' : 'Help & Culture'}
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-lg hover:bg-earthyGreen/10 transition-colors"
                aria-label="Close help"
              >
                <X className="w-5 h-5 text-earthyGreen" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-earthyGreen mb-2">
                  {scriptMode === 'olchiki' ? 'ᱥᱮᱫᱟᱭ ᱠᱟᱛᱷᱟ' : 'About SantalGPT'}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {scriptMode === 'olchiki' 
                    ? 'ᱥᱟᱱᱛᱟᱲᱜᱤᱯᱤᱴᱤ ᱫᱚ ᱥᱟᱱᱛᱟᱲ ᱥᱟᱶᱛᱟ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱮ᱁ᱟᱭᱤ ᱾ ᱱᱚᱣᱟ ᱟᱯᱱᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱛᱮ ᱠᱩᱠᱞᱤ ᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ ᱟᱨ ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱜᱚᱲᱚ ᱮᱢᱟᱭᱟ ᱾'
                    : 'SantalGPT is an AI designed for the Santali community. It can understand questions in Ol Chiki script and provide assistance in Santali language and culture.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-earthyGreen mb-2">
                  {scriptMode === 'olchiki' ? 'ᱚᱞ ᱪᱤᱠᱤ ᱵᱟᱵᱚᱫᱽ' : 'About Ol Chiki Script'}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {scriptMode === 'olchiki'
                    ? 'ᱚᱞ ᱪᱤᱠᱤ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱚᱞ ᱛᱚᱦᱚᱨ ᱠᱟᱱᱟ ᱾ ᱱᱚᱣᱟ ᱑᱙᱒᱕ ᱥᱟᱹᱦᱤᱛ ᱨᱮ ᱨᱚᱜᱷᱩᱱᱟᱛᱷ ᱢᱩᱨᱢᱩ ᱛᱮᱭᱟᱨ ᱞᱮᱫᱼᱟ ᱾'
                    : 'Ol Chiki is the writing system for the Santali language, created by Raghunath Murmu in 1925. It has 30 letters and is used to write Santali across India, Bangladesh, and Nepal.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-earthyGreen mb-2">
                  {scriptMode === 'olchiki' ? 'ᱵᱮᱵᱷᱟᱨ' : 'How to Use'}
                </h3>
                <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                  <li>
                    {scriptMode === 'olchiki'
                      ? 'ᱱᱚᱸᱰᱮ ᱠᱩᱠᱞᱤ ᱚᱞ ᱢᱮ'
                      : 'Type your question in the input bar'}
                  </li>
                  <li>
                    {scriptMode === 'olchiki'
                      ? 'ᱨᱚᱲ ᱤᱱᱯᱩᱴ ᱞᱟᱹᱜᱤᱫ ᱢᱟᱭᱤᱠ ᱵᱟᱴᱚᱱ ᱮᱢ ᱢᱮ'
                      : 'Use the microphone button for voice input'}
                  </li>
                  <li>
                    {scriptMode === 'olchiki'
                      ? 'ᱚᱞ ᱪᱤᱠᱤ/ᱞᱟᱛᱤᱱ ᱛᱟᱞᱟᱨᱮ ᱵᱚᱫᱚᱞ ᱢᱮ'
                      : 'Toggle between Ol Chiki and Latin scripts'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
