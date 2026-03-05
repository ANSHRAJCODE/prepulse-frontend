import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, Bell, Sun, Moon, CheckCircle, Briefcase, TrendingUp } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import toast from 'react-hot-toast'
import PrepPulseLogo from './Logo'

// Mock notifications — in real deployment these come from the API
function useNotifications() {
  const { user } = useAuthStore()
  if (user?.role === 'student') return [
    { id: 1, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Application Shortlisted', body: 'TechCorp India shortlisted you for Software Engineer', time: '2h ago', unread: true },
    { id: 2, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: 'New Job Posted', body: 'Amazon India posted SDE-1 Backend — 26 LPA', time: '5h ago', unread: true },
    { id: 3, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Profile Complete', body: 'Your profile is now eligible for all job matches', time: '1d ago', unread: false },
  ]
  if (user?.role === 'admin') return [
    { id: 1, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: '3 New Applications', body: 'Students applied to Amazon SDE-1 today', time: '1h ago', unread: true },
    { id: 2, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: 'New Company Registered', body: 'Wipro Technologies joined the platform', time: '3h ago', unread: true },
  ]
  if (user?.role === 'company') return [
    { id: 1, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: '5 New Applicants', body: '5 students applied to your job posting today', time: '2h ago', unread: true },
  ]
  return []
}

export default function Layout({ children, navItems }) {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme, initTheme } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState([])
  const notifRef = useRef(null)
  const notifications = useNotifications()

  useEffect(() => { initTheme(theme) }, [])

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => n.unread && !readIds.includes(n.id)).length

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 sidebar
        transform transition-transform duration-300 flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5">
            <PrepPulseLogo size={32} />
            <div>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>PrepPulse</span>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.full_name}</p>
              <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'hover:bg-[var(--bg-hover)]'}`}
                style={{ color: isActive ? undefined : 'var(--text-secondary)' }}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all hover:bg-red-500/10 hover:text-red-400"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 topbar px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden" style={{ color: 'var(--text-secondary)' }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {isDark
              ? <Sun className="w-4 h-4 text-yellow-400" />
              : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setNotifOpen(!notifOpen); setReadIds(notifications.map(n => n.id)) }}
              className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-secondary)' }}>
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--bg-base)]" />
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 glass-card shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  {notifications.length === 0
                    ? <p className="px-4 py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>No notifications</p>
                    : notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-hover)]">
                        <div className={`${n.bg} ${n.color} p-2 rounded-lg flex-shrink-0 mt-0.5`}>
                          <n.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                        </div>
                        {n.unread && !readIds.includes(n.id) && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
