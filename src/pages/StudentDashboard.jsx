import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, User, Briefcase, BookOpen, FileText, Brain, TrendingUp, Award, Target, ArrowRight, AlertCircle } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
]

function MatchMeter({ percentage }) {
  const color = percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>Match Score</span>
        <span className={percentage >= 75 ? 'text-emerald-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/students/profile').catch(() => ({ data: null })),
      api.get('/jobs/').catch(() => ({ data: [] })),
      api.get('/applications/my').catch(() => ({ data: [] })),
    ]).then(([p, j, a]) => {
      setProfile(p.data)
      setJobs(j.data.slice(0, 4))
      setApplications(a.data)
    }).finally(() => setLoading(false))
  }, [])

  const skillCount = profile?.skills?.length || 0
  const isProfileComplete = profile?.cgpa > 0 && skillCount >= 3

  return (
    <Layout navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-slate-400 mt-1">
              {isProfileComplete
                ? `You have ${applications.length} active applications`
                : 'Complete your profile to unlock AI-powered job matching'}
            </p>
          </div>
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-2xl font-black text-white">
            {user?.full_name?.charAt(0)}
          </div>
        </div>

        {/* Profile warning */}
        {!isProfileComplete && (
          <div className="glass-card p-4 border-yellow-500/30 bg-yellow-500/5 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm flex-1">
              Your profile is incomplete. Add your CGPA, skills, and department to get accurate job matches.
            </p>
            <Link to="/student/profile" className="text-yellow-400 text-sm font-medium hover:text-yellow-300 whitespace-nowrap">
              Complete Profile →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CGPA', value: profile?.cgpa?.toFixed(2) || '—', icon: Award, color: 'text-brand-400', bg: 'bg-brand-500/10' },
            { label: 'Skills', value: skillCount, icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Applications', value: applications.length, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Placement', value: profile?.placement_status === 'placed' ? 'Placed' : 'Active', icon: Target, color: 'text-pulse-400', bg: 'bg-pulse-500/10' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Recent Applications */}
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Applications</h2>
              <Link to="/student/applications" className="text-brand-400 text-sm hover:text-brand-300">View all</Link>
            </div>
            {applications.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No applications yet</p>
                <Link to="/jobs" className="text-brand-400 text-sm hover:text-brand-300 mt-2 block">Browse open jobs →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 4).map(app => (
                  <div key={app.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Job #{app.job_id}</p>
                      <MatchMeter percentage={app.match_percentage} />
                    </div>
                    <StatusBadge status={app.status} />
                    {app.missing_skills?.length > 0 && (
                      <Link to={`/student/roadmap/${app.job_id}`}
                        className="text-xs text-brand-400 hover:text-brand-300 whitespace-nowrap flex items-center gap-1">
                        <Brain className="w-3 h-3" /> AI Plan
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills snapshot */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">My Skills</h2>
              <Link to="/student/profile" className="text-brand-400 text-sm hover:text-brand-300">Edit</Link>
            </div>
            {(profile?.skills || []).length === 0 ? (
              <p className="text-slate-500 text-sm">No skills added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            )}
            <div className="mt-5">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Open Jobs</h3>
              <div className="space-y-2">
                {jobs.map(job => (
                  <Link key={job.id} to={`/jobs/${job.id}`}
                    className="flex items-center gap-2 p-2.5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group">
                    <Briefcase className="w-4 h-4 text-slate-500 group-hover:text-brand-400" />
                    <span className="text-sm text-slate-300 group-hover:text-white truncate flex-1">{job.title}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-brand-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatusBadge({ status }) {
  const colors = {
    applied: 'bg-blue-500/20 text-blue-300',
    shortlisted: 'bg-yellow-500/20 text-yellow-300',
    interview: 'bg-purple-500/20 text-purple-300',
    selected: 'bg-emerald-500/20 text-emerald-300',
    placed: 'bg-emerald-500/20 text-emerald-300',
    rejected: 'bg-red-500/20 text-red-300',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${colors[status] || 'bg-slate-700 text-slate-300'}`}>
      {status}
    </span>
  )
}
