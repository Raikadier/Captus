import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Sparkles, Plus, Menu } from 'lucide-react'

export default function ChatBotPage() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nueva conversación', lastMessage: '¡Hola! Soy Captus AI...', timestamp: new Date() },
  ])
  const [activeConversation, setActiveConversation] = useState(1)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! Soy Captus AI, tu asistente personal de productividad académica. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: `Entiendo que dijiste: "${userMessage.content}". Como tu asistente de productividad académica, puedo ayudarte con:\n\n• Gestión de tareas y organización\n• Técnicas de estudio efectivas\n• Mantener tu racha de productividad\n• Consejos para superar la procrastinación\n\n¿Qué te gustaría explorar?`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    const newConv = {
      id: Date.now(),
      title: 'Nueva conversación',
      lastMessage: '',
      timestamp: new Date(),
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveConversation(newConv.id)
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: '¡Hola! Soy Captus AI, tu asistente personal de productividad académica. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {showSidebar && (
        <div className="w-[260px] bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleNewConversation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
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
                className={`w-full text-left p-3 rounded-xl mb-1 transition-all duration-200 hover:scale-[1.02] ${
                  activeConversation === conv.id ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm truncate">{conv.title}</p>
                <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center animate-pulse">
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
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 mb-6 animate-in fade-in slide-in-from-bottom duration-300 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110 ${
                    message.type === 'bot' ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-green-600'
                  }`}
                >
                  {message.type === 'bot' ? <Sparkles className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                </div>

                <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                  <div
                    className={`inline-block max-w-[85%] transition-all duration-200 hover:shadow-md ${
                      message.type === 'user' ? 'bg-green-600/10 border-l-4 border-green-600' : 'bg-white border-l-4 border-green-500'
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
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-4 mb-6 animate-in fade-in duration-300">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border-l-4 border-green-500 rounded-xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none shadow-sm transition-all duration-200 focus:shadow-md"
                  rows={1}
                  disabled={isLoading}
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Captus AI puede cometer errores. Verifica la información importante.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
