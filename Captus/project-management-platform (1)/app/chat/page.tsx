"use client"

import { useState } from "react"
import { ArrowLeft, Send, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "¡Hola María! 👋 Soy Captus, tu asistente académico. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    const userMessage = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setInputMessage("")

    setTimeout(() => {
      const botResponses = [
        "Déjame revisar tu calendario académico. Tienes 3 tareas pendientes para esta semana.",
        "Claro, puedo ayudarte con eso. ¿Necesitas que te ayude a organizar tu tiempo de estudio?",
        "Según tus notas, el examen de Cálculo III es el 28 de octubre a las 10:00 AM.",
        "He agregado un recordatorio para tu presentación de Historia. Te avisaré con 24 horas de anticipación.",
        "¿Quieres que te sugiera una estrategia de estudio para tu próximo examen?",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage = {
        id: messages.length + 2,
        content: randomResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
    }, 1000)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div className="flex items-center">
          <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
            <BookOpen className="text-white" size={20} />
          </div>
          <div className="ml-3">
            <h1 className="text-sm font-semibold text-gray-900">Captus IA</h1>
            <p className="text-xs text-green-600">Asistente Académico • En línea</p>
          </div>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col max-w-[75%]">
                <Card
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === "user" ? "bg-green-600 text-white" : "bg-white shadow-sm border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </Card>
                <span className="text-xs text-gray-500 mt-1 px-2">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Pregúntale algo a Captus..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              className="flex-1 rounded-xl border-gray-300 focus:border-green-600 focus:ring-green-600"
            />
            <Button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ""}
              className="bg-green-600 hover:bg-green-700 rounded-xl h-10 px-6"
            >
              <Send size={18} />
            </Button>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 text-center">
              Captus puede ayudarte con tareas, calendario, recordatorios y organización académica
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
