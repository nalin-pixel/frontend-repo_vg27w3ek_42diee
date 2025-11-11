import React, { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'

function Header({ dark, onToggleTheme }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-orange-400" />
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Aura Chat
        </h1>
      </div>
      <button
        onClick={onToggleTheme}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-orange-400" />
        {dark ? 'Dark' : 'Light'}
      </button>
    </div>
  )
}

function Tabs({ active, onChange }) {
  const items = [
    { key: 'chat', label: 'AI Chat' },
    { key: 'monitor', label: 'Ambient Agent Monitoring' },
  ]
  return (
    <div className="px-4 sm:px-6">
      <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 p-1 bg-white/70 dark:bg-gray-900/60 backdrop-blur">
        {items.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative flex-1 rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition ${
              active === t.key
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {active === t.key && (
              <span className="absolute inset-0 -z-0 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-orange-400/20 dark:from-purple-500/25 dark:via-blue-500/25 dark:to-orange-400/25" />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="relative h-[260px] sm:h-[340px] md:h-[420px] w-full overflow-hidden rounded-2xl">
      <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent dark:from-gray-950/60 dark:via-gray-950/30" />
    </div>
  )
}

function ChatBubble({ role, content, time }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-1`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
          : 'bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100'
      }`}>
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        {time && (
          <div className={`mt-1 text-[10px] ${isUser ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>{time}</div>
        )}
      </div>
    </div>
  )
}

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI copilot. Ask me anything ✨', time: new Date().toLocaleTimeString() },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = async ()n  => {
    if (!input.trim() || thinking) return
    const userMsg = { role: 'user', content: input.trim(), time: new Date().toLocaleTimeString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)

    // Simulated AI response
    setTimeout(() => {
      const response = {
        role: 'assistant',
        content: `You said: "${userMsg.content}"\n\nHere\'s a concise answer placeholder. Connect your backend when ready.`,
        time: new Date().toLocaleTimeString(),
      }
      setMessages((m) => [...m, response])
      setThinking(false)
    }, 900)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 p-3 sm:p-4 backdrop-blur">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} time={m.time} />
        ))}
        {thinking && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Assistant is thinking…</div>
        )}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Type a message…"
          className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60"
        />
        <button
          onClick={send}
          className="h-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-orange-400 px-4 text-sm font-medium text-white shadow hover:brightness-105 active:brightness-110 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function LogItem({ level, message, time, meta }) {
  const color = useMemo(() => {
    switch (level) {
      case 'info':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900'
      case 'warn':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900'
      case 'error':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900'
      default:
        return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 border-gray-200/60 dark:border-gray-800'
    }
  }, [level])

  return (
    <div className={`rounded-xl border ${color} p-3 text-xs sm:text-sm`}>      
      <div className="flex items-center justify-between">
        <span className="font-medium capitalize">{level}</span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">{time}</span>
      </div>
      <div className="mt-1 text-gray-900 dark:text-gray-100">{message}</div>
      {meta && (
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/5 dark:bg-white/5 p-2 text-[10px] text-gray-700 dark:text-gray-300">{JSON.stringify(meta, null, 2)}</pre>
      )}
    </div>
  )
}

function Monitor() {
  const [stream, setStream] = useState(true)
  const [logs, setLogs] = useState(() => [
    { level: 'info', message: 'Agent initialized', time: new Date().toLocaleTimeString(), meta: { session: crypto.randomUUID().slice(0, 8) } },
    { level: 'info', message: 'Listening for user intent', time: new Date().toLocaleTimeString() },
  ])
  const listRef = useRef(null)

  useEffect(() => {
    if (!stream) return
    const iv = setInterval(() => {
      const sample = [
        { level: 'info', message: 'Heartbeat OK', meta: { latency_ms: Math.floor(Math.random() * 30) + 10 } },
        { level: 'warn', message: 'ASR confidence dipped', meta: { confidence: +(0.7 + Math.random() * 0.2).toFixed(2) } },
        { level: 'info', message: 'Tool call success', meta: { tool: 'search', took_ms: 120 + Math.floor(Math.random() * 80) } },
        { level: 'error', message: 'Vendor API timeout', meta: { retry_in: '2s' } },
      ]
      const item = sample[Math.floor(Math.random() * sample.length)]
      setLogs((l) => [
        ...l,
        { ...item, time: new Date().toLocaleTimeString() },
      ])
    }, 2000)
    return () => clearInterval(iv)
  }, [stream])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [logs])

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStream((s) => !s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              stream
                ? 'border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300'
            }`}
          >
            {stream ? 'Streaming' : 'Paused'}
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">Agent telemetry and events</span>
        </div>
        <button
          onClick={() => setLogs([])}
          className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white underline-offset-2 hover:underline"
        >
          Clear
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 p-3 sm:p-4 backdrop-blur space-y-2">
        {logs.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No logs yet.</div>
        ) : (
          logs.map((l, i) => <LogItem key={i} {...l} />)
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('chat')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [dark])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <Header dark={dark} onToggleTheme={() => setDark((d) => !d)} />

      <div className="px-4 sm:px-6">
        <Hero />
      </div>

      <div className="mt-6">
        <Tabs active={active} onChange={setActive} />
      </div>

      <div className="mx-auto mt-4 w-full max-w-4xl px-4 sm:px-6 pb-10">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-4 sm:p-6 backdrop-blur">
          {active === 'chat' ? (
            <div className="h-[480px]">
              <Chat />
            </div>
          ) : (
            <div className="h-[480px]">
              <Monitor />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
