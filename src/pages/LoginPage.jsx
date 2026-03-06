// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Eye, EyeOff, Loader2, Brain } from 'lucide-react'
// import PrepPulseLogo from '../../components/shared/Logo'
// import toast from 'react-hot-toast'
// import api from '../utils/api'
// import useAuthStore from '../store/authStore'

// export default function LoginPage() {
//   const navigate = useNavigate()
//   const login = useAuthStore(s => s.login)
//   const [form, setForm] = useState({ email: '', password: '' })
//   const [showPass, setShowPass] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const { data } = await api.post('/auth/login', form)
//       login({ id: data.user_id, full_name: data.full_name, role: data.role, email: form.email }, data.access_token)
//       toast.success(`Welcome back, ${data.full_name}!`)
//       navigate(`/${data.role}`)
//     } catch (err) {
//       toast.error(err.response?.data?.detail || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-pulse-500/10 rounded-full blur-3xl" />
//       </div>

//       <div className="w-full max-w-md animate-slide-up">
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2 mb-6">
//             <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
//               <Brain className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold text-white">PrepPulse</span>
//           </Link>
//           <h1 className="text-3xl font-bold text-white">Welcome back</h1>
//           <p className="text-slate-400 mt-2">Sign in to your account</p>
//         </div>

//         <div className="glass-card p-8">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
//               <input
//                 type="email"
//                 placeholder="you@college.edu"
//                 className="input-field"
//                 value={form.email}
//                 onChange={e => setForm({ ...form, email: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPass ? 'text' : 'password'}
//                   placeholder="••••••••"
//                   className="input-field pr-12"
//                   value={form.password}
//                   onChange={e => setForm({ ...form, password: e.target.value })}
//                   required
//                 />
//                 <button type="button" onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
//                   {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>
//             <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={loading}>
//               {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
//             </button>
//           </form>

//           {/* Demo accounts */}
//           <div className="mt-6 pt-5 border-t border-slate-700">
//             <p className="text-xs text-slate-500 mb-3 text-center">Demo Credentials</p>
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { role: 'Student', email: 'student@demo.com', pass: 'demo123' },
//                 { role: 'Admin', email: 'admin@demo.com', pass: 'demo123' },
//                 { role: 'Company', email: 'company@demo.com', pass: 'demo123' },
//               ].map(d => (
//                 <button key={d.role} onClick={() => setForm({ email: d.email, password: d.pass })}
//                   className="text-xs py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700">
//                   {d.role}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <p className="text-center text-slate-500 mt-6 text-sm">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Register here</Link>
//         </p>
//       </div>
//     </div>
//   )
// }
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import PrepPulseLogo from '../../components/shared/Logo'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', form)

      login(
        {
          id: data.user_id,
          full_name: data.full_name,
          role: data.role,
          email: form.email
        },
        data.access_token
      )

      toast.success(`Welcome back, ${data.full_name}!`)
      navigate(`/${data.role}`)

    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-pulse-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <PrepPulseLogo size={36} />
            <span className="text-xl font-bold text-white">PrepPulse</span>
          </Link>

          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@college.edu"
                className="input-field"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-700">

            <p className="text-xs text-slate-500 mb-3 text-center">
              Demo Credentials
            </p>

            <div className="grid grid-cols-3 gap-2">

              {[
                {
                  role: 'Student',
                  email: 'student@demo.com',
                  pass: 'demo123'
                },
                {
                  role: 'Admin',
                  email: 'admin@demo.com',
                  pass: 'demo123'
                },
                {
                  role: 'Company',
                  email: 'company@demo.com',
                  pass: 'demo123'
                }
              ].map((d) => (
                <button
                  key={d.role}
                  onClick={() =>
                    setForm({
                      email: d.email,
                      password: d.pass
                    })
                  }
                  className="text-xs py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700"
                >
                  {d.role}
                </button>
              ))}

            </div>
          </div>
        </div>

        {/* Register */}
        <p className="text-center text-slate-500 mt-6 text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-400 hover:text-brand-300 font-medium"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}