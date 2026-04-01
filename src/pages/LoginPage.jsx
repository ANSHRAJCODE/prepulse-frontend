import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import PPLogo from '../components/PPLogo'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login({ id: data.user_id, full_name: data.full_name, role: data.role, email: form.email }, data.access_token)
      toast.success(`Welcome back, ${data.full_name}!`)
      navigate(`/${data.role}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F7F5F0', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <PPLogo size={38} theme="light" />
          </Link>
        </div>
        <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:36, fontWeight:400, color:'#16150F', textAlign:'center', marginBottom:6 }}>Welcome back</h1>
        <p style={{ fontSize:15, color:'#8C8878', textAlign:'center', marginBottom:32 }}>Sign in to your account</p>

        <div style={{ background:'#FFFFFF', border:'1px solid #E0DBD0', borderRadius:18, padding:32, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#5C5848', marginBottom:7 }}>Email Address</label>
              <input type="email" placeholder="you@college.edu" required
                value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:'1px solid #E0DBD0', background:'#F7F5F0', fontSize:14, color:'#16150F', outline:'none', fontFamily:'inherit' }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#5C5848', marginBottom:7 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                  style={{ width:'100%', padding:'12px 44px 12px 16px', borderRadius:10, border:'1px solid #E0DBD0', background:'#F7F5F0', fontSize:14, color:'#16150F', outline:'none', fontFamily:'inherit' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#8C8878', cursor:'pointer', display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', background:'#2D5BE3', color:'white', fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit', opacity:loading?0.8:1 }}>
              {loading ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div style={{ borderTop:'1px solid #E0DBD0', marginTop:24, paddingTop:20 }}>
            <p style={{ fontSize:12, color:'#8C8878', textAlign:'center', marginBottom:12 }}>Demo Credentials</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[{role:'Student',email:'student@demo.com'},{role:'Admin',email:'admin@demo.com'},{role:'Company',email:'tech@demo.com'}].map(d => (
                <button key={d.role} onClick={() => setForm({email:d.email, password:'demo123'})}
                  style={{ padding:'8px', borderRadius:8, border:'1px solid #E0DBD0', background:'#F7F5F0', fontSize:12, fontWeight:600, color:'#5C5848', cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#2D5BE3'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#E0DBD0'}>
                  {d.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:13, color:'#8C8878', marginTop:20 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'#2D5BE3', fontWeight:600, textDecoration:'none' }}>Register here</Link>
        </p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
