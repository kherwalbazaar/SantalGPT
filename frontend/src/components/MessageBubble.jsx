import { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

const LIKES_STORAGE_KEY = 'santalgpt_message_likes';

export default function MessageBubble({ message, onEdit, onEditMessage }) {
  const isUser = message.role === 'user';
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [isEditing, setIsEditing] = useState(false);
  const [showHoverMenu, setShowHoverMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const pressTimer = useRef(null);
  const messageRef = useRef(null);

  // Load like/dislike state from localStorage
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem(LIKES_STORAGE_KEY);
      if (storedLikes) {
        const likesData = JSON.parse(storedLikes);
        const messageId = message.timestamp;
        setLiked(likesData[messageId] === 'liked');
        setDisliked(likesData[messageId] === 'disliked');
      }
    } catch (error) {
      console.error('Error loading likes from localStorage:', error);
    }
  }, [message.timestamp]);

  // Save like/dislike state to localStorage
  const saveLikeState = (state) => {
    try {
      const storedLikes = localStorage.getItem(LIKES_STORAGE_KEY);
      const likesData = storedLikes ? JSON.parse(storedLikes) : {};
      const messageId = message.timestamp;
      
      if (state === 'none') {
        delete likesData[messageId];
      } else {
        likesData[messageId] = state;
      }
      
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesData));
    } catch (error) {
      console.error('Error saving likes to localStorage:', error);
    }
  };

  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Long press handlers for mobile ONLY
  const handlePressStart = (e) => {
    // Only enable long press on touch devices
    if (!isUser || !('ontouchstart' in window)) return;
    
    const timer = setTimeout(() => {
      setShowEditMenu(true);
      setEditText(message.content);
    }, 500); // 500ms long press
    pressTimer.current = timer;
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Hover handlers for desktop
  const handleMouseEnter = () => {
    if (isUser && !('ontouchstart' in window)) {
      setShowHoverMenu(true);
    }
  };

  const handleMouseLeave = () => {
    setShowHoverMenu(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== message.content) {
      onEdit(message.timestamp, editText.trim());
    }
    setShowEditMenu(false);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setShowEditMenu(false);
    setIsEditing(false);
    setEditText(message.content);
  };

  const handleStartEdit = () => {
    if (onEditMessage) {
      onEditMessage(message.content, message.timestamp);
    }
    setShowEditMenu(false);
    setShowHoverMenu(false);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // Optional: Show a brief toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-earthyGreen text-white px-4 py-2 rounded-lg shadow-lg z-50 font-olChiki text-sm';
      toast.textContent = 'Copied!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    if (disliked) setDisliked(false);
    saveLikeState(newLikedState ? 'liked' : disliked ? 'disliked' : 'none');
  };

  const handleDislike = () => {
    const newDislikedState = !disliked;
    setDisliked(newDislikedState);
    if (liked) setLiked(false);
    saveLikeState(newDislikedState ? 'disliked' : liked ? 'liked' : 'none');
  };

  return (
    <>
      <div
        className={`flex ${isUser ? 'justify-end ml-4' : 'justify-start'} mb-4 animate-fadeIn`}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={messageRef}
      >
        <div
          className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-1 shadow-md relative ${
            isUser
              ? 'bg-gray-50 rounded-br-md'
              : 'bg-gray-100 rounded-bl-md -ml-4'
          } ${isUser && !('ontouchstart' in window) ? 'cursor-default' : ''}`}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 bg-cream border border-terracotta rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta font-olChiki text-sm resize-none"
                rows="3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelEdit();
                  }
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-olChiki flex items-center gap-1"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editText.trim()}
                  className="px-4 py-1.5 text-sm bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-olChiki flex items-center gap-1"
                >
                  📤 Send
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={`text-sm md:text-base leading-relaxed font-olChiki ${
                isUser ? 'text-gray-800' : 'text-gray-900'
              }`}>
                {message.content}
              </div>
              
              {/* Action Buttons with Timestamp */}
              <div className="flex items-center justify-between mt-2 gap-2">
                <div
                  className={`text-xs flex items-center gap-2 ${
                    isUser ? 'text-gray-500' : 'text-white/70'
                  }`}
                >
                  <span>{timestamp}</span>
                  {isUser && message.edited && (
                    <span className="text-gray-400">(edited)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!isUser && (
                    <>
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                          liked
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
                        }`}
                        title="Like"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={handleDislike}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                          disliked
                            ? 'bg-red-100 text-red-600'
                            : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                        }`}
                        title="Dislike"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleCopyMessage}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors text-gray-400 hover:text-terracotta hover:bg-gray-100`}
                    title="Copy"
                  >
                    <Copy size={14} />
                  </button>
                  {isUser && !('ontouchstart' in window) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit();
                      }}
                      className="text-gray-400 hover:text-terracotta hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                      title="Edit message"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Menu Modal */}
      {showEditMenu && !isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleCancelEdit}
        >
          <div
            className="bg-cream rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-earthyGreen mb-4 font-olChiki">
              Edit Message
            </h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-earthyGreen/20 rounded-xl focus:border-earthyGreen focus:outline-none font-olChiki text-sm md:text-base resize-none mb-4"
              rows="4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleSaveEdit();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancelEdit();
                }
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-olChiki flex items-center gap-2"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                className="px-5 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-olChiki flex items-center gap-2"
              >
                📤 Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
