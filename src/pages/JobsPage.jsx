import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, MapPin, IndianRupee, ChevronRight, Filter, Loader2 } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'
import useAuthStore from '../store/authStore'
import { LayoutDashboard, User, FileText } from 'lucide-react'

const studentNav = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
]
const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'All Jobs', icon: Briefcase },
]
const companyNav = [
  { href: '/company', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'My Jobs', icon: Briefcase },
]

function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`}
      className="glass-card p-5 hover:border-brand-500/40 transition-all duration-200 group block">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">{job.title}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-400">
            {job.location && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
            )}
            {job.package_lpa && (
              <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{job.package_lpa} LPA</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium
            ${job.role_type === 'internship' ? 'bg-violet-500/20 text-violet-300' : 'bg-brand-500/20 text-brand-300'}`}>
            {job.role_type === 'internship' ? 'Internship' : 'Full-time'}
          </span>
          <span className="text-xs text-slate-500">Min CGPA: {job.min_cgpa}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(job.required_skills || []).slice(0, 4).map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
        {(job.required_skills || []).length > 4 && (
          <span className="skill-tag">+{job.required_skills.length - 4} more</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {(job.allowed_branches || []).slice(0, 3).map((b, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{b}</span>
          ))}
        </div>
        <span className="text-brand-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}

export default function JobsPage() {
  const { user } = useAuthStore()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const navMap = { student: studentNav, admin: adminNav, company: companyNav }
  const nav = navMap[user?.role] || studentNav

  useEffect(() => {
    api.get('/jobs/').then(({ data }) => setJobs(data)).finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    (j.required_skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Layout navItems={nav}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Opportunities</h1>
            <p className="text-slate-400 text-sm mt-1">{jobs.length} openings available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input-field pl-11" placeholder="Search by title or skill..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No jobs found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}
