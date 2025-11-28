// ChatBotPage - Equivalent to frmBot.cs
// AI-powered chat interface with conversation history
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Plus, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { aiTaskService } from '../../services/aiTaskService';
import apiClient from '../../shared/api/client';

const ChatBotPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await apiClient.get('/ai/conversations');
      const data = response.data;
      setConversations(data);
      // Automatically select the most recent conversation if available
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0].id);
      } else if (data.length === 0) {
          // If no conversations, prepare the UI for a new one, but don't select an ID yet
          setActiveConversation(null);
          setMessages([{
            id: 'intro',
            type: 'bot',
            content: '¡Hola! Soy Captus AI, tu asistente personal de productividad académica. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date(),
          }]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await apiClient.get(`/ai/conversations/${conversationId}/messages`);
      const data = response.data;
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        type: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt)
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!user) {
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
      id: 'temp-user-' + Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the service instead of direct fetch
      const data = await aiTaskService.sendMessage(userMessage.content, activeConversation);

      // If we started a new conversation, update the state
      if (!activeConversation && data.conversationId) {
        setActiveConversation(data.conversationId);
        // Refresh conversations list to show the new title
        fetchConversations();
      }

      // Check for tool action
      if (data.actionPerformed) {
        console.log('AI Performed action:', data.actionPerformed);
        // Trigger a custom event for other components to listen to (e.g., Task List)
        // This satisfies the "Update UI in real-time" requirement if components listen to it.
        window.dispatchEvent(new CustomEvent('task-update', { detail: { action: data.actionPerformed } }));

        // If we are showing tasks in this page (future), we would refresh here.
        // Currently, the text response confirms the action.
      }

      // Backend returns the AI result. We add it to the list.
      const botResponse = {
        id: 'temp-bot-' + Date.now(),
        type: 'bot',
        content: data.result,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
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
    setActiveConversation(null);
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
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
                  <p className="font-medium text-gray-900 text-sm truncate">{conv.title || 'Nueva conversación'}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                     {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
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
              <img 
                  src="/LgCP.png" 
                  alt="Logo Captus" 
                  className="w-8 h-8 rounded-lg object-cover"
              />
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
                      message.type === 'bot' ? 'bg-gradient-to-br from-primary/70 to-primary' : 'bg-primary'
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
                          ? 'bg-primary/10 border-l-4 border-primary'
                          : 'bg-card border-l-4 border-primary/50'
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
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-card border-l-4 border-primary/50 rounded-xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      className="w-2 h-2 bg-primary rounded-full"
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none shadow-sm transition-all duration-200"
                  rows="1"
                  disabled={isLoading}
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
