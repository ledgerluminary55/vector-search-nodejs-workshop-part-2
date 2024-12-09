import { useState, useRef, useEffect } from 'react'

const BACKEND_URL = 'http://localhost:3001'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return

    const userMessageId = Date.now().toString()
    const assistantMessageId = (Date.now() + 1).toString()

    const newUserMessage = {
      id: userMessageId,
      role: 'user',
      content: input,
    }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: input })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: assistantMessageId, role: 'assistant', content: '' }
      ])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let partialMessage = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        partialMessage += decoder.decode(value, { stream: true })

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: partialMessage }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error streaming from backend:', error)
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Oops! Something went wrong. Please try again.'
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3/4 p-3 rounded-lg text-left ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-700">
        <div className="flex items-center space-x-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the Star Wars universe..."
            className="flex-grow p-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
