import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, IndianRupee, Calendar, CheckCircle, XCircle, Brain, Briefcase, Send, Loader2, LayoutDashboard, User, FileText } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
]

function MatchGauge({ percentage }) {
  const color = percentage >= 75 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'
  const label = percentage >= 75 ? 'Strong Match' : percentage >= 50 ? 'Moderate Match' : 'Needs Work'

  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${(percentage / 100) * 314} 314`}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-black text-white">{percentage}%</p>
        </div>
      </div>
      <p className="text-sm font-medium mt-2" style={{ color }}>{label}</p>
    </div>
  )
}

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [match, setMatch] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data))
    if (user?.role === 'student') {
      api.get(`/jobs/${id}/match`).then(({ data }) => setMatch(data)).catch(() => {})
    }
  }, [id])

  const apply = async () => {
    setApplying(true)
    try {
      await api.post('/applications/apply', { job_id: parseInt(id) })
      toast.success('Application submitted successfully!')
      setApplied(true)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Application failed')
    } finally {
      setApplying(false)
    }
  }

  if (!job) return (
    <Layout navItems={navItems}>
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    </Layout>
  )

  return (
    <Layout navItems={navItems}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                    {job.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>}
                    {job.package_lpa && <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{job.package_lpa} LPA</span>}
                    {job.deadline && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium
                  ${job.role_type === 'internship' ? 'bg-violet-500/20 text-violet-300' : 'bg-brand-500/20 text-brand-300'}`}>
                  {job.role_type === 'internship' ? 'Internship' : 'Full-time'}
                </span>
              </div>
              {job.description && <p className="text-slate-400 text-sm leading-relaxed">{job.description}</p>}
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.required_skills?.map((skill, i) => {
                  const matched = match?.matched_skills?.includes(skill)
                  const missing = match?.missing_skills?.includes(skill)
                  return (
                    <span key={i} className={matched ? 'skill-tag-matched' : missing ? 'skill-tag-missing' : 'skill-tag'}>
                      {matched && <CheckCircle className="w-3 h-3" />}
                      {missing && <XCircle className="w-3 h-3" />}
                      {skill}
                    </span>
                  )
                })}
              </div>
              {job.preferred_skills?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Preferred Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferred_skills.map((skill, i) => <span key={i} className="skill-tag">{skill}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-3">Eligibility Criteria</h2>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  Minimum CGPA: <span className="font-semibold text-white">{job.min_cgpa}</span>
                </div>
                {job.allowed_branches?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5" />
                    <span>Eligible Branches: <span className="text-white">{job.allowed_branches.join(', ')}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Match card */}
            {match && (
              <div className="glass-card p-5 text-center">
                <p className="text-sm text-slate-400 mb-4">Your Match Score</p>
                <MatchGauge percentage={match.match_percentage} />
                <div className="mt-4 space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${match.cgpa_eligible ? 'text-emerald-400' : 'text-red-400'}`}>
                    {match.cgpa_eligible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    CGPA Eligible
                  </div>
                  <div className={`flex items-center gap-2 ${match.branch_eligible ? 'text-emerald-400' : 'text-red-400'}`}>
                    {match.branch_eligible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    Branch Eligible
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {user?.role === 'student' && (
              <div className="space-y-3">
                <button onClick={apply} disabled={applying || applied}
                  className="btn-primary w-full justify-center py-3">
                  {applying ? <><Loader2 className="w-4 h-4 animate-spin" /> Applying...</>
                    : applied ? <><CheckCircle className="w-4 h-4" /> Applied!</>
                    : <><Send className="w-4 h-4" /> Apply Now</>}
                </button>
                {match?.missing_skills?.length > 0 && (
                  <Link to={`/student/roadmap/${id}`}
                    className="btn-secondary w-full flex items-center justify-center gap-2 py-3">
                    <Brain className="w-4 h-4 text-brand-400" />
                    Get AI Roadmap
                  </Link>
                )}
              </div>
            )}

            {/* Missing skills */}
            {match?.missing_skills?.length > 0 && (
              <div className="glass-card p-4">
                <p className="text-sm font-medium text-red-400 mb-2">Skills to Learn</p>
                <div className="flex flex-wrap gap-1.5">
                  {match.missing_skills.map((s, i) => (
                    <span key={i} className="skill-tag-missing">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
