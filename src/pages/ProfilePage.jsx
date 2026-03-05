import { useEffect, useState } from 'react'
import { LayoutDashboard, User, Briefcase, FileText, Plus, X, Save, Loader2 } from 'lucide-react'
import Layout from '../components/shared/Layout'
import api from '../utils/api'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
]

const COMMON_SKILLS = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 
  'FastAPI', 'Django', 'Spring Boot', 'Docker', 'AWS', 'Git', 'Machine Learning', 
  'Data Science', 'TypeScript', 'C++', 'C', 'HTML/CSS', 'REST APIs']

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'ECSC', 'EEE', 'ME', 'CE', 'AIDS', 'AIML', 'Cyber Security']

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    roll_number: '', department: '', batch_year: new Date().getFullYear(),
    cgpa: '', skills: [], certifications: [], linkedin_url: '', github_url: ''
  })
  const [newSkill, setNewSkill] = useState('')
  const [newCert, setNewCert] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/students/profile').then(({ data }) => {
      setProfile(data)
      setForm({
        roll_number: data.roll_number || '',
        department: data.department || '',
        batch_year: data.batch_year || new Date().getFullYear(),
        cgpa: data.cgpa || '',
        skills: data.skills || [],
        certifications: data.certifications || [],
        linkedin_url: data.linkedin_url || '',
        github_url: data.github_url || '',
      })
    }).catch(() => {})
  }, [])

  const addSkill = (skill) => {
    const s = skill.trim()
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }))
    }
    setNewSkill('')
  }

  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))

  const addCert = () => {
    if (newCert.trim() && !form.certifications.includes(newCert.trim())) {
      setForm(f => ({ ...f, certifications: [...f.certifications, newCert.trim()] }))
      setNewCert('')
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/students/profile', { ...form, cgpa: parseFloat(form.cgpa) || 0 })
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-slate-400 text-sm mt-1">Keep your profile updated for better job matches</p>
          </div>
          <button onClick={save} className="btn-primary" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        {/* Basic Info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white border-b border-slate-700 pb-3">Academic Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Roll Number</label>
              <input className="input-field" placeholder="21CSE001"
                value={form.roll_number} onChange={e => setForm({ ...form, roll_number: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Department</label>
              <select className="input-field" value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Batch Year</label>
              <input className="input-field" type="number" placeholder="2025"
                value={form.batch_year} onChange={e => setForm({ ...form, batch_year: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">CGPA (out of 10)</label>
              <input className="input-field" type="number" step="0.01" min="0" max="10" placeholder="8.5"
                value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white border-b border-slate-700 pb-3">Technical Skills</h2>
          
          {/* Current skills */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {form.skills.map(skill => (
              <span key={skill} className="skill-tag flex items-center gap-1.5">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && <p className="text-slate-500 text-sm">No skills added yet</p>}
          </div>

          {/* Add skill input */}
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Type a skill and press Enter"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))} />
            <button onClick={() => addSkill(newSkill)} className="btn-primary whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Quick add */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 10).map(skill => (
                <button key={skill} onClick={() => addSkill(skill)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700">
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white border-b border-slate-700 pb-3">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {form.certifications.map((cert, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {cert}
                <button onClick={() => setForm(f => ({ ...f, certifications: f.certifications.filter((_, j) => j !== i) }))}>
                  <X className="w-3 h-3 hover:text-red-400" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="e.g. AWS Cloud Practitioner"
              value={newCert} onChange={e => setNewCert(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCert())} />
            <button onClick={addCert} className="btn-primary whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white border-b border-slate-700 pb-3">Online Profiles</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">LinkedIn URL</label>
              <input className="input-field" placeholder="https://linkedin.com/in/yourname"
                value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">GitHub URL</label>
              <input className="input-field" placeholder="https://github.com/yourusername"
                value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={save} className="btn-primary px-8" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>
      </div>
    </Layout>
  )
}
