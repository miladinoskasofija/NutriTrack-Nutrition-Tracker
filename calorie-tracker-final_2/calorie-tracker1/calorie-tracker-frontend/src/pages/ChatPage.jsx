import { useEffect, useRef, useState } from 'react'
import apiClient from '../api/client.js'

const SUGGESTIONS = [
  'Дали внесов доволно протеини денес?',
  'Предложи ми здрава вечера',
  'Како да го намалам внесот на шеќер?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ASSISTANT', content: 'Здраво! Јас сум твојот нутритивен асистент. Прашај ме било што за твојата исхрана, цели или совети за здрави оброци.' },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    const userMessage = { role: 'USER', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsSending(true)

    try {
      const res = await apiClient.post('/chat', { message: trimmed })
      setMessages((prev) => [...prev, { role: 'ASSISTANT', content: res.data.reply }])
    } catch (err) {
      const backendMessage = err.response?.data?.message
      const fallback = err.code === 'ERR_NETWORK'
        ? 'Не можам да се поврзам со серверот. Провери дали backend-от работи.'
        : 'Извини, моментално не можам да одговорам. Пробај повторно за момент.'
      setMessages((prev) => [
        ...prev,
        { role: 'ASSISTANT', content: backendMessage || fallback },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col min-h-screen lg:min-h-0 lg:h-screen">
      <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-5 sticky top-0 z-10">
        <div className="max-w-md lg:max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Нутритивен асистент</h1>
            <p className="text-xs text-gray-500">Секогаш достапен</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md lg:max-w-2xl mx-auto w-full px-6 lg:px-10 py-6 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'USER'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="block w-full text-left text-sm text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl px-4 py-2.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-16 lg:bottom-0 bg-gray-50 pt-2 pb-2 px-6 lg:px-10 z-10"
      >
        <div className="max-w-md lg:max-w-2xl mx-auto flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Прашај нешто..."
            className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="w-9 h-9 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
