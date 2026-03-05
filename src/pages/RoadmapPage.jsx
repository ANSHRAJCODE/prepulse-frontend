import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Brain, ArrowLeft, ChevronRight, ExternalLink, Clock, Target, Zap, Loader2, Wifi, WifiOff, LayoutDashboard, User, Briefcase, FileText } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
]

const STEP_COLORS = [
  { bg: 'bg-brand-500/20', border: 'border-brand-500/40', text: 'text-brand-400', num: 'bg-brand-600' },
  { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-400', num: 'bg-violet-600' },
  { bg: 'bg-pulse-500/20', border: 'border-pulse-500/40', text: 'text-pulse-400', num: 'bg-pulse-600' },
]

export default function RoadmapPage() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiStatus, setAiStatus] = useState('checking')

  useEffect(() => {
    // Check Ollama status
    api.get('/ai/status').then(({ data }) => setAiStatus(data.status)).catch(() => setAiStatus('offline'))
    
    // Get roadmap
    api.post(`/ai/roadmap/${jobId}`)
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [jobId])

  if (loading) return (
    <Layout navItems={navItems}>
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -inset-2 gradient-bg rounded-3xl opacity-30 blur-xl animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Generating Your AI Roadmap</p>
          <p className="text-slate-400 text-sm mt-1">Analyzing your skills and crafting a personalized plan...</p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </Layout>
  )

  if (!data) return (
    <Layout navItems={navItems}>
      <div className="text-center py-20 text-slate-500">
        <p>Failed to generate roadmap. Please ensure your profile is complete.</p>
        <Link to="/student/profile" className="text-brand-400 mt-2 block">Complete Profile →</Link>
      </div>
    </Layout>
  )

  const { roadmap, match_analysis, job } = data

  return (
    <Layout navItems={navItems}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link to={`/jobs/${jobId}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Your AI Learning Roadmap</h1>
              <p className="text-slate-400 text-sm">{job?.title} at {job?.company}</p>
            </div>
          </div>

          {/* AI Status — based on actual roadmap source, not just Ollama ping */}
          {(() => {
            const isReal = roadmap?._source === 'ollama'
            return (
              <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mt-2
                ${isReal ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/60 text-slate-400 border border-slate-600/40'}`}>
                {isReal ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isReal ? 'Personalized by Ollama (Llama3)' : 'Template Plan — Run Ollama locally to personalize'}
              </div>
            )
          })()}
        </div>

        {/* Match + Summary */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-4xl font-black ${
                match_analysis.match_percentage >= 75 ? 'text-emerald-400' :
                match_analysis.match_percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>{match_analysis.match_percentage}%</div>
              <p className="text-xs text-slate-500 mt-1">Current Match</p>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    match_analysis.match_percentage >= 75 ? 'bg-emerald-500' :
                    match_analysis.match_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${match_analysis.match_percentage}%` }}
                />
              </div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{roadmap.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Skills to Learn', value: match_analysis.missing_skills?.length || 0, icon: Target, color: 'text-red-400' },
              { label: 'Skills Matched', value: match_analysis.matched_skills?.length || 0, icon: Zap, color: 'text-emerald-400' },
              { label: 'Est. Duration', value: `${roadmap.estimated_weeks || 8} weeks`, icon: Clock, color: 'text-brand-400' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-3 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your 3-Step Action Plan</h2>
          {(roadmap.steps || []).map((step, i) => {
            const c = STEP_COLORS[i % STEP_COLORS.length]
            return (
              <div key={i} className={`glass-card p-5 border ${c.border}`}>
                <div className="flex items-start gap-4">
                  <div className={`${c.num} w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${c.bg} ${c.text} font-medium`}>
                          {step.skill_focus}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{step.duration}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <ul className="space-y-1.5 mt-3 mb-4">
                      {(step.actions || []).map((action, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <ChevronRight className={`w-4 h-4 ${c.text} flex-shrink-0 mt-0.5`} />
                          {action}
                        </li>
                      ))}
                    </ul>

                    {/* Resources */}
                    {step.resources?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Recommended Resources:</p>
                        <div className="flex flex-wrap gap-2">
                          {step.resources.map((res, j) => (
                            <a key={j} href={res.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700">
                              <ExternalLink className="w-3 h-3" />
                              {res.name}
                              <span className="text-slate-500">({res.type})</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestone */}
                    {step.milestone && (
                      <div className={`mt-3 flex items-center gap-2 text-xs ${c.text} ${c.bg} px-3 py-2 rounded-lg`}>
                        <Target className="w-3.5 h-3.5 flex-shrink-0" />
                        <span><strong>Milestone:</strong> {step.milestone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Final tip */}
        {roadmap.final_tip && (
          <div className="glass-card p-5 border border-brand-500/20 bg-brand-500/5">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-brand-300 mb-1">AI Tip</p>
                <p className="text-slate-300 text-sm">{roadmap.final_tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
