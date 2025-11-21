// ChatBotPage - Equivalent to frmBot.cs
// AI-powered chat interface with conversation history
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Plus, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ChatBotPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nueva conversación', lastMessage: '¡Hola! Soy Captus AI...', timestamp: new Date() },
  ]);
  const [activeConversation, setActiveConversation] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! Soy Captus AI, tu asistente personal de productividad académica. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  // Access environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!user) {
       // Fallback if user is not loaded, though AuthGuard should handle this
       const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Error: No se ha identificado al usuario. Por favor inicia sesión nuevamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed, though the backend might rely on the body userId for now or token in cookie
          // However, the middleware typically expects Bearer token.
          // Let's assume we need to send the token if available in localStorage or via Supabase session
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          userId: user.id // UUID from AuthContext
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // The backend returns { result: "string response" }
      const botResponseContent = data.result;

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    const newConv = {
      id: Date.now(),
      title: 'Nueva conversación',
      lastMessage: '',
      timestamp: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv.id);
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: '¡Hola! Soy Captus AI, tu asistente personal de productividad académica. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleNewConversation}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                <span className="font-medium">Nueva conversación</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-xl mb-1 transition-all duration-200 ${
                    activeConversation === conv.id ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm truncate">{conv.title}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Captus AI</h1>
                <p className="text-xs text-gray-500">Tu asistente académico</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-4 mb-6 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      message.type === 'bot' ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-green-600'
                    }`}
                  >
                    {message.type === 'bot' ? (
                      <Sparkles className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                    <div
                      className={`inline-block max-w-[85%] ${
                        message.type === 'user'
                          ? 'bg-green-600/10 border-l-4 border-green-600'
                          : 'bg-card border-l-4 border-green-500'
                      } rounded-xl p-4 shadow-sm`}
                    >
                      <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-4 mb-6"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-card border-l-4 border-green-500 rounded-xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                      className="w-2 h-2 bg-green-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      className="w-2 h-2 bg-green-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      className="w-2 h-2 bg-green-600 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none shadow-sm transition-all duration-200"
                  rows="1"
                  disabled={isLoading}
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Captus AI puede cometer errores. Verifica la información importante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
