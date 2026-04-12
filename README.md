# SantalGPT - AI for the Santali Community

A modern, responsive web UI designed specifically for the Santali community, featuring full Ol Chiki script support and cultural authenticity.

## 🌿 Features

- **Ol Chiki Script Support**: Full rendering support for the Ol Chiki writing system with Google Fonts
- **Script Switcher**: Toggle between Ol Chiki and Latin scripts seamlessly
- **Voice Input**: Web Speech API integration for voice-based input
- **Message Editing**: Long-press (mobile) or right-click (desktop) to edit sent messages
- **Chat History**: Persistent conversation history using localStorage
- **Learning Resources**: Curated Santali language and cultural resources
- **Responsive Design**: Mobile-first design optimized for Android APK wrapping
- **Cultural Design**: Nature & Tradition theme with earthy colors and mandala patterns

## 🎨 Design Language

### Color Palette
- **Earthy Green**: `#2D5A27` - Primary color representing nature
- **Terracotta**: `#C05A2E` - Accent color representing tradition
- **Cream**: `#F9F7F2` - Soft background color

### Typography
- **Primary Font**: Noto Sans Ol Chiki (Google Fonts)
- **Fallback**: Sans-serif

### Visual Elements
- Subtle mandala/handloom pattern watermark
- Traditional geometric SVG patterns
- Culturally inspired icons and decorations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip (for backend)
- Google AI Studio API Key (free from https://aistudio.google.com/)

### Quick Setup

**1. Setup Backend (AI API):**

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your Google AI API key
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**2. Setup Frontend (Web UI):**

```bash
npm install
npm run dev
```

**3. Open your browser and navigate to `http://localhost:5173`**

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
SantalGPT/
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # FastAPI app with Gemini AI
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment template
│   └── README.md                 # Backend documentation
├── src/
│   ├── components/
│   │   ├── BackgroundPattern.jsx    # Mandala watermark SVG
│   │   ├── ChatContainer.jsx        # Scrollable message area
│   │   ├── Header.jsx               # Logo, script switcher, help
│   │   ├── InputBar.jsx             # Text input + voice input
│   │   ├── MessageBubble.jsx        # Individual message component
│   │   └── Sidebar.jsx              # Chat history + resources
│   ├── context/
│   │   └── ScriptContext.jsx        # Ol Chiki/Latin toggle state
│   ├── data/
│   │   └── learningResources.js     # Santali learning links
│   ├── hooks/
│   │   └── useChatHistory.js        # localStorage persistence
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template with font link
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── vite.config.js                   # Vite configuration
├── package.json                     # Dependencies
├── SETUP_GUIDE.md                   # Complete setup guide
└── README.md                        # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Web Speech API**: Voice input functionality

### Backend
- **FastAPI**: Modern Python web framework
- **Google Gemini AI**: AI model (gemini-1.5-flash)
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

## 📱 Mobile Optimization

The application is fully responsive and optimized for:
- Mobile devices (Android/iOS)
- Tablet devices
- Desktop browsers
- Android APK wrapping (using WebView)

### Mobile Features
- Touch-friendly button sizes (min 44px)
- Safe area insets for notched devices
- Collapsible sidebar with overlay
- Optimized viewport settings

## 🎯 Key Components

### ScriptContext
Manages the Ol Chiki/Latin script toggle with localStorage persistence.

### useChatHistory Hook
Handles all chat persistence operations:
- Create new conversations
- Add messages
- Load previous chats
- Delete conversations
- Auto-generate chat titles

### InputBar
Features:
- Text input with dynamic placeholders
- Voice input with Web Speech API
- Keyboard shortcuts (Enter to send)
- Recording state indicators

### MessageBubble
Features:
- **Mobile**: Long-press (500ms hold) to open edit menu
- **Desktop**: Hover over message to reveal Edit and Copy buttons
- Inline editing mode with save/cancel
- Edit history indicator "(edited)"
- Copy to clipboard with toast notification
- Smooth animations for hover menu

### Sidebar
Includes:
- Recent conversation history
- New chat creation
- Chat deletion
- Santali learning resources with category filtering

## 🔮 Future Enhancements

- [ ] Integration with actual AI backend API
- [ ] Better Santali language model for responses
- [ ] Offline support with service workers
- [ ] Multi-language support (Santali, Hindi, English)
- [ ] Dark mode toggle
- [ ] Export chat conversations
- [ ] Share learning resources

## 📄 License

This project is built for the Santali community to preserve and promote Santali language and culture.

## 🙏 Acknowledgments

- **Noto Sans Ol Chiki**: Google Fonts for Ol Chiki script support
- **Raghunath Murmu**: Creator of the Ol Chiki script (1925)
- **Santali Community**: For inspiration and cultural heritage

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱫᱚ ᱡᱤᱣᱤᱫ ᱛᱟᱦᱮᱸᱱᱟ!** (Long live the Santali language!)
