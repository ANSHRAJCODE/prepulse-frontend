import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2, LayoutDashboard, Briefcase, Trophy, Brain } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/ai-advisor', label: 'AI Advisor', icon: Brain },
]

const STARTERS = [
  'What skills should I learn for a software engineering role?',
  'How can I improve my placement readiness score?',
  'What are the best certifications for a CSE student?',
  'How to prepare for technical interviews at TCS or Infosys?',
  'What projects should I build to stand out in placements?',
]

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your PrepPulse AI Advisor. I can help you with placement preparation, skill-building strategies, interview tips, and career guidance. What would you like to know?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    api.get('/students/profile').then(r => setProfile(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    try {
      const systemPrompt = `You are PrepPulse AI Advisor — a helpful placement and career advisor for engineering students in India. 
${profile ? `The student you are advising: Name: ${profile.user?.full_name}, Department: ${profile.department}, CGPA: ${profile.cgpa}, Skills: ${(profile.skills || []).join(', ')}, Placement Status: ${profile.placement_status || 'unplaced'}.` : ''}
Give practical, specific, actionable advice. Keep responses concise (3-5 sentences or bullet points). Focus on: skill development, placement preparation, interview tips, resume building, and career guidance for Indian engineering students targeting companies like TCS, Infosys, Wipro, Cognizant, Amazon, Google, and startups. Never mention you are Claude or made by Anthropic.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.slice(1).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        })
      })

      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Sorry, I could not process that. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="max-w-4xl mx-auto h-full flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Placement Advisor</h1>
            <p className="text-slate-400 text-xs">Powered by Claude · Personalised to your profile</p>
          </div>
          {profile && (
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Advising {profile.user?.full_name?.split(' ')[0]} · {profile.department}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="glass-card flex-1 overflow-y-auto p-5 space-y-4 mb-4" style={{ minHeight: 0 }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'assistant' ? 'bg-indigo-500/20' : 'bg-slate-700'}`}>
                {m.role === 'assistant' ? <Bot className="w-4 h-4 text-indigo-400" /> : <User className="w-4 h-4 text-slate-400" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-slate-800/60 text-slate-200 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}
                style={{ whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="bg-slate-800/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-slate-400 text-sm">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Starter prompts */}
        {messages.length === 1 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {STARTERS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            className="input-field flex-1 text-sm"
            placeholder="Ask anything about placements, skills, interviews..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            className="btn-primary px-4 py-2 disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}
