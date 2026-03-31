import { useEffect, useState } from 'react'
import { Trophy, Medal, TrendingUp, Filter, Search, Users } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'
import { LayoutDashboard, Briefcase } from 'lucide-react'

const studentNav = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]
const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

const STATUS_COLORS = {
  placed: 'bg-emerald-500/20 text-emerald-300',
  selected: 'bg-green-500/20 text-green-300',
  interview: 'bg-yellow-500/20 text-yellow-300',
  shortlisted: 'bg-blue-500/20 text-blue-300',
  applied: 'bg-slate-700 text-slate-400',
  unplaced: 'bg-slate-800 text-slate-500',
}

export default function LeaderboardPage() {
  const [data, setData] = useState([])
  const [filtered, setFiltered] = useState([])
  const [depts, setDepts] = useState([])
  const [dept, setDept] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('student')

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('prepulse-auth') || '{}')
    setRole(auth?.state?.user?.role || 'student')
    Promise.all([
      api.get('/leaderboard'),
      api.get('/departments'),
    ]).then(([l, d]) => {
      setData(l.data)
      setFiltered(l.data)
      setDepts(d.data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let res = data
    if (dept) res = res.filter(s => s.department === dept)
    if (search) res = res.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase()))
    // Re-rank after filter
    setFiltered(res.map((s, i) => ({ ...s, rank: i + 1 })))
  }, [dept, search, data])

  const navItems = role === 'admin' ? adminNav : studentNav

  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)

  const ScoreBar = ({ score }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: 3, background: score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : score >= 40 ? '#F59E0B' : '#EF4444', transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : score >= 40 ? '#F59E0B' : '#EF4444', minWidth: 36 }}>{score}</span>
    </div>
  )

  return (
    <Layout navItems={navItems}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Placement Leaderboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Ranked by placement readiness score</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            {filtered.length} students
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input-field pl-10 text-sm" placeholder="Search by name or dept..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field text-sm w-44" value={dept} onChange={e => setDept(e.target.value)}>
            <option value="">All Departments</option>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading leaderboard...</div>
        ) : (
          <>
            {/* Top 3 podium */}
            {top3.length >= 3 && (
              <div className="glass-card p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Top Performers</p>
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd place */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">{top3[1]?.name?.charAt(0)}</div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white truncate max-w-24">{top3[1]?.name}</p>
                      <p className="text-xs text-slate-500">{top3[1]?.department}</p>
                    </div>
                    <div className="w-full h-20 rounded-t-xl flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.15)', border: '1px solid rgba(148,163,184,0.2)' }}>
                      <div className="text-center">
                        <Medal className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-300">{top3[1]?.readiness_score}</p>
                      </div>
                    </div>
                  </div>
                  {/* 1st place */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500/40 flex items-center justify-center text-white font-bold text-xl">{top3[0]?.name?.charAt(0)}</div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white truncate max-w-24">{top3[0]?.name}</p>
                      <p className="text-xs text-slate-500">{top3[0]?.department}</p>
                    </div>
                    <div className="w-full h-28 rounded-t-xl flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}>
                      <div className="text-center">
                        <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-yellow-400">{top3[0]?.readiness_score}</p>
                      </div>
                    </div>
                  </div>
                  {/* 3rd place */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">{top3[2]?.name?.charAt(0)}</div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white truncate max-w-24">{top3[2]?.name}</p>
                      <p className="text-xs text-slate-500">{top3[2]?.department}</p>
                    </div>
                    <div className="w-full h-14 rounded-t-xl flex items-center justify-center" style={{ background: 'rgba(180,114,28,0.1)', border: '1px solid rgba(180,114,28,0.2)' }}>
                      <div className="text-center">
                        <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-amber-600">{top3[2]?.readiness_score}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full table */}
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Dept</th>
                    <th className="text-right py-3 px-4">CGPA</th>
                    <th className="text-right py-3 px-4">Skills</th>
                    <th className="text-right py-3 px-4">Applied</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((s) => (
                    <tr key={s.student_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`text-sm font-bold ${s.rank === 1 ? 'text-yellow-400' : s.rank === 2 ? 'text-slate-300' : s.rank === 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : `#${s.rank}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-xs text-white font-bold flex-shrink-0">{s.name?.charAt(0)}</div>
                          <span className="font-medium text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">{s.department}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-white">{s.cgpa?.toFixed(2) || '—'}</td>
                      <td className="py-3 px-4 text-right text-slate-300">{s.skills_count}</td>
                      <td className="py-3 px-4 text-right text-slate-300">{s.applications_count}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.placement_status] || STATUS_COLORS.unplaced}`}>
                          {s.placement_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ScoreBar score={s.readiness_score} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Score legend */}
            <div className="glass-card p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Readiness Score Breakdown</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-400">
                <div>CGPA × 3 <span className="text-slate-500">→ max 30 pts</span></div>
                <div>Skills × 4 <span className="text-slate-500">→ max 30 pts</span></div>
                <div>Certifications × 5 <span className="text-slate-500">→ max 15 pts</span></div>
                <div>Applications × 5 <span className="text-slate-500">→ max 15 pts</span></div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
