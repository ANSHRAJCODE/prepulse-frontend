import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brain, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'student' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PrepPulse <span className="text-brand-400">AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the smarter placement platform</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input type="text" placeholder="Arjun Sharma" className="input-field"
                value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input type="email" placeholder="you@college.edu" className="input-field"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" placeholder="Min. 8 characters" className="input-field"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {['student', 'admin', 'company'].map(role => (
                  <button key={role} type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all capitalize
                      ${form.role === role
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    {role === 'company' ? 'Recruiter' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
