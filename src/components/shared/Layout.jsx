import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User, Moon, Sun, Bell, ChevronRight } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import PPLogo from '../PPLogo'

export default function Layout({ children, navItems = [] }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark')
  const profileRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('pp-theme', next)
    setDark(!dark)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleColor = {
    student: '#2D5BE3',
    admin: '#1A7A4A',
    company: '#A05A1A',
  }[user?.role] || '#2D5BE3'

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: dark ? '#0E0F14' : '#F7F5F0',
      color: dark ? '#F0EEE8' : '#16150F',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      transition: 'background 0.3s, color 0.3s'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        [data-theme="light"] { --bg:#F7F5F0;--bg2:#EFECE4;--card:#FFFFFF;--border:#E0DBD0;--text:#16150F;--text2:#5C5848;--text3:#8C8878;--accent:#2D5BE3 }
        [data-theme="dark"]  { --bg:#0E0F14;--bg2:#141620;--card:#171923;--border:rgba(255,255,255,0.08);--text:#F0EEE8;--text2:#8A8880;--text3:#5A5854;--accent:#5B84F0 }
        .nav-item { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:14px;font-weight:500;color:var(--text2);transition:all .2s;text-decoration:none;cursor:pointer }
        .nav-item:hover { background:var(--bg2);color:var(--text) }
        .nav-item.active { background:var(--accent);color:#fff;font-weight:600 }
        .nav-item.active svg { opacity:1 }
        .profile-dropdown { position:absolute;bottom:calc(100% + 8px);left:0;right:0;background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 -8px 32px rgba(0,0,0,.12);z-index:100;animation:slideUp .2s ease }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .dd-item { display:flex;align-items:center;gap:10px;padding:11px 16px;font-size:13.5px;font-weight:500;color:var(--text2);cursor:pointer;transition:background .15s;text-decoration:none }
        .dd-item:hover { background:var(--bg2);color:var(--text) }
        .dd-item.danger { color:#C02A2A }
        .dd-item.danger:hover { background:rgba(192,42,42,.08) }
        .inner-card { background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: dark ? '#0A0B10' : '#FFFFFF',
        borderRight: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#E0DBD0'}`,
        padding: '0 16px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 2px 24px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#E0DBD0'}`, marginBottom: 16 }}>
          <Link to="/" style={{ display: 'block' }}>
            <PPLogo size={32} theme={dark ? 'dark' : 'light'} />
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href} className={`nav-item${isActive ? ' active' : ''}`}>
                <item.icon size={16} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Profile trigger — click to show dropdown */}
        <div ref={profileRef} style={{ position: 'relative', marginTop: 12 }}>
          {profileOpen && (
            <div className="profile-dropdown">
              {/* User info header */}
              <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#E0DBD0'}` }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: dark ? '#F0EEE8' : '#16150F' }}>{user?.full_name}</p>
                <p style={{ fontSize: 11, color: dark ? '#5A5854' : '#8C8878', marginTop: 2 }}>{user?.email}</p>
                <span style={{ display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: roleColor, background: `${roleColor}15`, padding: '2px 8px', borderRadius: 4 }}>{user?.role}</span>
              </div>
              {/* Menu items */}
              <Link to={user?.role === 'student' ? '/student/profile' : '/profile'} className="dd-item" onClick={() => setProfileOpen(false)}>
                <User size={14} /> My Profile
              </Link>
              <div className="dd-item" onClick={toggleTheme}>
                {dark ? <Sun size={14} /> : <Moon size={14} />}
                {dark ? 'Light Mode' : 'Dark Mode'}
              </div>
              <div style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#E0DBD0'}`, margin: '4px 0' }} />
              <div className="dd-item danger" onClick={handleLogout}>
                <LogOut size={14} /> Sign Out
              </div>
            </div>
          )}

          {/* Avatar button */}
          <button onClick={() => setProfileOpen(p => !p)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12, border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E0DBD0'}`,
            background: dark ? '#171923' : '#FAFAF8', cursor: 'pointer', transition: 'all .2s'
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.full_name?.charAt(0)}
            </div>
            <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#F0EEE8' : '#16150F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name}</p>
              <p style={{ fontSize: 11, color: dark ? '#5A5854' : '#8C8878', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <ChevronRight size={14} style={{ color: dark ? '#5A5854' : '#8C8878', transform: profileOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 28px', gap: 10,
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#E0DBD0'}`,
          background: dark ? '#0A0B10' : '#FFFFFF', position: 'sticky', top: 0, zIndex: 50
        }}>
          <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E0DBD0'}`, background: 'transparent', color: dark ? '#8A8880' : '#5C5848', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E0DBD0'}`, background: 'transparent', color: dark ? '#8A8880' : '#5C5848', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <Bell size={15} />
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
