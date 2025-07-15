"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles, Calendar } from "lucide-react"
import { mockSessions } from "@/lib/mock-data"
import { geminiService } from "@/lib/gemini"
import { GeminiDebug } from "@/components/gemini-debug"
import dynamic from "next/dynamic"

const CalendarComponent = dynamic(() => import("react-calendar"), { ssr: false }) as any;

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your GDG Event Assistant powered by Gemini AI. I can help you with session information, locations, schedules, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarDate, setCalendarDate] = useState<Date | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickQuestions = [
    "What's next on my schedule?",
    "Where is the ML workshop?",
    "Show me Day 2 sessions",
  ]

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Use Gemini service with event context
      const context = {
        sessions: mockSessions,
        currentTime: new Date().toISOString(),
        eventType: "GDG Event",
      }
      
      const response = await geminiService.getInstance().generateResponse(input, context)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.text,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Gemini API error:", error)
      
      // Fallback response if Gemini fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm having trouble connecting to my AI service right now. Please try again later or check your internet connection.",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Animation for chat bubbles
  const getBubbleAnimation = (index: number) => {
    return `animate-fade-in-up` // Tailwind custom animation
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 relative">
      {/* Modern App Bar */}
      <div className="bg-gdg-blue shadow-md px-4 py-3 flex-shrink-0 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
          <img src="/placeholder-logo.png" alt="Mascot" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">GDG Assistant</h1>
          <p className="text-xs text-blue-100">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Debug Component - Remove after testing */}
      <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
        <GeminiDebug />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] md:max-w-[70%] ${
                  message.type === "user" ? "flex-row-reverse" : ""
                } ${getBubbleAnimation(idx)}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-gdg-blue ml-2" : "bg-gdg-green mr-2"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gdg-blue text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] md:max-w-[70%]">
                <div className="flex-shrink-0 w-8 h-8 bg-gdg-green rounded-full flex items-center justify-center mr-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions as scrollable chips */}
        {messages.length === 1 && (
          <div className="w-full px-2 pb-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-8 px-3 bg-white hover:bg-gray-50 rounded-full shadow"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area (floating, above nav) */}
        <div className="w-full px-2 pb-3 pt-1 sticky bottom-0 z-20 flex items-end justify-between">
          <div className="flex-1 relative bg-white rounded-full shadow-lg flex items-center px-3 py-2 mr-2 border border-gray-200">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about sessions, locations, speakers..."
              className="border-0 bg-transparent focus:ring-0 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gdg-blue hover:bg-blue-600 disabled:bg-gray-300 h-9 w-9 p-0 rounded-full flex-shrink-0 ml-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {/* Animated Calendar FAB */}
          <button
            className="bg-white shadow-lg border border-gray-200 rounded-full p-3 flex items-center justify-center fixed bottom-24 right-4 z-30 animate-float"
            onClick={() => setShowCalendar(true)}
            aria-label="Open calendar"
            style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
          >
            <Calendar className="w-6 h-6 text-gdg-blue" />
          </button>
        </div>

        {/* Animated Calendar Modal */}
        {showCalendar && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-black bg-opacity-40" onClick={() => setShowCalendar(false)}>
            <div
              className="w-full max-w-md bg-white rounded-t-2xl p-4 animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg text-gdg-blue">Pick a Date</span>
                <button className="text-gray-400 hover:text-gray-700" onClick={() => setShowCalendar(false)} aria-label="Close calendar">✕</button>
              </div>
              <CalendarComponent
                onChange={(date: Date) => setCalendarDate(date)}
                value={calendarDate || new Date()}
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Tailwind custom animations (add to your tailwind.config.js)
// .animate-fade-in-up { @apply transition-all duration-300 ease-out opacity-0 translate-y-4; animation: fadeInUp 0.3s forwards; }
// @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
// .animate-float { animation: float 2s infinite ease-in-out alternate; }
// @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-8px); } }
// .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
// @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
// .scrollbar-hide::-webkit-scrollbar { display: none; }
