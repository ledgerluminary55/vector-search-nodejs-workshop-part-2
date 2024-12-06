import { useState, useRef, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() === '') return

    const newUserMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const newAIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'May the Force be with you! How can I assist you with Star Wars information today?',
      }
      setMessages((prevMessages) => [...prevMessages, newAIMessage])
    }, 1000)
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
              className={`max-w-3/4 p-3 rounded-lg ${
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
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

