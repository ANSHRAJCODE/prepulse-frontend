import { Link } from 'react-router-dom'
import { Brain, Zap, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'
import PrepPulseLogo from '../components/shared/Logo'

const features = [
  { icon: Brain, title: "Personalized Learning Plans", desc: "When a student falls short, the system doesn't just reject — it generates a step-by-step plan to close the gap using a local AI engine.", color: "text-indigo-400" },
  { icon: Zap, title: "Intelligent Match Scoring", desc: "A weighted algorithm combining academic performance and technical skills produces a precise compatibility score for every job opening.", color: "text-orange-400" },
  { icon: Users, title: "Three-Role Architecture", desc: "Students, Placement Officers, and Company Recruiters each get a tailored dashboard — one system, three distinct workflows.", color: "text-emerald-400" },
  { icon: BarChart3, title: "Institutional Analytics", desc: "Department-wise readiness reports and pipeline tracking give placement officers the data they need to intervene early and effectively.", color: "text-violet-400" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PrepPulseLogo size={32} />
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              PrepPulse
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-medium px-4 py-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-orange-500/6 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">

          {/* Version tag — clean, human, no AI buzzwords */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-10 border"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Campus Placement Management System &nbsp;·&nbsp; v1.0
          </div>

          {/* Headline — professional, direct */}
          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] mb-7" style={{ color: 'var(--text-primary)' }}>
            From Skill Gaps to<br />
            <span className="gradient-text">Placement Offers.</span>
          </h1>

          {/* Subtext — factual, no hype */}
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
            PrepPulse maps each student's profile against company requirements in real time,
            surfaces exactly what is missing, and generates a structured learning plan to close
            that gap — before the deadline.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login"
              className="text-base px-8 py-3.5 rounded-xl font-medium border transition-all"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { value: "3 Roles",     label: "Student · Admin · Company" },
              { value: "Real-time",   label: "Match Engine" },
              { value: "Local LLM",   label: "Ollama · Llama3" },
              { value: "Open Source", label: "No API Costs" },
            ].map((s, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className="text-lg font-bold gradient-text">{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Everything the Placement Process Needs
            </h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: 'var(--text-secondary)' }}>
              Designed around how campus placements actually work — not how they look in textbooks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6 hover:border-indigo-500/40 transition-all duration-300">
                <div className={`${f.color} mb-4`}><f.icon className="w-6 h-6" /></div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Three Roles. One Platform.
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Each role gets a dedicated dashboard built around their specific workflow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: "Student",
                color: "from-indigo-600 to-violet-600",
                items: ["Skill gap analysis", "AI learning roadmaps", "Job match scoring", "Application tracking"],
                cta: "Register as Student"
              },
              {
                role: "Admin",
                color: "from-emerald-600 to-teal-600",
                items: ["Batch analytics", "Readiness heatmaps", "Pipeline management", "Department reports"],
                cta: "Admin Access"
              },
              {
                role: "Company",
                color: "from-orange-500 to-red-600",
                items: ["Post job openings", "Define skill criteria", "Ranked candidates", "Status management"],
                cta: "Register as Recruiter"
              },
            ].map((r, i) => (
              <div key={i} className="glass-card p-6 flex flex-col">
                <div className={`w-9 h-9 bg-gradient-to-br ${r.color} rounded-xl mb-4`} />
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{r.role}</h3>
                <ul className="space-y-2.5 flex-1">
                  {r.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                  className={`mt-6 bg-gradient-to-r ${r.color} text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center hover:opacity-90 transition-opacity`}>
                  {r.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Branding */}
            <div className="flex items-center gap-2">
              <PrepPulseLogo size={22} />
              <span className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>PrepPulse</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 ml-1">
                SE Lab Project
              </span>
            </div>

            {/* Team */}
            <div className="text-center">
              <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Developed by</p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
                {[
                  { name: "Ansh Raj",         roll: "2330289" },
                  { name: "Manya Singh",       roll: "2330311" },
                  { name: "Preetush Bhowmik",  roll: "2330175" },
                  { name: "Labani Sen",       roll: "2330309" },
                ].map((m, i) => (
                  <span key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-medium">{m.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}> · {m.roll}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Stack */}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              FastAPI · React · SQLAlchemy · Ollama
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
