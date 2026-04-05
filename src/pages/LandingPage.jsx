import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PPLogo from '../components/PPLogo'

function useReveal() {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return { ref, vis }
}

function Reveal({ children, dir = 'up', delay = 0, style = {}, className = '' }) {
  const { ref, vis } = useReveal()
  const transforms = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)' }
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : transforms[dir],
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style
    }}>{children}</div>
  )
}

function Counter({ to, suf = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const s = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - s) / 2000, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setVal(Math.floor(ease * to))
          if (p < 1) requestAnimationFrame(tick)
          else setVal(to)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suf}</span>
}

export default function LandingPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('pp-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [scrolled, setScrolled] = useState(false)
  const [py, setPy] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [ring, setRing] = useState({ x: 0, y: 0 })
  const ringRef = useRef({ x: 0, y: 0 })
  const mqRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pp-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 40); setPy(window.scrollY) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    let raf
    const tick = () => {
      ringRef.current.x += (cursor.x - ringRef.current.x) * 0.1
      ringRef.current.y += (cursor.y - ringRef.current.y) * 0.1
      setRing({ x: ringRef.current.x, y: ringRef.current.y })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [cursor.x, cursor.y])

  // Parallax scroll for bg words
  const ps1Ref = useRef(null)
  const ps2Ref = useRef(null)
  const [ps1x, setPs1x] = useState(0)
  const [ps2x, setPs2x] = useState(0)
  useEffect(() => {
    const fn = () => {
      if (ps1Ref.current) {
        const r = ps1Ref.current.getBoundingClientRect()
        setPs1x(-r.top * 0.1)
      }
      if (ps2Ref.current) {
        const r = ps2Ref.current.getBoundingClientRect()
        setPs2x(-r.top * -0.08)
      }
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Hero card tilt from mouse
  const hcRef = useRef(null)
  useEffect(() => {
    const fn = (e) => {
      if (!hcRef.current) return
      const cx = window.innerWidth * 0.5
      const cy = window.innerHeight * 0.5
      const dx = (e.clientX - cx) / cx * 4
      const dy = (e.clientY - cy) / cy * 3
      hcRef.current.style.transform = `perspective(900px) rotateY(${dx}deg) rotateX(${-dy}deg)`
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const isDark = theme === 'dark'

  const FEATURES = [
    { icon: '1', bg: 'rgba(45,91,227,.1)', c: '#2D5BE3', t: 'Intelligent Match Engine', d: 'Weighted algorithm combining CGPA, skills, branch, and certifications to produce a precise compatibility score for every student–job pair.' },
    { icon: '2', bg: 'rgba(139,92,246,.1)', c: '#7C3AED', t: 'Local AI Roadmaps', d: 'When a student falls short, the system generates a 3-step personalised learning plan using Ollama — no external API, no cost, no data leaks.' },
    { icon: '3', bg: 'rgba(16,185,129,.1)', c: '#059669', t: 'Placement Command Center', d: 'Department-wise readiness heatmaps, pipeline charts, and student drill-downs give placement officers real intelligence — not just numbers.' },
    { icon: '4', bg: 'rgba(245,158,11,.1)', c: '#B45309', t: 'Company Recruiter Portal', d: 'Companies post jobs with skill criteria. The system auto-ranks students. Recruiters update candidate status and manage their entire pipeline.' },
    { icon: '5', bg: 'rgba(236,72,153,.1)', c: '#BE185D', t: 'Skill Gap Analysis', d: 'Side-by-side view of what a student has vs what a company needs. Missing skills highlighted. Match percentage calculated in real time.' },
    { icon: '6', bg: 'rgba(6,182,212,.1)', c: '#0E7490', t: 'Student Leaderboard', d: 'Department-wise ranking by placement readiness score. Motivates students and helps admins identify who needs intervention before deadlines.' },
  ]

  const STEPS = [
    { n: '01', c: '#2D5BE3', t: 'Students Register', d: 'Fill profile — CGPA, skills, certifications, branch. Takes 3 minutes.' },
    { n: '02', c: '#7C3AED', t: 'Companies Post Jobs', d: 'Recruiters list openings with skill requirements, CGPA cutoff, and branches.' },
    { n: '03', c: '#059669', t: 'AI Matches & Ranks', d: 'Match engine scores every student for every job. Admin sees ranked lists instantly.' },
    { n: '04', c: '#B45309', t: 'Placed or Guided', d: 'Eligible students apply. Others get an AI roadmap to close the gap before the deadline.' },
  ]

  const ROLES = [
    { role: 'Student', c: '#2D5BE3', cbg: 'rgba(45,91,227,.1)', icon: '1', items: ['Skill gap analysis vs live jobs', 'AI-generated learning roadmap', 'Match score for every opening', 'Application tracking dashboard', 'Placement status in real time'], cta: 'Register as student', link: '/register' },
    { role: 'Admin', c: '#1A7A4A', cbg: 'rgba(26,122,74,.1)', icon: '2', items: ['Batch placement analytics', 'Department readiness heatmap', 'All students with drill-down', 'Application pipeline charts', 'Export placement reports'], cta: 'Admin access', link: '/login' },
    { role: 'Company', c: '#A05A1A', cbg: 'rgba(160,90,26,.1)', icon: '3', items: ['Post jobs with skill criteria', 'Auto-ranked candidate list', 'Status update per candidate', 'Edit, close, delete postings', 'Shortlist and interview tracking'], cta: 'Register as recruiter', link: '/register' },
  ]

  const DEPTS = [
    { d: 'CSE', p: 100, c: '#1A7A4A' }, { d: 'ECE', p: 89, c: '#2D5BE3' },
    { d: 'IT', p: 100, c: '#1A7A4A' }, { d: 'EEE', p: 50, c: '#C02A2A' },
    { d: 'AIDS', p: 75, c: '#A05A1A' },
  ]

  const MQ = ['Smart match engine', 'AI learning roadmaps', '3-role system', 'Local LLM — Ollama', 'Real-time analytics', 'Department heatmaps', 'Company portal', 'Skill gap detection', 'Placement tracking', 'Campus-ready', 'Open source', 'FastAPI backend']

  return (
    <div data-theme={theme} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", cursor: 'none', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;overflow-x:hidden}
        a{text-decoration:none;color:inherit}
        button{font-family:inherit}
        ::selection{background:#2D5BE3;color:#fff}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:var(--bg,#F7F5F0)}
        ::-webkit-scrollbar-thumb{background:#2D5BE3;border-radius:3px}
        [data-theme="light"]{--bg:#F7F5F0;--bg2:#EFECE4;--bg3:#FDFCFA;--card:#FFFFFF;--border:#E0DBD0;--text:#16150F;--text2:#5C5848;--text3:#8C8878;--accent:#2D5BE3;--accent-rgb:45,91,227;--green:#1A7A4A;--green-bg:#E8F5EE;--amber:#A05A1A;--amber-bg:#FFF4E3;--red:#C02A2A;--nav-bg:rgba(247,245,240,0.92)}
        [data-theme="dark"]{--bg:#0E0F14;--bg2:#141620;--bg3:#0A0B10;--card:#171923;--border:rgba(255,255,255,0.08);--text:#F0EEE8;--text2:#8A8880;--text3:#5A5854;--accent:#5B84F0;--accent-rgb:91,132,240;--green:#3CB371;--green-bg:rgba(60,179,113,0.12);--amber:#E09A40;--amber-bg:rgba(224,154,64,0.12);--red:#E06060;--nav-bg:rgba(14,15,20,0.92)}
        .tilt{transition:transform .55s ease}
        .tilt:hover{transition:transform .08s ease}
        .nav-a{font-size:14px;font-weight:500;color:var(--text2);transition:color .2s}
        .nav-a:hover{color:var(--text)}
        .btn-fill{padding:13px 26px;border-radius:10px;font-size:14px;font-weight:600;background:var(--accent);color:#fff;border:none;display:inline-flex;align-items:center;gap:8px;transition:all .25s;text-decoration:none;cursor:none}
        .btn-fill:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 8px 28px rgba(var(--accent-rgb),.3)}
        .btn-out{padding:12px 26px;border-radius:10px;font-size:14px;font-weight:600;background:transparent;color:var(--text);border:1px solid var(--border);display:inline-flex;align-items:center;gap:8px;transition:all .25s;text-decoration:none;cursor:none}
        .btn-out:hover{border-color:var(--text);background:var(--card)}
        .sec-tag{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
        .sec-h{font-family:'Instrument Serif',serif;font-size:clamp(30px,4vw,52px);font-weight:400;line-height:1.06;letter-spacing:-1px;color:var(--text);margin-bottom:14px}
        .sec-sub{font-size:17px;color:var(--text2);line-height:1.72;max-width:500px;font-weight:400}
        .fc{background:var(--card);padding:38px 34px;transition:background .25s;position:relative;overflow:hidden}
        .fc::after{content:'';position:absolute;bottom:0;left:34px;right:34px;height:1.5px;background:linear-gradient(90deg,transparent,var(--accent),transparent);transform:scaleX(0);transition:transform .4s}
        .fc:hover{background:var(--bg)}
        .fc:hover::after{transform:scaleX(1)}
        .step{background:var(--card);padding:38px 26px;position:relative;overflow:hidden;transition:background .25s}
        .step:hover{background:var(--bg)}
        .rc{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:38px 32px;display:flex;flex-direction:column;transition:all .3s;position:relative;overflow:hidden}
        .rc:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.1)}
        .mq-track{display:flex;animation:mq 28s linear infinite;white-space:nowrap}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .float{animation:float 5s ease-in-out infinite}
        .float2{animation:float 5s ease-in-out infinite;animation-delay:-2.5s}
        @media(max-width:768px){.hero-grid{grid-template-columns:1fr!important}.hero-card-wrap{display:none!important}.stats-g{grid-template-columns:1fr 1fr!important}.feat-g{grid-template-columns:1fr!important}.steps-g{grid-template-columns:1fr!important}.roles-g{grid-template-columns:1fr!important}.split-g{grid-template-columns:1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}.hide-m{display:none!important}}
      `}</style>

      {/* Custom cursor */}
      <div style={{ position:'fixed',zIndex:9999,width:8,height:8,background:'var(--accent)',borderRadius:'50%',pointerEvents:'none',left:cursor.x,top:cursor.y,transform:'translate(-50%,-50%)',transition:'width .18s,height .18s',willChange:'left,top' }} />
      <div style={{ position:'fixed',zIndex:9998,width:34,height:34,border:'1.5px solid rgba(var(--accent-rgb),.4)',borderRadius:'50%',pointerEvents:'none',left:ring.x,top:ring.y,transform:'translate(-50%,-50%)',willChange:'left,top' }} />

      {/* NAV */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,height:68,zIndex:500,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 52px',transition:'all .35s',background:scrolled?'var(--nav-bg)':'transparent',backdropFilter:scrolled?'blur(20px) saturate(1.5)':'none',borderBottom:scrolled?'1px solid var(--border)':'1px solid transparent' }}>
        <Link to="/" style={{ display:'flex',alignItems:'center',gap:0 }}>
          <PPLogo size={34} theme={theme} />
        </Link>
        <div className="hide-m" style={{ display:'flex',gap:32 }}>
          {['Features','How it works','Roles','For colleges'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="nav-a">{l}</a>
          ))}
        </div>
        <div style={{ display:'flex',gap:10,alignItems:'center' }}>
          <button onClick={() => setTheme(t => t==='dark'?'light':'dark')} style={{ width:34,height:34,borderRadius:'50%',border:'1px solid var(--border)',background:'var(--card)',color:'var(--text2)',display:'flex',alignItems:'center',justifyContent:'center',outline:'none',cursor:'none',transition:'all .2s',fontSize:15 }}>
            {isDark ? '☀' : '◑'}
          </button>
          <Link to="/login" style={{ fontSize:13,fontWeight:600,color:'var(--text2)',padding:'9px 16px',borderRadius:8,transition:'all .2s',textDecoration:'none' }}>Sign in</Link>
          <Link to="/register" className="btn-fill" style={{ padding:'9px 18px',fontSize:13,borderRadius:8 }}>
            Get started
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh',display:'grid',placeItems:'center',position:'relative',overflow:'hidden',paddingTop:68,background:'var(--bg)' }}>
        {/* Dot grid */}
        <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(var(--border) 1px,transparent 1px)',backgroundSize:'32px 32px',opacity:.6 }} />
        {/* Fade bottom */}
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:200,background:'linear-gradient(to bottom,transparent,var(--bg))',pointerEvents:'none',zIndex:1 }} />

        <div style={{ position:'relative',zIndex:2,maxWidth:1160,width:'100%',padding:'80px 52px 100px',display:'grid',gridTemplateColumns:'1fr 480px',gap:80,alignItems:'center' }} className="hero-grid">
          {/* Left */}
          <div>
            <Reveal delay={0.07}>
              <h1 style={{ fontFamily:"'Instrument Serif',serif",fontSize:'clamp(46px,5.5vw,74px)',fontWeight:400,lineHeight:1.04,letterSpacing:'-1.5px',color:'var(--text)',marginBottom:22 }}>
                From Skill Gaps<br />to <em style={{ fontStyle:'italic',color:'var(--accent)' }}>Placement</em><br />Offers.
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ fontSize:17,color:'var(--text2)',lineHeight:1.78,maxWidth:460,marginBottom:36,fontWeight:400 }}>
                PrepPulse maps every student's profile against live company requirements — scores the gap, ranks candidates, and generates a learning roadmap using local AI.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display:'flex',gap:12,flexWrap:'wrap',marginBottom:48 }}>
                <Link to="/register" className="btn-fill">
                  Get started free
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </Link>
                <Link to="/login" className="btn-out">Sign in to your account</Link>
              </div>
              <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                {['3 User Roles','Local LLM — no API cost','Real-time match engine'].map(t => (
                  <span key={t} style={{ display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:500,color:'var(--text3)',background:'var(--card)',border:'1px solid var(--border)',padding:'5px 12px',borderRadius:100 }}>
                    <span style={{ width:14,height:14,borderRadius:'50%',background:'var(--green-bg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="hero-card-wrap" style={{ position:'relative' }}>
            <div ref={hcRef} style={{ background:'var(--card)',borderRadius:20,border:'1px solid var(--border)',boxShadow:'0 20px 60px rgba(0,0,0,.1)',overflow:'hidden',transition:'transform .12s ease' }}>
              <div style={{ background:'var(--bg2)',padding:'10px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:6 }}>
                {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width:9,height:9,borderRadius:'50%',background:c }} />)}
                <div style={{ flex:1,background:'var(--bg)',borderRadius:5,height:18,marginLeft:8,display:'flex',alignItems:'center',padding:'0 8px' }}>
                  <span style={{ fontSize:9,color:'var(--text3)',fontWeight:500 }}>prepulse.vercel.app/student</span>
                </div>
              </div>
              <div style={{ padding:22 }}>
                <p style={{ fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--accent)',marginBottom:4 }}>Student Dashboard</p>
                <p style={{ fontSize:17,fontWeight:600,color:'var(--text)',marginBottom:18 }}>Welcome back MANYA</p>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,marginBottom:18 }}>
                  {[{l:'CGPA',v:'8.2',c:'var(--accent)'},{l:'Skills',v:'12',c:'#7C3AED'},{l:'Applied',v:'4',c:'var(--green)'}].map(s => (
                    <div key={s.l} style={{ background:'var(--bg)',borderRadius:8,padding:'12px 10px',border:'1px solid var(--border)' }}>
                      <div style={{ fontSize:22,fontWeight:700,lineHeight:1,marginBottom:2,color:s.c }}>{s.v}</div>
                      <div style={{ fontSize:9,fontWeight:600,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--text3)' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text3)',marginBottom:10 }}>Top job matches</div>
                {[{j:'Software Engineer — Infosys',m:87,c:'var(--accent)'},{j:'Full Stack Dev — Wipro',m:72,c:'#7C3AED'},{j:'Data Analyst — TCS',m:58,c:'var(--green)'}].map(j => (
                  <div key={j.j} style={{ marginBottom:10 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                      <span style={{ fontSize:11,fontWeight:500,color:'var(--text)' }}>{j.j}</span>
                      <span style={{ fontSize:11,fontWeight:700,color:j.c }}>{j.m}%</span>
                    </div>
                    <div style={{ height:4,background:'var(--bg2)',borderRadius:2,overflow:'hidden' }}>
                      <div style={{ width:`${j.m}%`,height:'100%',borderRadius:2,background:j.c }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:14,padding:'10px 14px',background:'rgba(var(--accent-rgb),.06)',border:'1px solid rgba(var(--accent-rgb),.14)',borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontSize:11,fontWeight:600,color:'var(--accent)' }}>✦ AI Roadmap Ready</span>
                  <span style={{ fontSize:10,color:'var(--text3)' }}>3 steps to close gap →</span>
                </div>
              </div>
            </div>
            <div className="float2" style={{ position:'absolute',bottom:32,left:-20,background:'var(--card)',border:'1px solid var(--border)',borderRadius:9,padding:'8px 12px',fontSize:11,fontWeight:600,color:'var(--accent)',whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(0,0,0,.08)' }}>
               AI Roadmap Generated
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'12px 0',overflow:'hidden',background:'var(--bg2)' }}>
        <div className="mq-track">
          {[...MQ,...MQ].map((t,i) => (
            <span key={i} style={{ display:'inline-flex',alignItems:'center',gap:12,padding:'0 28px',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--text3)' }}>
              <span style={{ width:4,height:4,borderRadius:'50%',background:'var(--accent)',opacity:.5,flexShrink:0,display:'inline-block' }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section style={{ background:'var(--bg2)',padding:'80px 0' }}>
        <div style={{ maxWidth:1160,margin:'0 auto',padding:'0 52px' }}>
          <Reveal>
            <div className="stats-g" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden' }}>
              {[{n:500,s:'+',l:'Students tracked',note:'Across departments'},{n:50,s:'+',l:'Companies onboarded',note:'Actively hiring'},{n:94,s:'%',l:'Match accuracy',note:'Skill-to-job fit'},{n:78,s:'%',l:'Placement rate',note:'With AI guidance'}].map((s,i) => (
                <div key={s.l} style={{ padding:'40px 32px',textAlign:'center',borderRight:i<3?'1px solid var(--border)':'none',background:'var(--card)',position:'relative',overflow:'hidden',transition:'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background='var(--card)'}>
                  <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'var(--accent)',transform:'scaleX(0)',transition:'transform .4s',transformOrigin:'left' }}
                    ref={el => { if (el) { const p = el.parentElement; p.addEventListener('mouseenter',()=>el.style.transform='scaleX(1)'); p.addEventListener('mouseleave',()=>el.style.transform='scaleX(0)') } }} />
                  <div style={{ fontFamily:"'Instrument Serif',serif",fontSize:54,fontWeight:400,color:'var(--text)',lineHeight:1,marginBottom:8 }}>
                    <Counter to={s.n} suf={s.s} />
                  </div>
                  <div style={{ fontSize:14,fontWeight:600,color:'var(--text)',marginBottom:3 }}>{s.l}</div>
                  <div style={{ fontSize:12,color:'var(--text3)' }}>{s.note}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background:'var(--bg)',padding:'100px 0' }}>
        <div style={{ maxWidth:1160,margin:'0 auto',padding:'0 52px' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:60 }}>
              <div className="sec-tag" style={{ justifyContent:'center' }}><span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block' }} />Platform features</div>
              <h2 className="sec-h" style={{ margin:'0 auto 14px' }}>Built for real placement <em style={{ fontStyle:'italic',color:'var(--accent)' }}>workflows</em></h2>
              <p className="sec-sub" style={{ margin:'0 auto' }}>Not a demo — a full system colleges can actually deploy. Every feature maps to a real placement officer's workflow.</p>
            </div>
          </Reveal>
          <div className="feat-g" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'var(--border)',borderRadius:16,overflow:'hidden',border:'1px solid var(--border)' }}>
            {FEATURES.map((f,i) => (
              <Reveal key={f.t} delay={i*.06}>
                <div className="fc">
                  <div style={{ width:44,height:44,borderRadius:12,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,fontSize:20 }}>{f.icon}</div>
                  <div style={{ fontSize:16,fontWeight:600,color:'var(--text)',marginBottom:10 }}>{f.t}</div>
                  <div style={{ fontSize:14,color:'var(--text2)',lineHeight:1.7 }}>{f.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background:'var(--bg2)',padding:'100px 0' }}>
        <div style={{ maxWidth:1160,margin:'0 auto',padding:'0 52px' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:60 }}>
              <div className="sec-tag" style={{ justifyContent:'center' }}><span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block' }} />How it works</div>
              <h2 className="sec-h">From signup to placement — <em style={{ fontStyle:'italic',color:'var(--accent)' }}>4 steps</em></h2>
            </div>
          </Reveal>
          <div className="steps-g" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,background:'var(--border)',borderRadius:16,overflow:'hidden',border:'1px solid var(--border)' }}>
            {STEPS.map((s,i) => (
              <Reveal key={s.n} delay={i*.08}>
                <div className="step">
                  <div style={{ fontFamily:"'Instrument Serif',serif",fontSize:56,fontWeight:400,color:'var(--border)',position:'absolute',top:16,right:20,lineHeight:1,userSelect:'none' }}>{s.n}</div>
                  <div style={{ width:40,height:40,borderRadius:'50%',background:s.c,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,fontSize:13,fontWeight:700,color:'#fff',position:'relative',zIndex:1 }}>{s.n}</div>
                  <div style={{ fontSize:15,fontWeight:600,color:'var(--text)',marginBottom:8,position:'relative',zIndex:1 }}>{s.t}</div>
                  <div style={{ fontSize:13.5,color:'var(--text2)',lineHeight:1.68,position:'relative',zIndex:1 }}>{s.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX STRIP 1 */}
      <div ref={ps1Ref} style={{ minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',position:'relative',overflow:'hidden',background:'var(--bg)' }}>
        <div style={{ position:'absolute',fontFamily:"'Instrument Serif',serif",fontSize:'clamp(120px,20vw,260px)',fontWeight:400,letterSpacing:'-6px',color:'var(--border)',pointerEvents:'none',userSelect:'none',whiteSpace:'nowrap',transform:`translateX(${ps1x}px)`,willChange:'transform' }}>
          STUDENTS
        </div>
        <div style={{ position:'relative',zIndex:2,maxWidth:720,padding:'0 52px' }}>
          <Reveal>
            <div className="sec-tag" style={{ justifyContent:'center' }}><span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block' }} />For students</div>
            <h2 style={{ fontFamily:"'Instrument Serif',serif",fontSize:'clamp(34px,5vw,64px)',fontWeight:400,letterSpacing:'-1.5px',lineHeight:1.06,color:'var(--text)',marginBottom:22 }}>
              Stop guessing.<br /><em style={{ fontStyle:'italic',color:'var(--accent)' }}>Know your gaps.</em>
            </h2>
            <p style={{ fontSize:18,color:'var(--text2)',lineHeight:1.75,marginBottom:36 }}>
              PrepPulse shows you exactly which skills you're missing for your dream company — and builds a step-by-step plan to close that gap before the placement deadline.
            </p>
            <Link to="/register" className="btn-fill">Register as student</Link>
          </Reveal>
        </div>
      </div>

      {/* ROLES */}
      <section id="roles" style={{ background:'var(--bg2)',padding:'100px 0' }}>
        <div style={{ maxWidth:1160,margin:'0 auto',padding:'0 52px' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:56 }}>
              <div className="sec-tag" style={{ justifyContent:'center' }}><span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block' }} />Three roles</div>
              <h2 className="sec-h">One platform. <em style={{ fontStyle:'italic',color:'var(--accent)' }}>Three perspectives.</em></h2>
            </div>
          </Reveal>
          <div className="roles-g" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20 }}>
            {ROLES.map((r,i) => (
              <Reveal key={r.role} delay={i*.1}>
                <div className="rc tilt" style={{ height:'100%' }}>
                  <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:r.c,opacity:0,transition:'opacity .3s' }}
                    ref={el => { if (el) { const p = el.parentElement; p.addEventListener('mouseenter',()=>el.style.opacity=1); p.addEventListener('mouseleave',()=>el.style.opacity=0) } }} />
                  <div style={{ width:52,height:52,borderRadius:14,background:r.cbg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:22,fontSize:24 }}>{r.icon}</div>
                  <div style={{ fontFamily:"'Instrument Serif',serif",fontSize:26,fontWeight:400,color:'var(--text)',marginBottom:16 }}>{r.role}</div>
                  <ul style={{ listStyle:'none',flex:1,marginBottom:28 }}>
                    {r.items.map(item => (
                      <li key={item} style={{ display:'flex',alignItems:'flex-start',gap:10,fontSize:14,color:'var(--text2)',padding:'7px 0',borderBottom:'1px solid rgba(0,0,0,.05)',lineHeight:1.5 }}>
                        <svg width="13" height="13" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0,marginTop:2 }}><path d="M2 6l3 3 5-5" stroke={r.c} strokeWidth="2" strokeLinecap="round"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={r.link} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'12px 20px',borderRadius:10,fontSize:14,fontWeight:600,color:'#fff',background:r.c,textDecoration:'none',transition:'all .25s',cursor:'none' }}>
                    {r.cta}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOR COLLEGES */}
      <section id="for-colleges" style={{ background:'var(--bg)',padding:'100px 0' }}>
        <div style={{ maxWidth:1160,margin:'0 auto',padding:'0 52px' }}>
          <div className="split-g" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }}>
            <Reveal dir="left">
              <div className="sec-tag"><span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block' }} />For institutions</div>
              <h2 className="sec-h" style={{ marginTop:12 }}>Deploy at your college.<br /><em style={{ fontStyle:'italic',color:'var(--accent)' }}>Own your data.</em></h2>
              <p style={{ fontSize:16,color:'var(--text2)',lineHeight:1.78,marginBottom:28,fontWeight:400 }}>
                PrepPulse is open-source and self-hostable. Your student data never leaves your servers. No subscription, no vendor lock-in — just powerful placement infrastructure.
              </p>
              <ul style={{ listStyle:'none',marginBottom:32 }}>
                {[
                  'Full data ownership — PostgreSQL on your infrastructure',
                  'Local AI via Ollama — zero API cost, runs fully offline',
                  'Multi-department support with per-branch analytics',
                  'Admin dashboard with batch analytics and heatmaps',
                  'Student data stays on campus — FERPA-ready architecture',
                ].map(t => (
                  <li key={t} style={{ display:'flex',alignItems:'flex-start',gap:13,padding:'14px 0',borderBottom:'1px solid rgba(0,0,0,.05)' }}>
                    <div style={{ width:26,height:26,borderRadius:7,background:'rgba(var(--accent-rgb),.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ fontSize:14.5,fontWeight:500,color:'var(--text2)',lineHeight:1.55 }}>{t}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-fill">
                Deploy free today
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </Link>
            </Reveal>

            <Reveal dir="right" delay={0.1}>
              <div className="tilt" style={{ background:'var(--card)',borderRadius:16,border:'1px solid var(--border)',boxShadow:'0 20px 60px rgba(0,0,0,.08)',overflow:'hidden' }}>
                <div style={{ background:'var(--bg2)',padding:'10px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:6 }}>
                  {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width:8,height:8,borderRadius:'50%',background:c }} />)}
                  <div style={{ flex:1,background:'var(--bg)',borderRadius:5,height:18,marginLeft:8,display:'flex',alignItems:'center',padding:'0 8px' }}>
                    <span style={{ fontSize:9,color:'var(--text3)' }}>prepulse.app/admin/analytics</span>
                  </div>
                </div>
                <div style={{ padding:24 }}>
                  <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',marginBottom:3 }}>Placement Command Center</div>
                  <div style={{ fontSize:15,fontWeight:600,color:'var(--text)',marginBottom:18 }}>Department readiness</div>
                  {DEPTS.map(r => (
                    <div key={r.d} style={{ marginBottom:13 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                        <span style={{ fontSize:13,fontWeight:600,color:'var(--text)' }}>{r.d}</span>
                        <span style={{ fontSize:12,fontWeight:700,color:r.c }}>{r.p}%</span>
                      </div>
                      <div style={{ height:6,background:'var(--bg2)',borderRadius:3,overflow:'hidden' }}>
                        <div style={{ width:`${r.p}%`,height:'100%',borderRadius:3,background:r.c,transition:'width 1.2s ease' }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginTop:20 }}>
                    {[{l:'Students',v:247,c:'var(--accent)'},{l:'Placed',v:89,c:'var(--green)'},{l:'Companies',v:34,c:'var(--amber)'}].map(s => (
                      <div key={s.l} style={{ background:'var(--bg)',borderRadius:8,padding:'12px 10px',textAlign:'center',border:'1px solid var(--border)' }}>
                        <div style={{ fontSize:22,fontWeight:700,color:s.c,lineHeight:1,marginBottom:3 }}>{s.v}</div>
                        <div style={{ fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--text3)' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PARALLAX STRIP 2 */}
      <div ref={ps2Ref} style={{ minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',position:'relative',overflow:'hidden',background:'var(--bg2)' }}>
        <div style={{ position:'absolute',fontFamily:"'Instrument Serif',serif",fontSize:'clamp(100px,18vw,240px)',fontWeight:400,letterSpacing:'-6px',color:'var(--border)',pointerEvents:'none',userSelect:'none',whiteSpace:'nowrap',transform:`translateX(${ps2x}px)`,willChange:'transform' }}>
          PLACED
        </div>
        <div style={{ position:'relative',zIndex:2,maxWidth:680,padding:'0 52px' }}>
          <Reveal>
            <h2 style={{ fontFamily:"'Instrument Serif',serif",fontSize:'clamp(32px,5vw,62px)',fontWeight:400,letterSpacing:'-1.5px',lineHeight:1.06,color:'var(--text)',marginBottom:22 }}>
              Your placement cell.<br /><em style={{ fontStyle:'italic',color:'var(--accent)' }}>Fully automated.</em>
            </h2>
            <p style={{ fontSize:18,color:'var(--text2)',lineHeight:1.75,marginBottom:36 }}>
              Stop managing spreadsheets. PrepPulse gives your team real-time intelligence — who is ready, who needs help, and who is matched to which company.
            </p>
            <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
              <Link to="/register" className="btn-fill">Get started free</Link>
              <Link to="/login" className="btn-out">Sign in to existing account</Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'var(--bg3)',borderTop:'1px solid var(--border)',padding:'72px 52px 36px' }}>
        <div style={{ maxWidth:1160,margin:'0 auto' }}>
          <div className="ft-g" style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:48,marginBottom:52 }}>
            <div>
              <div style={{ marginBottom:14 }}><PPLogo size={30} theme={theme} /></div>
              <p style={{ fontSize:13,color:'var(--text3)',lineHeight:1.75,maxWidth:256,marginBottom:18 }}>
                AI-Driven Campus Placement Decision Support System. Built for KIIT — deployable for any institution.
              </p>
              <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
                {['FastAPI','React','PostgreSQL','Ollama'].map(t => (
                  <span key={t} style={{ fontSize:11,fontWeight:600,color:'var(--accent)',background:'rgba(var(--accent-rgb),.08)',padding:'3px 10px',borderRadius:5,border:'1px solid rgba(var(--accent-rgb),.15)' }}>{t}</span>
                ))}
              </div>
            </div>
            {[
              { title:'Product', links:[['Dashboard','/login'],['Browse jobs','/login'],['My profile','/login'],['Applications','/login']] },
              { title:'Roles', links:[['For students','/register'],['For admins','/login'],['For companies','/register'],['API docs','https://prepulse-api.onrender.com/api/docs']] },
              { title:'Team', links:[['Ansh Raj · 2330289','#'],['Manya Singh · 2330311','#'],['Preetush Bhowmik · 2330175','#'],['Labani Sen · 2330309','#']] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text3)',marginBottom:18 }}>{col.title}</div>
                <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
                  {col.links.map(([l,h]) => (
                    <a key={l} href={h} style={{ fontSize:13.5,color:'var(--text2)',transition:'color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
                      onMouseLeave={e => e.currentTarget.style.color='var(--text2)'}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid var(--border)',paddingTop:22,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
            <span style={{ fontSize:12,color:'var(--text3)' }}>© 2025 PrepPulse · Software Engineering Lab · KIIT University</span>
            <span style={{ fontSize:12,color:'var(--text3)' }}>Open Source · Render + Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
