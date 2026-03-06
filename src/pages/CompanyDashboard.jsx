import { useEffect, useState } from 'react'
import { LayoutDashboard, Briefcase, Plus, Users, X, Loader2, ChevronDown, ChevronUp, Star, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/company', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'My Jobs', icon: Briefcase },
]

const SKILLS_LIST = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'FastAPI', 'Django', 'Spring Boot', 'Docker', 'AWS']
const BRANCHES = ['CSE', 'IT', 'ECE', 'ECSC', 'EEE', 'ME', 'CE', 'AIDS', 'AIML']

function JobModal({ job, onClose, onSuccess }) {
  const isEdit = !!job
  const [form, setForm] = useState(job ? {
    title: job.title, description: job.description || '',
    role_type: job.role_type, required_skills: job.required_skills || [],
    preferred_skills: job.preferred_skills || [], min_cgpa: job.min_cgpa,
    allowed_branches: job.allowed_branches || [],
    package_lpa: job.package_lpa || '', location: job.location || ''
  } : {
    title: '', description: '', role_type: 'full_time',
    required_skills: [], preferred_skills: [], min_cgpa: 6.0,
    allowed_branches: [], package_lpa: '', location: ''
  })
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setSaving(true)
    try {
      const payload = { ...form, package_lpa: parseFloat(form.package_lpa) || null, min_cgpa: parseFloat(form.min_cgpa) }
      if (isEdit) {
        await api.put(`/jobs/${job.id}`, payload)
        toast.success('Job updated!')
      } else {
        await api.post('/jobs/', payload)
        toast.success('Job posted!')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed')
    } finally { setSaving(false) }
  }

  const toggleBranch = (b) => setForm(f => ({
    ...f, allowed_branches: f.allowed_branches.includes(b)
      ? f.allowed_branches.filter(x => x !== b)
      : [...f.allowed_branches, b]
  }))

  const addSkill = (s) => {
    if (s && !form.required_skills.includes(s))
      setForm(f => ({ ...f, required_skills: [...f.required_skills, s] }))
    setNewSkill('')
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{isEdit ? 'Edit Job' : 'Post a New Job'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Job Title *</label>
              <input className="input-field" placeholder="Software Engineer"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Role Type</label>
              <select className="input-field" value={form.role_type}
                onChange={e => setForm({ ...form, role_type: e.target.value })}>
                <option value="full_time">Full-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Location</label>
              <input className="input-field" placeholder="Bangalore / Remote"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Package (LPA)</label>
              <input className="input-field" type="number" placeholder="12"
                value={form.package_lpa} onChange={e => setForm({ ...form, package_lpa: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Min CGPA</label>
              <input className="input-field" type="number" step="0.1" min="0" max="10" placeholder="7.0"
                value={form.min_cgpa} onChange={e => setForm({ ...form, min_cgpa: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Job Description</label>
            <textarea className="input-field min-h-[80px] resize-none" placeholder="Describe the role..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.required_skills.map(s => (
                <span key={s} className="skill-tag-missing flex items-center gap-1">
                  {s} <button onClick={() => setForm(f => ({ ...f, required_skills: f.required_skills.filter(x => x !== s) }))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1 text-sm" placeholder="Add skill..."
                value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SKILLS_LIST.filter(s => !form.required_skills.includes(s)).map(s => (
                <button key={s} onClick={() => addSkill(s)}
                  className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700">+ {s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Eligible Branches</label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map(b => (
                <button key={b} onClick={() => toggleBranch(b)}
                  className={`text-sm px-3 py-1.5 rounded-xl border transition-all
                    ${form.allowed_branches.includes(b)
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={!form.title || saving} className="btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Plus className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Post Job'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [expandedJob, setExpandedJob] = useState(null)
  const [ranked, setRanked] = useState({})
  const [loading, setLoading] = useState(true)

  const loadJobs = () => {
    api.get('/jobs/').then(({ data }) => setJobs(data)).finally(() => setLoading(false))
  }

  useEffect(() => { loadJobs() }, [])

  const loadCandidates = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return }
    setExpandedJob(jobId)
    if (!ranked[jobId]) {
      const { data } = await api.get(`/jobs/${jobId}/ranked-students`)
      setRanked(r => ({ ...r, [jobId]: data }))
    }
  }

  const deleteJob = async (job) => {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/jobs/${job.id}`)
      toast.success('Job deleted')
      loadJobs()
    } catch { toast.error('Failed to delete') }
  }

  const toggleJob = async (job) => {
    try {
      await api.patch(`/jobs/${job.id}/toggle`)
      toast.success(job.is_active ? 'Job closed' : 'Job reopened')
      loadJobs()
    } catch { toast.error('Failed to update') }
  }

  return (
    <Layout navItems={navItems}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Manage job postings and view ranked candidates</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Post Job
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Active Postings', value: jobs.filter(j => j.is_active).length, icon: Briefcase },
            { label: 'Total Postings', value: jobs.length, icon: LayoutDashboard },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="bg-brand-500/10 text-brand-400 p-2.5 rounded-xl"><s.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-white">Your Job Postings</h2>
          {loading ? <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-brand-500 mx-auto" /></div>
            : jobs.length === 0 ? (
              <div className="glass-card p-10 text-center text-slate-500">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No jobs posted yet</p>
              </div>
            ) : jobs.map(job => (
              <div key={job.id} className="glass-card overflow-hidden">
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${job.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                        {job.is_active ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {(job.required_skills || []).slice(0, 4).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button onClick={() => setEditJob(job)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {/* Toggle active/closed */}
                    <button onClick={() => toggleJob(job)}
                      className={`p-2 rounded-lg transition-colors ${job.is_active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:bg-slate-700'}`}
                      title={job.is_active ? 'Close job' : 'Reopen job'}>
                      {job.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    {/* Delete */}
                    <button onClick={() => deleteJob(job)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* Candidates */}
                    <button onClick={() => loadCandidates(job.id)}
                      className="flex items-center gap-2 btn-secondary text-sm whitespace-nowrap">
                      <Users className="w-4 h-4" /> Candidates
                      {expandedJob === job.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {expandedJob === job.id && (
                  <div className="border-t border-slate-700 p-5">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">
                      Ranked Candidates ({(ranked[job.id] || []).length})
                    </h4>
                    {(ranked[job.id] || []).length === 0 ? (
                      <p className="text-slate-500 text-sm">No applicants yet</p>
                    ) : (
                      <div className="space-y-2">
                        {(ranked[job.id] || []).slice(0, 15).map((c, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                            <div className="w-6 text-slate-500 text-xs font-bold text-center">#{i + 1}</div>
                            {i === 0 && <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{c.student_name}</p>
                              <p className="text-xs text-slate-500">{c.department} • CGPA: {c.cgpa?.toFixed(2)}</p>
                            </div>
                            <div className="text-right mr-2">
                              <span className={`text-sm font-bold ${c.match_percentage >= 75 ? 'text-emerald-400' : c.match_percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {c.match_percentage}%
                              </span>
                              <p className={`text-xs ${c.overall_eligible ? 'text-emerald-500' : 'text-red-500'}`}>
                                {c.overall_eligible ? 'Eligible' : 'Ineligible'}
                              </p>
                            </div>
                            {c.application_id && (
                              <select
                                defaultValue={c.application_status || 'applied'}
                                onChange={async (e) => {
                                  try {
                                    await api.patch(`/applications/${c.application_id}/status`, { status: e.target.value })
                                    toast.success(`${c.student_name} marked as ${e.target.value}`)
                                  } catch { toast.error('Failed to update status') }
                                }}
                                className="text-xs rounded-lg px-2 py-1.5 border border-slate-600 bg-slate-900 text-slate-300 cursor-pointer focus:outline-none focus:border-indigo-500">
                                <option value="applied">Applied</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interview">Interview</option>
                                <option value="selected">Selected</option>
                                <option value="rejected">Rejected</option>
                                <option value="placed">Placed</option>
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {showModal && <JobModal onClose={() => setShowModal(false)} onSuccess={loadJobs} />}
      {editJob && <JobModal job={editJob} onClose={() => setEditJob(null)} onSuccess={() => { loadJobs(); setEditJob(null) }} />}
    </Layout>
  )
}
