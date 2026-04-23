import { ArrowLeft } from 'lucide-react';
import { useScript } from '../context/ScriptContext';

export default function AboutUs({ onBack }) {
  const { scriptMode } = useScript();

  const introductionContent = scriptMode === 'olchiki'
    ? "ᱥᱟᱱᱛᱟᱲGPT ᱫᱚ ᱥᱟᱱᱛᱟᱲ ᱥᱟᱶᱛᱟ ᱨᱮᱱᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱞᱟᱠᱪᱟᱨ ᱰᱤᱡᱤᱴᱟᱞ ᱫᱩᱱᱤᱭᱟᱹ ᱨᱮ ᱞᱟᱦᱟ ᱤᱫᱤ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱠᱟᱱᱟ ᱾ ᱟᱞᱮᱭᱟᱜ ᱡᱚᱥ ᱫᱚ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ— ᱟᱵᱚᱣᱟᱜ ᱢᱟᱨᱮ ᱜᱮᱭᱟᱱ, ᱥᱟᱶᱦᱮᱫ, ᱟᱨ ᱨᱟᱭ-ᱨᱤᱛ ᱠᱚ ᱱᱟᱣᱟ ᱡᱩᱜᱽ ᱨᱮᱱᱟᱜ AI (Artificial Intelligence) ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ ᱡᱤᱭᱟᱹᱲ ᱫᱚᱦᱚ ᱾"
    : "SantalGPT is a dedicated initiative aimed at advancing the Santali language and culture within the digital world. Our mission is to preserve and revitalize our ancient wisdom, literature, and traditions by integrating them with modern Artificial Intelligence (AI) technology.";

  const missionContent = scriptMode === 'olchiki' ? [
    {
      title: "ᱯᱟᱹᱨᱥᱤ ᱡᱤᱭᱟᱹᱲ",
      description: "ᱥᱟᱱᱛᱟᱲᱤ ᱨᱚᱱᱚᱲ ᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫ ᱥᱟᱹᱨᱤ ᱰᱤᱡᱤᱴᱟଲ ᱜᱚᱲᱚᱭ ᱮᱢᱟ ᱾"
    },
    {
      title: "ᱞᱟᱠᱪᱟᱨ ᱡᱟᱣᱨᱟ",
      description: "ᱟᱵᱚᱣᱟᱜ ᱥᱟᱶᱦᱮᱫ ᱟᱨ ᱞᱟᱭ-ᱞᱟᱠᱪᱟᱨ ᱠᱚ ᱡᱮᱜᱮᱛ ᱡᱟᱠᱟᱛ ᱨᱮ ᱩᱨᱩᱢ ᱚᱪᱚ ᱾"
    },
    {
      title: "ᱥᱮᱪᱮᱫ ᱜᱚᱲᱟ",
      description: "ᱱᱟᱣᱟ ᱯᱤᱲᱦᱤ ᱨᱤᱱ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱠᱩᱠᱞᱤ-ᱛᱮᱞᱟ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱟᱞᱜᱟ ᱦᱚᱨᱟ ᱾"
    }
  ] : [
    {
      title: "Language Preservation",
      description: "Providing authentic digital support for Santali grammar and the Ol Chiki script to ensure our language thrives in the tech age."
    },
    {
      title: "Cultural Archiving",
      description: "Showcasing our rich literature and heritage to a global audience, ensuring our identity is recognized worldwide."
    },
    {
      title: "Educational Empowerment",
      description: "Creating an accessible platform for students and the new generation to engage in Q&A and learning, entirely in Santali."
    }
  ];

  const teamContent = scriptMode === 'olchiki'
    ? "ᱥᱟᱱᱛᱟᱲGPT ᱴᱤᱢ ᱫᱚ ᱥᱟᱱᱛᱟᱲ ᱥᱟᱶᱛᱟ ᱨᱮᱱᱟᱜ ᱥᱮᱵᱟ ᱟᱨ ᱟᱵᱚᱣᱟᱜ ᱩᱯᱨᱩᱢ ᱵᱟᱧᱪᱟᱣ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱜᱮ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱾"
    : "The SantalGPT team is committed to serving the Santal community and safeguarding our unique identity through innovation.";

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-earthyGreen hover:text-earthyGreen/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-olChiki">
          {scriptMode === 'olchiki' ? 'ᱛᱟᱭᱚᱢ ᱥᱮᱫ' : 'Back'}
        </span>
      </button>

      {/* About Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <img src="/santal-gpt.png" alt="SantalGPT" className="w-20 h-20 object-contain rounded-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-earthyGreen font-olChiki mb-2">
              SantalGPT
            </h1>
            <p className="text-gray-600 -mt-2">
              The Brain of Santal
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-earthyGreen font-olChiki mb-4">
              {scriptMode === 'olchiki' ? 'ᱟᱢᱟᱸᱨ ᱵᱟᱵᱚᱛ' : 'About Us'}
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify font-olChiki text-base">
              {introductionContent}
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-earthyGreen font-olChiki mb-4">
              {scriptMode === 'olchiki' ? 'ᱟᱞᱮᱭᱟᱜ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ' : 'Our Mission'}
            </h2>
            <div className="space-y-4">
              {missionContent.map((item, index) => (
                <div key={index} className="p-4 bg-earthyGreen/5 rounded-lg border-l-4 border-earthyGreen">
                  <h3 className="font-semibold text-earthyGreen font-olChiki mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 font-olChiki">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Statement */}
          <div className="mt-8 p-6 bg-earthyGreen/10 rounded-xl border border-earthyGreen/20">
            <p className="text-gray-700 italic font-olChiki text-center">
              "{teamContent}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
