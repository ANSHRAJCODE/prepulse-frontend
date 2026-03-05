import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, User, Briefcase, FileText, Brain, Loader2, Clock } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
]

const STATUS_CONFIG = {
  applied: { color: 'bg-blue-500/20 text-blue-300', label: 'Applied' },
  shortlisted: { color: 'bg-yellow-500/20 text-yellow-300', label: 'Shortlisted' },
  interview: { color: 'bg-violet-500/20 text-violet-300', label: 'Interview' },
  selected: { color: 'bg-emerald-500/20 text-emerald-300', label: 'Selected' },
  placed: { color: 'bg-emerald-500/20 text-emerald-300', label: 'Placed' },
  rejected: { color: 'bg-red-500/20 text-red-300', label: 'Not Selected' },
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => setApps(data)).finally(() => setLoading(false))
  }, [])

  return (
    <Layout navItems={navItems}>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
          <p className="text-slate-400 text-sm mt-1">{apps.length} total applications</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
        ) : apps.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400">No applications yet</p>
            <Link to="/jobs" className="text-brand-400 text-sm hover:text-brand-300 mt-2 block">Browse open jobs →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map(app => {
              const sc = STATUS_CONFIG[app.status] || { color: 'bg-slate-700 text-slate-300', label: app.status }
              const matchColor = app.match_percentage >= 75 ? 'text-emerald-400 bg-emerald-500' :
                app.match_percentage >= 50 ? 'text-yellow-400 bg-yellow-500' : 'text-red-400 bg-red-500'

              return (
                <div key={app.id} className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-white">Job #{app.job_id}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.color}`}>{sc.label}</span>
                      </div>

                      {/* Match bar */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${matchColor.split(' ')[1]}`}
                            style={{ width: `${app.match_percentage}%` }} />
                        </div>
                        <span className={`text-sm font-bold ${matchColor.split(' ')[0]}`}>{app.match_percentage}%</span>
                      </div>

                      {/* Missing skills */}
                      {app.missing_skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="text-xs text-slate-500">Missing:</span>
                          {app.missing_skills.map((s, i) => <span key={i} className="skill-tag-missing">{s}</span>)}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link to={`/jobs/${app.job_id}`} className="btn-secondary text-xs px-3 py-2">
                        View Job
                      </Link>
                      {app.missing_skills?.length > 0 && (
                        <Link to={`/student/roadmap/${app.job_id}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 border border-brand-500/30 transition-colors">
                          <Brain className="w-3.5 h-3.5" /> AI Plan
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
