// import { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { ArrowRight, CheckCircle } from 'lucide-react'

// function PPLogo({ size = 40 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="10" fill="#0F172A" />
//       <rect x="8" y="10" width="3" height="20" fill="white" />
//       <rect x="8" y="10" width="10" height="3" fill="white" />
//       <rect x="15" y="10" width="3" height="9" fill="white" />
//       <rect x="8" y="16" width="10" height="3" fill="white" />
//       <path d="M22 20 L30 20 M26 16 L30 20 L26 24" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//       <circle cx="32" cy="12" r="3" fill="#6366F1" />
//     </svg>
//   )
// }

// function Counter({ to, suffix = '', prefix = '' }) {
//   const [val, setVal] = useState(0)
//   const ref = useRef(null)
//   const started = useRef(false)
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => {
//       if (e.isIntersecting && !started.current) {
//         started.current = true
//         const start = Date.now()
//         const tick = () => {
//           const p = Math.min((Date.now() - start) / 2000, 1)
//           const ease = 1 - Math.pow(1 - p, 3)
//           setVal(Math.floor(ease * to))
//           if (p < 1) requestAnimationFrame(tick)
//           else setVal(to)
//         }
//         requestAnimationFrame(tick)
//       }
//     }, { threshold: 0.5 })
//     if (ref.current) obs.observe(ref.current)
//     return () => obs.disconnect()
//   }, [to])
//   return <span ref={ref}>{prefix}{val}{suffix}</span>
// }

// function useReveal() {
//   const ref = useRef(null)
//   const [vis, setVis] = useState(false)
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
//     if (ref.current) obs.observe(ref.current)
//     return () => obs.disconnect()
//   }, [])
//   return { ref, vis }
// }

// function Reveal({ children, delay = 0, style = {} }) {
//   const { ref, vis } = useReveal()
//   return (
//     <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(36px)', transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`, ...style }}>
//       {children}
//     </div>
//   )
// }

// function Card3D({ children, style = {} }) {
//   const ref = useRef(null)
//   const [tilt, setTilt] = useState({})
//   return (
//     <div ref={ref} style={{ ...tilt, ...style }}
//       onMouseMove={e => {
//         const r = ref.current.getBoundingClientRect()
//         const x = ((e.clientX - r.left) / r.width - 0.5) * 2
//         const y = ((e.clientY - r.top) / r.height - 0.5) * 2
//         setTilt({ transform: `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`, transition: 'transform 0.1s ease' })
//       }}
//       onMouseLeave={() => setTilt({ transform: 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)', transition: 'transform 0.6s ease' })}>
//       {children}
//     </div>
//   )
// }

// export default function LandingPage() {
//   const [scrolled, setScrolled] = useState(false)
//   const [dark, setDark] = useState(false)
//   const [py, setPy] = useState(0)

//   useEffect(() => {
//     const fn = () => { setScrolled(window.scrollY > 40); setPy(window.scrollY) }
//     window.addEventListener('scroll', fn, { passive: true })
//     return () => window.removeEventListener('scroll', fn)
//   }, [])

//   const bg = dark ? '#0F172A' : '#FAFAFA'
//   const tx = dark ? '#F1F5F9' : '#0F172A'
//   const ts = dark ? '#94A3B8' : '#475569'
//   const cd = dark ? '#1E293B' : '#FFFFFF'
//   const bd = dark ? '#334155' : '#E2E8F0'

//   return (
//     <div style={{ fontFamily: "'Sora','DM Sans',system-ui,sans-serif", background: bg, color: tx, overflowX: 'hidden', transition: 'background 0.3s,color 0.3s' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap');
//         *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
//         html{scroll-behavior:smooth}a{text-decoration:none;color:inherit}button{font-family:inherit;cursor:pointer}
//         ::selection{background:#6366F1;color:white}
//         .grad-text{background:linear-gradient(135deg,#6366F1,#8B5CF6,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
//         .chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;text-transform:uppercase;letter-spacing:.07em}
//         .btn-dark{display:inline-flex;align-items:center;gap:8px;background:#0F172A;color:white;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:700;border:none;transition:all .3s;cursor:pointer;text-decoration:none}
//         .btn-dark:hover{background:#6366F1;transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,.35)}
//         .btn-ghost{display:inline-flex;align-items:center;gap:8px;background:transparent;color:inherit;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:600;border:2px solid;transition:all .3s;cursor:pointer;text-decoration:none}
//         .feature-card{border-radius:20px;padding:32px;border:1px solid;transition:all .4s}
//         .feature-card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(99,102,241,.12)}
//         .role-card{border-radius:24px;padding:36px 28px;border:1px solid;transition:all .4s;display:flex;flex-direction:column}
//         .role-card:hover{transform:translateY(-8px)}
//         .nav-a{font-size:14px;font-weight:500;position:relative;padding-bottom:2px}
//         .nav-a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:#6366F1;transition:width .3s}
//         .nav-a:hover::after{width:100%}
//         .float{animation:float 6s ease-in-out infinite}
//         .float-slow{animation:float 9s ease-in-out infinite}
//         @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
//         .marquee-wrap{overflow:hidden}
//         .marquee{display:flex;gap:32px;animation:mq 22s linear infinite;white-space:nowrap}
//         @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
//         .grid-bg{background-image:linear-gradient(rgba(99,102,241,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.05) 1px,transparent 1px);background-size:48px 48px}
//         .stat-num{font-family:'Fraunces',serif;font-size:clamp(36px,5vw,60px);font-weight:900;line-height:1}
//         @media(max-width:768px){.hide-m{display:none!important}.grid-2{grid-template-columns:1fr!important}.grid-3{grid-template-columns:1fr!important}.grid-4{grid-template-columns:1fr 1fr!important}.hero-r{display:none!important}}
//       `}</style>

//       {/* NAV */}
//       <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,height:66,padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',background:scrolled?(dark?'rgba(15,23,42,.95)':'rgba(255,255,255,.95)'):'transparent',backdropFilter:'blur(16px)',borderBottom:scrolled?`1px solid ${bd}`:'1px solid transparent',transition:'all .3s' }}>
//         <Link to="/" style={{ display:'flex',alignItems:'center',gap:10 }}>
//           <PPLogo size={34} />
//           <span style={{ fontFamily:'Fraunces,serif',fontSize:20,fontWeight:900,color:tx,letterSpacing:'-0.5px' }}>Prep<span style={{ color:'#6366F1' }}>Pulse</span></span>
//         </Link>
//         <div className="hide-m" style={{ display:'flex',gap:32,alignItems:'center' }}>
//           {['Features','How it Works','For Colleges','Roles'].map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="nav-a" style={{ color:ts }}>{l}</a>)}
//         </div>
//         <div style={{ display:'flex',gap:10,alignItems:'center' }}>
//           <button onClick={() => setDark(d=>!d)} style={{ width:34,height:34,borderRadius:'50%',border:`1px solid ${bd}`,background:'transparent',color:ts,fontSize:15,display:'flex',alignItems:'center',justifyContent:'center' }}>{dark?'☀':'◑'}</button>
//           <Link to="/login" style={{ fontSize:14,fontWeight:600,color:ts,padding:'8px 14px' }}>Sign In</Link>
//           <Link to="/register" className="btn-dark" style={{ padding:'10px 20px',fontSize:13,borderRadius:100 }}>Get Started <ArrowRight size={13} /></Link>
//         </div>
//       </nav>

//       {/* HERO */}
//       <section style={{ minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',paddingTop:66 }}>
//         <div className="grid-bg" style={{ position:'absolute',inset:0,opacity:dark?.5:1 }} />
//         <div style={{ position:'absolute',top:'10%',right:'6%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.13) 0%,transparent 70%)',transform:`translateY(${py*.2}px)`,pointerEvents:'none' }} />
//         <div style={{ position:'absolute',bottom:'10%',left:'4%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(236,72,153,.09) 0%,transparent 70%)',transform:`translateY(${py*-.1}px)`,pointerEvents:'none' }} />
//         <div style={{ maxWidth:1200,margin:'0 auto',padding:'60px 40px',width:'100%',position:'relative',zIndex:1 }}>
//           <div style={{ display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:60,alignItems:'center' }} className="grid-2">
//             <div>
//               <Reveal>
//                 <span className="chip" style={{ background:dark?'rgba(99,102,241,.18)':'#EEF2FF',color:'#6366F1',border:'1px solid rgba(99,102,241,.25)',marginBottom:24 }}>
//                   <span style={{ width:6,height:6,borderRadius:'50%',background:'#6366F1',display:'inline-block' }} />
//                   Campus Placement System · v2.0
//                 </span>
//               </Reveal>
//               <Reveal delay={0.08}>
//                 <h1 style={{ fontFamily:'Fraunces,serif',fontSize:'clamp(38px,5.5vw,70px)',fontWeight:900,lineHeight:1.05,marginBottom:22,letterSpacing:'-2px',color:tx }}>
//                   From Skill Gaps<br />to <span className="grad-text">Placement</span><br />Offers.
//                 </h1>
//               </Reveal>
//               <Reveal delay={0.16}>
//                 <p style={{ fontSize:17,color:ts,lineHeight:1.78,marginBottom:36,maxWidth:460 }}>
//                   PrepPulse maps every student's profile against live company requirements — scores the gap, ranks candidates, and generates a learning roadmap using local AI. Built for colleges.
//                 </p>
//               </Reveal>
//               <Reveal delay={0.22}>
//                 <div style={{ display:'flex',gap:14,flexWrap:'wrap',marginBottom:40 }}>
//                   <Link to="/register" className="btn-dark">Start Free <ArrowRight size={15} /></Link>
//                   <Link to="/login" className="btn-ghost" style={{ borderColor:bd,color:tx }}>Sign In →</Link>
//                 </div>
//                 <div style={{ display:'flex',gap:24,flexWrap:'wrap' }}>
//                   {['3 User Roles','Local LLM · No API Cost','Real-time Match Engine'].map(t => (
//                     <span key={t} style={{ display:'flex',alignItems:'center',gap:7,fontSize:13,color:ts,fontWeight:500 }}>
//                       <CheckCircle size={13} color="#6366F1" />{t}
//                     </span>
//                   ))}
//                 </div>
//               </Reveal>
//             </div>

//             {/* Dashboard mockup */}
//             <Reveal delay={0.15} style={{ position:'relative' }} className="hero-r">
//               <Card3D>
//                 <div style={{ background:cd,borderRadius:22,border:`1px solid ${bd}`,boxShadow:`0 28px 80px rgba(0,0,0,${dark?.4:.1})`,overflow:'hidden' }}>
//                   <div style={{ background:dark?'#1E293B':'#F8FAFC',padding:'10px 18px',borderBottom:`1px solid ${bd}`,display:'flex',alignItems:'center',gap:7 }}>
//                     {['#FF5F57','#FFBD2E','#28CA41'].map(c=><div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c }} />)}
//                     <div style={{ flex:1,background:dark?'#334155':'#E2E8F0',borderRadius:6,height:18,marginLeft:10,display:'flex',alignItems:'center',paddingLeft:10 }}>
//                       <span style={{ fontSize:10,color:ts }}>prepulse.vercel.app/student</span>
//                     </div>
//                   </div>
//                   <div style={{ padding:22 }}>
//                     <p style={{ fontSize:10,fontWeight:700,color:'#6366F1',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3 }}>Student Dashboard</p>
//                     <h3 style={{ fontSize:17,fontWeight:700,color:tx,marginBottom:18 }}>Welcome back, Ansh 👋</h3>
//                     <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18 }}>
//                       {[{l:'CGPA',v:'8.2',c:'#6366F1'},{l:'Skills',v:'12',c:'#8B5CF6'},{l:'Applied',v:'4',c:'#EC4899'}].map(s=>(
//                         <div key={s.l} style={{ background:dark?'#0F172A':'#F8FAFC',borderRadius:10,padding:'12px 14px',border:`1px solid ${bd}` }}>
//                           <p style={{ fontSize:9,color:ts,marginBottom:3,fontWeight:700,textTransform:'uppercase' }}>{s.l}</p>
//                           <p style={{ fontSize:20,fontWeight:800,color:s.c }}>{s.v}</p>
//                         </div>
//                       ))}
//                     </div>
//                     <p style={{ fontSize:10,fontWeight:700,color:ts,marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em' }}>Top Job Matches</p>
//                     {[{j:'Software Engineer — Infosys',m:87,c:'#6366F1'},{j:'Full Stack Dev — Wipro',m:72,c:'#8B5CF6'},{j:'Data Analyst — TCS',m:58,c:'#EC4899'}].map(j=>(
//                       <div key={j.j} style={{ marginBottom:10 }}>
//                         <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
//                           <span style={{ fontSize:11,color:tx,fontWeight:500 }}>{j.j}</span>
//                           <span style={{ fontSize:11,fontWeight:700,color:j.c }}>{j.m}%</span>
//                         </div>
//                         <div style={{ height:5,background:dark?'#334155':'#F1F5F9',borderRadius:3,overflow:'hidden' }}>
//                           <div style={{ width:`${j.m}%`,height:'100%',background:j.c,borderRadius:3 }} />
//                         </div>
//                       </div>
//                     ))}
//                     <div style={{ marginTop:14,padding:'10px 14px',background:'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.1))',borderRadius:10,border:'1px solid rgba(99,102,241,.2)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
//                       <span style={{ fontSize:11,fontWeight:600,color:'#6366F1' }}>✦ AI Roadmap Ready</span>
//                       <span style={{ fontSize:10,color:ts }}>3 steps to close gap →</span>
//                     </div>
//                   </div>
//                 </div>
//               </Card3D>
//               <div className="float" style={{ position:'absolute',top:-16,right:-16,background:'#10B981',color:'white',borderRadius:10,padding:'9px 14px',fontSize:11,fontWeight:700,boxShadow:'0 8px 24px rgba(16,185,129,.35)',whiteSpace:'nowrap' }}>✓ 87% Match Found</div>
//               <div className="float-slow" style={{ position:'absolute',bottom:40,left:-20,background:cd,border:`1px solid ${bd}`,borderRadius:10,padding:'9px 13px',fontSize:10,fontWeight:600,color:'#6366F1',boxShadow:'0 8px 20px rgba(0,0,0,.08)',whiteSpace:'nowrap' }}>🧠 AI Roadmap Generated</div>
//             </Reveal>
//           </div>
//         </div>
//       </section>

//       {/* MARQUEE */}
//       <div style={{ borderTop:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,padding:'13px 0',overflow:'hidden' }}>
//         <div className="marquee">
//           {[...Array(2)].flatMap((_,i)=>['Smart Match Engine','AI Learning Roadmaps','3-Role System','Local LLM · Ollama','Real-time Analytics','Department Heatmaps','Company Portal','Skill Gap Detection','Placement Tracking','Campus-Ready'].map(t=>(
//             <span key={`${i}${t}`} style={{ display:'inline-flex',alignItems:'center',gap:12,fontSize:12,fontWeight:600,color:ts,paddingRight:32,whiteSpace:'nowrap' }}>
//               <span style={{ color:'#6366F1' }}>◆</span>{t}
//             </span>
//           )))}
//         </div>
//       </div>

//       {/* STATS */}
//       <section style={{ padding:'72px 40px',maxWidth:1200,margin:'0 auto' }}>
//         <Reveal>
//           <div className="grid-4" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2,border:`1px solid ${bd}`,borderRadius:20,overflow:'hidden' }}>
//             {[{l:'Students Tracked',to:500,s:'+',n:'Across departments'},{l:'Companies Onboarded',to:50,s:'+',n:'Actively hiring'},{l:'Match Accuracy',to:94,s:'%',n:'Skill-to-job fit'},{l:'Placement Rate',to:78,s:'%',n:'With AI guidance'}].map((s,i)=>(
//               <div key={s.l} style={{ padding:'36px 28px',background:cd,borderRight:i<3?`1px solid ${bd}`:'none',textAlign:'center' }}>
//                 <p className="stat-num" style={{ color:'#6366F1',marginBottom:8 }}><Counter to={s.to} suffix={s.s} /></p>
//                 <p style={{ fontSize:14,fontWeight:700,color:tx,marginBottom:4 }}>{s.l}</p>
//                 <p style={{ fontSize:12,color:ts }}>{s.n}</p>
//               </div>
//             ))}
//           </div>
//         </Reveal>
//       </section>

//       {/* FEATURES */}
//       <section id="features" style={{ padding:'72px 40px',maxWidth:1200,margin:'0 auto' }}>
//         <Reveal>
//           <div style={{ textAlign:'center',marginBottom:56 }}>
//             <span className="chip" style={{ background:dark?'rgba(99,102,241,.15)':'#EEF2FF',color:'#6366F1',marginBottom:16,display:'inline-flex' }}>Platform Features</span>
//             <h2 style={{ fontFamily:'Fraunces,serif',fontSize:'clamp(30px,4vw,50px)',fontWeight:900,color:tx,letterSpacing:'-1.5px',marginBottom:14 }}>Built for real placement <em>workflows</em></h2>
//             <p style={{ fontSize:16,color:ts,maxWidth:500,margin:'0 auto',lineHeight:1.7 }}>Not a demo — a full system colleges can actually deploy. Every feature maps to a real placement officer's workflow.</p>
//           </div>
//         </Reveal>
//         <div className="grid-3" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18 }}>
//           {[
//             {icon:'⚡',c:'#6366F1',bg:dark?'rgba(99,102,241,.1)':'#EEF2FF',t:'Intelligent Match Engine',d:'Weighted algorithm combining CGPA, skills, branch, and certifications to produce a precise compatibility score for every student-job pair.'},
//             {icon:'🧠',c:'#8B5CF6',bg:dark?'rgba(139,92,246,.1)':'#F5F3FF',t:'Local AI Roadmaps',d:'When a student falls short, the system generates a 3-step personalized learning plan using Ollama — no external API, no cost, no data leaks.'},
//             {icon:'📊',c:'#EC4899',bg:dark?'rgba(236,72,153,.1)':'#FDF2F8',t:'Placement Command Center',d:'Department-wise readiness heatmaps, pipeline charts, and student drill-downs give placement officers real intelligence — not just numbers.'},
//             {icon:'🏢',c:'#10B981',bg:dark?'rgba(16,185,129,.1)':'#ECFDF5',t:'Company Recruiter Portal',d:'Companies post jobs with skill criteria. The system auto-ranks students. Recruiters update candidate status and manage their entire pipeline.'},
//             {icon:'🎯',c:'#F59E0B',bg:dark?'rgba(245,158,11,.1)':'#FFFBEB',t:'Skill Gap Analysis',d:'Side-by-side view of what a student has vs what a company needs. Missing skills highlighted. Match percentage calculated instantly.'},
//             {icon:'🏆',c:'#06B6D4',bg:dark?'rgba(6,182,212,.1)':'#ECFEFF',t:'Student Leaderboard',d:'Department-wise ranking by placement readiness score. Motivates students and helps admins identify who needs intervention before deadlines.'},
//           ].map((f,i)=>(
//             <Reveal key={f.t} delay={i*.07}>
//               <Card3D style={{ height:'100%' }}>
//                 <div className="feature-card" style={{ background:cd,borderColor:bd,height:'100%' }}>
//                   <div style={{ width:46,height:46,borderRadius:13,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:18 }}>{f.icon}</div>
//                   <h3 style={{ fontSize:15,fontWeight:700,color:tx,marginBottom:9 }}>{f.t}</h3>
//                   <p style={{ fontSize:13,color:ts,lineHeight:1.7 }}>{f.d}</p>
//                 </div>
//               </Card3D>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="how-it-works" style={{ padding:'72px 40px',background:dark?'#0A0F1E':'#F8FAFC' }}>
//         <div style={{ maxWidth:1200,margin:'0 auto' }}>
//           <Reveal>
//             <div style={{ textAlign:'center',marginBottom:56 }}>
//               <span className="chip" style={{ background:dark?'rgba(99,102,241,.15)':'#EEF2FF',color:'#6366F1',marginBottom:16,display:'inline-flex' }}>How It Works</span>
//               <h2 style={{ fontFamily:'Fraunces,serif',fontSize:'clamp(30px,4vw,50px)',fontWeight:900,color:tx,letterSpacing:'-1.5px' }}>From signup to placement — <em>4 steps</em></h2>
//             </div>
//           </Reveal>
//           <div className="grid-4" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:28,position:'relative' }}>
//             {[
//               {n:'01',t:'Students Register',d:'Fill profile — CGPA, skills, certifications, branch. Takes 3 minutes.',c:'#6366F1'},
//               {n:'02',t:'Companies Post Jobs',d:'Recruiters list openings with skill requirements, CGPA cutoff, and allowed branches.',c:'#8B5CF6'},
//               {n:'03',t:'AI Matches & Ranks',d:'Match engine scores every student for every job. Admin sees ranked lists instantly.',c:'#EC4899'},
//               {n:'04',t:'Placed or Guided',d:'Eligible students apply. Ineligible get an AI roadmap to close the gap before the deadline.',c:'#10B981'},
//             ].map((s,i)=>(
//               <Reveal key={s.n} delay={i*.1}>
//                 <div style={{ textAlign:'center',position:'relative' }}>
//                   {i<3 && <div className="hide-m" style={{ position:'absolute',top:26,left:'calc(50% + 28px)',width:'calc(100% - 56px)',height:2,background:`linear-gradient(90deg,${s.c}50,#E2E8F040)` }} />}
//                   <div style={{ width:52,height:52,borderRadius:'50%',background:`linear-gradient(135deg,${s.c},${s.c}80)`,color:'white',fontSize:14,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',boxShadow:`0 8px 24px ${s.c}35`,position:'relative',zIndex:1 }}>{s.n}</div>
//                   <h3 style={{ fontSize:15,fontWeight:700,color:tx,marginBottom:9 }}>{s.t}</h3>
//                   <p style={{ fontSize:13,color:ts,lineHeight:1.7 }}>{s.d}</p>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FOR COLLEGES */}
//       <section id="for-colleges" style={{ padding:'72px 40px',maxWidth:1200,margin:'0 auto' }}>
//         <div className="grid-2" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center' }}>
//           <Reveal>
//             <span className="chip" style={{ background:dark?'rgba(16,185,129,.15)':'#ECFDF5',color:'#10B981',marginBottom:20,display:'inline-flex' }}>For Institutions</span>
//             <h2 style={{ fontFamily:'Fraunces,serif',fontSize:'clamp(26px,3.5vw,42px)',fontWeight:900,color:tx,marginBottom:18,letterSpacing:'-1px',lineHeight:1.1 }}>Deploy at your college.<br />Own your placement data.</h2>
//             <p style={{ fontSize:15,color:ts,lineHeight:1.8,marginBottom:28 }}>PrepPulse is open-source and self-hostable. Your student data never leaves your servers. No subscription, no vendor lock-in.</p>
//             {['Full data ownership — PostgreSQL on your infra','Local AI via Ollama — zero API cost','Multi-department support out of the box','Admin dashboard with batch analytics'].map(t=>(
//               <div key={t} style={{ display:'flex',alignItems:'flex-start',gap:11,marginBottom:13 }}>
//                 <CheckCircle size={15} color="#10B981" style={{ flexShrink:0,marginTop:2 }} />
//                 <span style={{ fontSize:14,color:tx,fontWeight:500 }}>{t}</span>
//               </div>
//             ))}
//             <Link to="/register" className="btn-dark" style={{ marginTop:28,display:'inline-flex' }}>Deploy Free <ArrowRight size={15} /></Link>
//           </Reveal>
//           <Reveal delay={0.15}>
//             <Card3D>
//               <div style={{ background:cd,borderRadius:18,border:`1px solid ${bd}`,padding:26,boxShadow:`0 24px 64px rgba(0,0,0,${dark?.3:.07})` }}>
//                 <p style={{ fontSize:11,fontWeight:700,color:'#10B981',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3 }}>Placement Command Center</p>
//                 <h3 style={{ fontSize:15,fontWeight:700,color:tx,marginBottom:18 }}>Department Readiness</h3>
//                 {[{d:'CSE',p:100,s:'6/6'},{d:'ECSC',p:89,s:'8/9'},{d:'AIDS',p:100,s:'3/3'},{d:'EEE',p:50,s:'1/2'},{d:'IT',p:100,s:'4/4'}].map(r=>(
//                   <div key={r.d} style={{ marginBottom:12 }}>
//                     <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
//                       <span style={{ fontSize:12,fontWeight:600,color:tx }}>{r.d}</span>
//                       <div style={{ display:'flex',gap:10 }}>
//                         <span style={{ fontSize:11,color:ts }}>{r.s}</span>
//                         <span style={{ fontSize:11,fontWeight:700,color:r.p>=90?'#10B981':r.p>=60?'#F59E0B':'#EF4444' }}>{r.p}%</span>
//                       </div>
//                     </div>
//                     <div style={{ height:7,background:dark?'#334155':'#F1F5F9',borderRadius:4,overflow:'hidden' }}>
//                       <div style={{ width:`${r.p}%`,height:'100%',borderRadius:4,background:r.p>=90?'#10B981':r.p>=60?'#F59E0B':'#EF4444',transition:'width 1.2s ease' }} />
//                     </div>
//                   </div>
//                 ))}
//                 <div style={{ marginTop:18,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9 }}>
//                   {[{l:'Students',v:'27',c:'#6366F1'},{l:'Placed',v:'2',c:'#10B981'},{l:'Companies',v:'10',c:'#F59E0B'}].map(s=>(
//                     <div key={s.l} style={{ background:dark?'#0F172A':'#F8FAFC',borderRadius:9,padding:'10px 12px',textAlign:'center',border:`1px solid ${bd}` }}>
//                       <p style={{ fontSize:18,fontWeight:800,color:s.c,marginBottom:2 }}>{s.v}</p>
//                       <p style={{ fontSize:9,color:ts,fontWeight:600,textTransform:'uppercase' }}>{s.l}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </Card3D>
//           </Reveal>
//         </div>
//       </section>

//       {/* ROLES */}
//       <section id="roles" style={{ padding:'72px 40px',background:dark?'#0A0F1E':'#F8FAFC' }}>
//         <div style={{ maxWidth:1200,margin:'0 auto' }}>
//           <Reveal>
//             <div style={{ textAlign:'center',marginBottom:52 }}>
//               <span className="chip" style={{ background:dark?'rgba(99,102,241,.15)':'#EEF2FF',color:'#6366F1',marginBottom:16,display:'inline-flex' }}>Three Roles</span>
//               <h2 style={{ fontFamily:'Fraunces,serif',fontSize:'clamp(30px,4vw,50px)',fontWeight:900,color:tx,letterSpacing:'-1.5px' }}>One platform. <em>Three perspectives.</em></h2>
//             </div>
//           </Reveal>
//           <div className="grid-3" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20 }}>
//             {[
//               {role:'Student',icon:'🎓',grad:'linear-gradient(135deg,#6366F1,#8B5CF6)',items:['Skill gap analysis vs live jobs','AI-generated learning roadmap','Match score for every opening','Application tracking dashboard'],cta:'Register as Student',link:'/register'},
//               {role:'Admin',icon:'📋',grad:'linear-gradient(135deg,#10B981,#059669)',items:['Batch placement analytics','Department readiness heatmap','All students with drill-down','Application pipeline charts'],cta:'Admin Access',link:'/login'},
//               {role:'Company',icon:'🏢',grad:'linear-gradient(135deg,#F59E0B,#EF4444)',items:['Post jobs with skill criteria','Auto-ranked candidate list','Status update per candidate','Edit, close, or delete postings'],cta:'Register as Recruiter',link:'/register'},
//             ].map((r,i)=>(
//               <Reveal key={r.role} delay={i*.1}>
//                 <div className="role-card" style={{ background:cd,borderColor:bd }}>
//                   <div style={{ width:50,height:50,borderRadius:14,background:r.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:18 }}>{r.icon}</div>
//                   <h3 style={{ fontSize:20,fontWeight:900,color:tx,marginBottom:18,fontFamily:'Fraunces,serif' }}>{r.role}</h3>
//                   <div style={{ flex:1,marginBottom:24 }}>
//                     {r.items.map(item=>(
//                       <div key={item} style={{ display:'flex',gap:9,marginBottom:11,alignItems:'flex-start' }}>
//                         <CheckCircle size={13} color="#10B981" style={{ flexShrink:0,marginTop:2 }} />
//                         <span style={{ fontSize:13,color:ts,lineHeight:1.5 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                   <Link to={r.link} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'12px 20px',borderRadius:100,background:r.grad,color:'white',fontWeight:700,fontSize:13,textDecoration:'none' }}>
//                     {r.cta} <ArrowRight size={13} />
//                   </Link>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section style={{ padding:'80px 40px',background:'linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#0F172A 100%)',position:'relative',overflow:'hidden' }}>
//         <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%)',pointerEvents:'none' }} />
//         <Reveal>
//           <div style={{ textAlign:'center',position:'relative',zIndex:1 }}>
//             <h2 style={{ fontFamily:'Fraunces,serif',fontSize:'clamp(32px,5vw,58px)',fontWeight:900,color:'white',marginBottom:18,letterSpacing:'-2px' }}>
//               Your placement cell.<br /><span style={{ color:'#818CF8' }}>Fully automated.</span>
//             </h2>
//             <p style={{ fontSize:16,color:'#94A3B8',marginBottom:36,maxWidth:460,margin:'0 auto 36px' }}>
//               Stop managing spreadsheets. PrepPulse gives your placement team real-time intelligence — who is ready, who needs help, and who is matched.
//             </p>
//             <div style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
//               <Link to="/register" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'#6366F1',color:'white',padding:'15px 32px',borderRadius:100,fontWeight:700,fontSize:15,textDecoration:'none' }}>
//                 Get Started Free <ArrowRight size={16} />
//               </Link>
//               <Link to="/login" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'transparent',color:'white',padding:'14px 32px',borderRadius:100,fontWeight:600,fontSize:15,textDecoration:'none',border:'1.5px solid rgba(255,255,255,.25)' }}>
//                 Sign In →
//               </Link>
//             </div>
//           </div>
//         </Reveal>
//       </section>

//       {/* FOOTER */}
//       <footer style={{ background:'#0F172A',padding:'48px 40px 24px',borderTop:'1px solid #1E293B' }}>
//         <div style={{ maxWidth:1200,margin:'0 auto' }}>
//           <div className="grid-4" style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:44,marginBottom:44 }}>
//             <div>
//               <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
//                 <PPLogo size={30} />
//                 <span style={{ fontFamily:'Fraunces,serif',fontSize:17,fontWeight:900,color:'white' }}>Prep<span style={{ color:'#6366F1' }}>Pulse</span></span>
//               </div>
//               <p style={{ fontSize:12,color:'#475569',lineHeight:1.75,maxWidth:240,marginBottom:18 }}>AI-Driven Campus Placement Decision Support System. Built for KIIT — deployable for any institution.</p>
//               <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
//                 {['FastAPI','React','PostgreSQL','Ollama'].map(t=>(
//                   <span key={t} style={{ fontSize:10,fontWeight:700,color:'#6366F1',background:'rgba(99,102,241,.12)',padding:'3px 9px',borderRadius:5 }}>{t}</span>
//                 ))}
//               </div>
//             </div>
//             {[
//               {title:'Product',links:[['Dashboard','/login'],['Browse Jobs','/login'],['My Profile','/login'],['Applications','/login']]},
//               {title:'Roles',links:[['For Students','/register'],['For Admins','/login'],['For Companies','/register'],['API Docs','https://prepulse-api.onrender.com/api/docs']]},
//               {title:'Team',links:[['Ansh Raj · 2330289','#'],['Manya Singh · 2330311','#'],['Preetush Bhowmik · 2330175','#'],['Labani Sen · 2330309','#']]},
//             ].map(col=>(
//               <div key={col.title}>
//                 <p style={{ fontSize:9,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14 }}>{col.title}</p>
//                 <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
//                   {col.links.map(([l,h])=>(
//                     <a key={l} href={h} style={{ fontSize:12,color:'#475569',transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='#E2E8F0'} onMouseLeave={e=>e.currentTarget.style.color='#475569'}>{l}</a>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div style={{ borderTop:'1px solid #1E293B',paddingTop:18,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
//             <p style={{ fontSize:11,color:'#334155' }}>© 2025 PrepPulse · Software Engineering Lab Project · KIIT University</p>
//             <p style={{ fontSize:11,color:'#334155' }}>Deployed on Render + Vercel · Open Source</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
