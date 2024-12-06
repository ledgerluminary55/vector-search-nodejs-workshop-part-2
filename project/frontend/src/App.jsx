import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Chat from './components/Chat'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Chat />
      </main>
      <Footer />
    </div>
  )
}

export default App

