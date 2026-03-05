import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, Briefcase, TrendingUp, Building2, Loader2, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import Layout from '../components/shared/Layout'
import api from '../utils/api'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'All Jobs', icon: Briefcase },
]

const STATUS_COLORS = {
  applied: '#6366f1', shortlisted: '#f59e0b', interview: '#a78bfa',
  selected: '#10b981', placed: '#22c55e', rejected: '#ef4444'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm">
        <p className="text-slate-300">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [heatmap, setHeatmap] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/readiness-heatmap'),
      api.get('/admin/students'),
    ]).then(([s, h, st]) => {
      setStats(s.data)
      setHeatmap(h.data)
      setStudents(st.data.slice(0, 8))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout navItems={navItems}>
      <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
    </Layout>
  )

  const overview = stats?.overview || {}

  return (
    <Layout navItems={navItems}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Placement Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Batch analytics and real-time placement intelligence</p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Students', value: overview.total_students, icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/10' },
            { label: 'Placed', value: overview.placed_students, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Placement %', value: `${overview.placement_rate}%`, icon: BarChart3, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Active Jobs', value: overview.active_jobs, icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Applications', value: overview.total_applications, icon: LayoutDashboard, color: 'text-pulse-400', bg: 'bg-pulse-500/10' },
            { label: 'Companies', value: overview.total_companies, icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          ].map((s, i) => (
            <div key={i} className="stat-card col-span-1">
              <div className={`${s.bg} ${s.color} p-2 rounded-xl flex-shrink-0`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-white">{s.value ?? 0}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Pipeline chart */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-white mb-4">Application Pipeline</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.application_pipeline || []} barSize={32}>
                <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {(stats?.application_pipeline || []).map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department readiness */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-white mb-4">Department Readiness</h2>
            <div className="space-y-3">
              {heatmap.slice(0, 6).map((dept, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-300">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{dept.placement_ready}/{dept.total_students}</span>
                      <span className={`font-medium ${
                        dept.readiness_percentage >= 70 ? 'text-emerald-400' :
                        dept.readiness_percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{dept.readiness_percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        dept.readiness_percentage >= 70 ? 'bg-emerald-500' :
                        dept.readiness_percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${dept.readiness_percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dept stats table */}
        <div className="glass-card p-5">
          <h2 className="font-semibold text-white mb-4">Department Analytics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="text-left py-2 px-3">Department</th>
                  <th className="text-right py-2 px-3">Students</th>
                  <th className="text-right py-2 px-3">Avg CGPA</th>
                  <th className="text-right py-2 px-3">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {heatmap.map((row, i) => (
                  <tr key={i} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-white">{row.department}</td>
                    <td className="py-2.5 px-3 text-right">{row.total_students}</td>
                    <td className="py-2.5 px-3 text-right">{row.avg_cgpa}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`font-medium ${
                        row.readiness_percentage >= 70 ? 'text-emerald-400' :
                        row.readiness_percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{row.readiness_percentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student list */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Students</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Dept</th>
                  <th className="text-right py-2 px-3">CGPA</th>
                  <th className="text-right py-2 px-3">Skills</th>
                  <th className="text-right py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((s, i) => (
                  <tr key={i} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-xs text-white font-bold">
                          {s.name?.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">{s.department || '—'}</td>
                    <td className="py-2.5 px-3 text-right">{s.cgpa?.toFixed(2) || '—'}</td>
                    <td className="py-2.5 px-3 text-right">{s.skills_count || 0}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                        ${s.placement_status === 'placed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                        {s.placement_status || 'unplaced'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
