'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileBarChart,
  FileWarning,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Institutions', icon: Building2 },
  { label: 'Complaints (RB)', icon: FileWarning, count: '18' },
  { label: 'Grievances (PGRC)', icon: ClipboardList, count: '42' },
  { label: 'Overlap Scrutiny', icon: ShieldCheck, count: '04', critical: true },
  { label: 'Reports', icon: FileBarChart },
  { label: 'Settings', icon: Settings },
]

const cases = [
  { id: 'PGRC-891', institution: 'XYZ Institute of Technology', bureau: 'PGRC', category: 'Fee Refund / Documents', sla: 'At Risk', tone: 'amber' },
  { id: 'RB-104', institution: 'XYZ Institute of Technology', bureau: 'RB', category: 'APH Norm Violation', sla: 'Breached', tone: 'red' },
  { id: 'RO-772', institution: 'Maharashtra Technical Campus', bureau: 'Western RO', category: 'Affiliation Renewal', sla: 'On Track', tone: 'green' },
  { id: 'PGRC-876', institution: 'North Valley Engineering College', bureau: 'PGRC', category: 'Scholarship Disbursement', sla: 'On Track', tone: 'green' },
  { id: 'RB-098', institution: 'Bharat Institute of Applied Sciences', bureau: 'RB', category: 'Faculty Compliance', sla: 'At Risk', tone: 'amber' },
]

const workload = [
  { label: 'PGRC', value: 450, color: 'bg-blue-600' },
  { label: 'Regulation Bureau', value: 210, color: 'bg-indigo-500' },
  { label: 'Western RO', value: 120, color: 'bg-sky-500' },
  { label: 'Central RO', value: 85, color: 'bg-slate-400' },
]

function MetricCard({ label, value, detail, icon: Icon, accent, alert }: { label: string; value: string; detail: string; icon: typeof Users; accent: string; alert?: boolean }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-lg ${accent}`}><Icon size={19} strokeWidth={1.8} /></div>
        <span className={`text-[11px] font-semibold ${alert ? 'text-red-600' : 'text-slate-400'}`}>{detail}</span>
      </div>
      <p className="mt-4 text-[12px] font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-[27px] font-bold tracking-tight ${alert ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    </article>
  )
}

export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [linked, setLinked] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      {sidebarOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[254px] flex-col bg-[#0f1d35] text-slate-300 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center border-b border-white/10 px-6">
          <div className="mr-3 flex size-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-900/40"><Building2 size={20} className="text-white" /></div>
          <div><p className="text-[14px] font-bold tracking-wide text-white">AICTE<span className="text-blue-400">-SAMANVAY</span></p><p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">Unified Case Management</p></div>
          <button className="ml-auto text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 py-6" aria-label="Primary navigation">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <div className="space-y-1">{navItems.map(({ label, icon: Icon, count, critical }) => <button key={label} onClick={() => { setActiveNav(label); setSidebarOpen(false) }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${activeNav === label ? 'bg-blue-600 text-white shadow-md shadow-blue-950/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={17} strokeWidth={1.8} /><span className="flex-1">{label}</span>{count && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${critical ? 'bg-red-500/20 text-red-300' : activeNav === label ? 'bg-white/15 text-white' : 'bg-white/10 text-slate-400'}`}>{count}</span>}</button>)}</div>
        </nav>
        <div className="border-t border-white/10 p-4"><div className="flex items-center gap-3 rounded-lg bg-white/5 p-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[12px] font-bold text-blue-300">RK</div><div className="min-w-0"><p className="truncate text-[12px] font-semibold text-white">Dr. Rajesh Kumar</p><p className="truncate text-[10px] text-slate-500">Senior Director, SCSC</p></div><ChevronDown size={15} className="ml-auto shrink-0 text-slate-500" /></div><p className="mt-4 px-1 text-[9px] text-slate-600">© 2024 AICTE · Secure Government Portal</p></div>
      </aside>

      <div className="lg:pl-[254px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="relative hidden w-[360px] md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input aria-label="Search cases" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-[12px] outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white" placeholder="Search by AICTE PID, Institution Name, or Case ID..." /></div></div><div className="flex items-center gap-4"><div className="hidden items-center gap-2 border-r border-slate-200 pr-5 text-right sm:flex"><CalendarDays size={16} className="text-slate-400" /><div><p className="text-[11px] font-semibold text-slate-700">Tuesday, 29 October 2026</p><p className="text-[10px] text-slate-400">10:42 AM · New Delhi</p></div></div><button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-red-500" /></button><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100" aria-label="Open profile menu"><span className="flex size-8 items-center justify-center rounded-full bg-[#dbeafe] text-[11px] font-bold text-blue-700">RK</span><ChevronDown size={14} className="text-slate-400" /></button>{profileOpen && <div className="absolute right-5 top-14 w-44 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-xl"><button className="w-full rounded px-3 py-2 text-left hover:bg-slate-50">My profile</button><button className="w-full rounded px-3 py-2 text-left hover:bg-slate-50">Sign out</button></div>}</div></header>

        <main className="mx-auto max-w-[1450px] px-5 py-7 md:px-8 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">SCSC Command Center</p><h1 className="text-[27px] font-bold tracking-tight text-slate-900">Good morning, Dr. Kumar</h1><p className="mt-1 text-[13px] text-slate-500">Here is the latest cross-bureau overview of your case portfolio.</p></div><div className="flex items-center gap-2 text-[11px] text-slate-500"><span className="size-2 rounded-full bg-emerald-500" /> System operational <span className="mx-1 text-slate-300">|</span> Last synced 2 min ago</div></div>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Key performance indicators"><MetricCard label="Total Active Cases" value="4,820" detail="↑ 8.4% vs last month" icon={ClipboardList} accent="bg-blue-50 text-blue-700" /><MetricCard label="Pending Resolution" value="612" detail="12.7% of total" icon={FileWarning} accent="bg-amber-50 text-amber-700" /><MetricCard label="Under Process" value="1,940" detail="↑ 4.2% this week" icon={Users} accent="bg-violet-50 text-violet-700" /><MetricCard label="Disposed (This Month)" value="2,110" detail="↑ 16.8% vs last month" icon={CheckCircle2} accent="bg-emerald-50 text-emerald-700" /><MetricCard label="SLA Breaches" value="64" detail="Requires attention" icon={AlertTriangle} accent="bg-red-50 text-red-700" alert /></section>

          <section className="mt-6 overflow-hidden rounded-xl border border-red-200 bg-[#fff8f7] shadow-[0_3px_12px_rgba(185,28,28,0.08)]" aria-labelledby="overlap-heading"><div className="flex flex-col gap-4 border-b border-red-100 bg-red-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"><AlertTriangle size={19} /></div><div><h2 id="overlap-heading" className="text-[14px] font-bold text-red-900">CRITICAL OVERLAP DETECTED: Action Required</h2><p className="mt-0.5 text-[11px] text-red-700/80">Automated cross-bureau conflict detection · Priority P1</p></div><span className="rounded-full bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">Live Alert</span></div><span className="font-mono text-[10px] text-red-700/70">DETECTED 09:58:12 IST</span></div><div className="px-5 py-4"><p className="text-[13px] leading-6 text-slate-700"><strong>Institution: XYZ Institute of Technology</strong> <span className="font-mono text-[11px] text-slate-500">[PID: 1-4928371]</span> <span className="text-slate-500">(Central Region)</span> has active conflicting cases in multiple bureaus.</p><div className="mt-3 grid gap-2 md:grid-cols-2"><div className="rounded-lg border border-red-100 bg-white px-3 py-2.5"><div className="flex items-center gap-2 text-[11px] font-bold text-slate-700"><span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-blue-700">PGRC #PGRC-891</span><span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">Under Process</span></div><p className="mt-1.5 text-[11px] text-slate-600">Student Grievance · Fee Refund / Original Documents Withheld</p></div><div className="rounded-lg border border-red-100 bg-white px-3 py-2.5"><div className="flex items-center gap-2 text-[11px] font-bold text-slate-700"><span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-indigo-700">RB #RB-104</span><span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-700">Penal Action Initiated</span></div><p className="mt-1.5 text-[11px] text-slate-600">APH 2024 Norm Violation · Faculty Shortage</p></div></div><div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center"><button onClick={() => setLinked(true)} className="rounded-lg bg-[#b91c1c] px-4 py-2.5 text-[12px] font-bold text-white shadow-sm transition hover:bg-red-800">{linked ? '✓ Joint SCSC Docket Opened' : 'Link Cases & Open Joint SCSC Docket'}</button><button className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-red-700 transition hover:bg-red-50">View 360° Profile</button>{linked && <span className="text-[11px] font-medium text-emerald-700">Cases linked successfully. Docket SCSC-2026-441 created.</span>}</div></div></section>

          <div className="mt-7 grid gap-6 xl:grid-cols-[1.55fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-[15px] font-bold text-slate-900">Recent Cases</h2><p className="mt-0.5 text-[11px] text-slate-500">Latest activity across all bureaus</p></div><button className="text-[11px] font-semibold text-blue-700 hover:text-blue-900">View all cases →</button></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400"><th className="px-5 py-3 font-bold">Case ID</th><th className="px-3 py-3 font-bold">Institution</th><th className="px-3 py-3 font-bold">Bureau</th><th className="px-3 py-3 font-bold">Category</th><th className="px-3 py-3 font-bold">SLA Status</th></tr></thead><tbody>{cases.map((item) => <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-blue-700">{item.id}</td><td className="max-w-[190px] truncate px-3 py-3.5 text-[11px] font-medium text-slate-700">{item.institution}</td><td className="px-3 py-3.5 text-[11px] text-slate-500">{item.bureau}</td><td className="max-w-[170px] truncate px-3 py-3.5 text-[11px] text-slate-500">{item.category}</td><td className="px-3 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${item.tone === 'green' ? 'bg-emerald-50 text-emerald-700' : item.tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}><span className={`size-1.5 rounded-full ${item.tone === 'green' ? 'bg-emerald-500' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />{item.sla}</span></td></tr>)}</tbody></table></div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"><div className="flex items-start justify-between"><div><h2 className="text-[15px] font-bold text-slate-900">Bureau Workload</h2><p className="mt-0.5 text-[11px] text-slate-500">Pending cases by department</p></div><button className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-50">This month <ChevronDown size={12} className="ml-1 inline" /></button></div><div className="mt-7 space-y-5">{workload.map((item) => <div key={item.label}><div className="mb-2 flex items-center justify-between text-[11px]"><span className="font-semibold text-slate-700">{item.label}</span><span className="font-bold text-slate-900">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / 450) * 100}%` }} /></div></div>)}</div><div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4"><div><p className="text-[10px] text-slate-400">Total pending</p><p className="mt-1 text-lg font-bold text-slate-900">865</p></div><div><p className="text-[10px] text-slate-400">Avg. resolution</p><p className="mt-1 text-lg font-bold text-slate-900">8.4 <span className="text-[10px] font-medium text-slate-400">days</span></p></div></div></section></div>
        </main>
      </div>
    </div>
  )
}
