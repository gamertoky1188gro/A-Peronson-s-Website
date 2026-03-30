/*
  Component: FloatingAssistant (global)

  Routes impacted:
    - Renders on most routes (AppLayout always mounts it).
    - Special visual mode on /help: "Orb" styling (glass + conic ring) via `assistant-orb-btn`.

  Purpose:
    - Provide a persistent AI/help assistant UI as a slide-in panel.
    - Connects to backend WebSocket (`/ws`) to stream answers.

  Key behaviors:
    - Floating button toggles the panel.
    - Messages list auto-scrolls on new messages.
    - Optional typewriter effect for new assistant messages (UI polish).

  Key backend:
    - WebSocket URL derived from API_BASE (http -> ws, /api -> /ws)
    - Message protocol expects { type: 'ask', question } and replies with { type: 'reply', answer }
*/
import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { API_BASE } from '../lib/auth'
import { Bot } from 'lucide-react'

/**
 * Helper component to simulate typing effect
 */
function TypewriterText({ text, speed = 20, onComplete }) {
  // `displayedText` grows one character at a time to mimic typing.
  const [displayedText, setDisplayedText] = useState('')
  // Current character index that has been "typed".
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // If we still have characters left, schedule the next tick.
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      // Once typing finishes, notify parent so it can mark the message as no longer "new".
      onComplete()
    }
  }, [index, text, speed, onComplete])

  return <span>{displayedText}</span>
}

export default function FloatingAssistant() {
  // Used to detect current route; we enable a special "orb" skin on /help only.
  const location = useLocation()
  const orbMode = location.pathname === '/help'
  // Whether the slide-in panel is visible.
  const [open, setOpen] = useState(false)
  // Controlled input for the message composer.
  const [input, setInput] = useState('')
  // Chat transcript (simple array of { role, text, isNew }).
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: 'Hello! I am your GarTex Assistant (WS). How can I help you with your textile business today?',
      isNew: false 
    }
  ])
  // "Thinking" state: drives typing indicator dot and disables sending duplicates.
  const [loading, setLoading] = useState(false)
  // Refs:
  // - scrollRef: DOM element for scrolling message list to bottom
  // - socketRef: WebSocket instance reused across renders
  const scrollRef = useRef(null)
  const socketRef = useRef(null)

  // Initialize WebSocket connection
  useEffect(() => {
    // Derive the WS endpoint from API_BASE:
    // - If API_BASE is absolute (http/https), swap scheme to ws/wss and map /api -> /ws.
    // - Otherwise, use current origin and `/ws`.
    const wsUrl = (() => {
      if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
        return API_BASE.replace(/^http/, 'ws').replace(/\/api\/*$/, '/ws')
      }
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${protocol}//${window.location.host}/ws`
    })()
    const socket = new WebSocket(wsUrl)

    // Basic lifecycle logging (useful during dev).
    socket.onopen = () => console.log('Assistant WS Connected')
    socket.onmessage = (event) => {
      // Server sends JSON messages. We expect { type: 'reply' | 'error', ... }.
      const data = JSON.parse(event.data)
      if (data.type === 'reply') {
        const botMsg = { 
          role: 'assistant', 
          text: data.answer || 'I am sorry, I could not find an answer to that.',
          isNew: true 
        }
        // Append assistant message to transcript and stop loading indicator.
        setMessages(prev => [...prev, botMsg])
        setLoading(false)
      } else if (data.type === 'error') {
        // Surface server errors as assistant messages so the UI stays consistent.
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: 'Error: ' + (data.message || 'Something went wrong'),
          isNew: true 
        }])
        setLoading(false)
      }
    }
    socket.onclose = () => console.log('Assistant WS Disconnected')
    socket.onerror = (err) => console.error('Assistant WS Error', err)

    // Store socket in ref so `handleSend` can use it without re-creating listeners.
    socketRef.current = socket

    return () => {
      // Cleanly close connection on unmount.
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    // Ensures latest message is visible without user needing to scroll.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  async function handleSend(textOverride) {
    // Allow sending from quick suggestions or from input box.
    const text = textOverride || input
    if (!text.trim() || loading) return

    // Add the user's message to transcript immediately for snappy UX.
    const userMsg = { role: 'user', text, isNew: false }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Send the question over WS if connected; otherwise show a recoverable error message.
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'ask', question: text }))
    } else {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Connection lost. Please refresh the page.',
        isNew: true 
      }])
      setLoading(false)
    }
  }

  // After the typewriter effect finishes, mark the message as "old" so it renders as plain text next time.
  function markAsOld(msgIndex) {
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, isNew: false } : m))
  }

  // Quick-start suggestion prompts (shown when the assistant is fresh / not busy).
  const suggestions = [
    "How do I verify my account?",
    "Tell me about Premium benefits",
    "How do contracts work?",
    "Need help with onboarding"
  ]

  return (
    <>
      {/* Floating launcher button (bottom-right). */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className={[
            'w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl transition-transform active:scale-95',
            orbMode
              ? 'assistant-orb-btn hover:scale-110'
              : 'bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] shadow-xl hover:scale-110 ring-2 ring-white/20',
          ].join(' ')}
          aria-label="Toggle assistant"
        >
          {open ? 'X' : <Bot size={22} />}
        </button>
      </div>

      {/* Slide-in drawer panel (off-canvas). */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-100 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header: title + live status (thinking/live) + close button. */}
        <div className="p-4 bg-[#0A66C2] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold backdrop-blur-sm">AI</div>
            <div>
              <p className="font-bold tracking-tight">GarTex Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                <p className="text-[10px] uppercase tracking-wider text-sky-100 font-semibold">
                  {loading ? 'Thinking...' : 'Live Guidance'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors w-8 h-8 flex items-center justify-center">
            X
          </button>
        </div>

        {/* Transcript: scrollable list of chat bubbles. */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#0A66C2] text-white rounded-tr-none shadow-blue-100 shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.role === 'assistant' && msg.isNew ? (
                  <TypewriterText 
                    text={msg.text} 
                    onComplete={() => markAsOld(i)} 
                  />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            // Typing indicator bubble shown while awaiting server reply.
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Composer/footer: quick suggestions + input + send button. */}
        <div className="p-4 border-t bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          {messages.length < 3 && !loading && (
            // Quick suggestion chips appear early to guide first-time users.
            <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(s)}
                  className="text-[11px] bg-sky-50 text-[#0A66C2] border border-sky-100 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-all hover:scale-105 active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] transition-all placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:bg-[#004182] hover:shadow-lg active:scale-90 shrink-0"
            >
              <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
            GarTex Hub Intelligence - WebSocket Powered
          </p>
        </div>
      </div>
    </>
  )
}

