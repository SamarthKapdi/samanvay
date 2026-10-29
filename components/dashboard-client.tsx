'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
  Loader2,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type CaseStatus = 'Open' | 'Pending' | 'Under Process' | 'In Progress' | 'Scrutiny' | 'RO Probe' | 'SCSC' | 'Disposed' | 'Resolved' | 'Merged' | string

type DashboardCase = {
  id: number
  caseNumber: string
  institution: string
  issue: string
  severity: string
  status: CaseStatus
  owner: string
  progress: number
  createdAt: string
}

type Toast = {
  type: 'success' | 'error'
  message: string
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Institutions', icon: Building2 },
  { label: 'Complaints (RB)', icon: FileWarning, count: '18' },
  { label: 'Grievances (PGRC)', icon: ClipboardList, count: '42' },
  { label: 'Overlap Scrutiny', icon: ShieldCheck, count: '04', critical: true },
  { label: 'Reports', icon: FileBarChart },
  { label: 'Settings', icon: Settings },
]

const overlapCaseNumbers = ['PGRC-891', 'RB-104']

function isTerminalStatus(status: string) {
  return ['Merged', 'Resolved', 'Disposed'].includes(status)
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
  alert,
  loading,
}: {
  label: string
  value: number
  detail: string
  icon: LucideIcon
  accent: string
  alert?: boolean
  loading?: boolean
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-lg ${accent}`}>
          <Icon size={19} />
        </div>
        <span className={`text-[11px] font-semibold ${alert ? 'text-red-600' : 'text-slate-400'}`}>{detail}</span>
      </div>
      <p className="mt-4 text-[12px] font-medium text-slate-500">{label}</p>
      {loading ? <div className="mt-2 h-8 w-20 animate-pulse rounded bg-slate-200" /> : <p className={`mt-1 text-[27px] font-bold tracking-tight ${alert ? 'text-red-600' : 'text-slate-900'}`}>{value.toLocaleString()}</p>}
    </article>
  )
}

function CaseTableSkeleton() {
  return (
    <div className="space-y-3 px-5 py-5">
      {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
    </div>
  )
}

export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [cases, setCases] = useState<DashboardCase[]>([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback((nextToast: Toast) => {
    setToast(nextToast)
    window.setTimeout(() => setToast(null), 5000)
  }, [])

  const fetchCases = useCallback(async (isRefresh = false): Promise<boolean> => {
    if (isRefresh) setRefreshing(true)
    else setLoadingCases(true)
    setError(null)
    try {
      const response = await fetch('/api/cases', { cache: 'no-store' })
      if (!response.ok) throw new Error('Unable to load cases from the server.')
      const rows = await response.json()
      if (!Array.isArray(rows)) throw new Error('The cases response was not valid.')
      setCases(rows)
      return true
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Unable to load cases from the server.'
      setError(message)
      return false
    } finally {
      setLoadingCases(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void fetchCases()
  }, [fetchCases])

  const metrics = useMemo(() => ({
    total: cases.filter(({ status }) => !isTerminalStatus(status)).length,
    pending: cases.filter(({ status }) => ['Open', 'Pending'].includes(status)).length,
    underProcess: cases.filter(({ status }) => ['Under Process', 'In Progress', 'Scrutiny', 'RO Probe', 'SCSC'].includes(status)).length,
    disposed: cases.filter(({ status }) => ['Disposed', 'Resolved', 'Merged'].includes(status)).length,
    breaches: cases.filter(({ severity, status }) => severity === 'Critical' || status === 'Breached').length,
  }), [cases])

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return cases
    return cases.filter(({ caseNumber, institution, issue }) => `${caseNumber} ${institution} ${issue}`.toLowerCase().includes(query))
  }, [cases, search])

  const overlapCases = useMemo(() => overlapCaseNumbers.map((caseNumber) => cases.find((item) => item.caseNumber === caseNumber)).filter((item): item is DashboardCase => Boolean(item)), [cases])
  const overlapVisible = overlapCases.length === overlapCaseNumbers.length && overlapCases.some(({ status }) => !isTerminalStatus(status))

  async function confirmMerge() {
    setActionInProgress(true)
    setError(null)
    try {
      const createResponse = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseNumber: 'JD-2026-001',
          institution: overlapCases[0]?.institution ?? 'XYZ Institute of Technology',
          issue: 'Joint docket for PGRC-891 and RB-104',
          severity: 'Critical',
        }),
      })
      if (!createResponse.ok) {
        const body = await createResponse.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to create the joint docket.')
      }

      await Promise.all(overlapCases.map(async (item) => {
        const response = await fetch('/api/cases', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, status: 'Merged', progress: 100 }),
        })
        if (!response.ok) throw new Error(`Unable to update ${item.caseNumber}.`)
      }))

      if (!await fetchCases(true)) throw new Error('The cases were updated, but the dashboard could not refresh.')
      setModalOpen(false)
      showToast({ type: 'success', message: 'Cases successfully linked. Joint Docket #JD-2026-001 created.' })
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'The overlap could not be resolved.'
      setError(message)
      showToast({ type: 'error', message })
    } finally {
      setActionInProgress(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      {sidebarOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[254px] flex-col bg-[#0f1d35] text-slate-300 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center border-b border-white/10 px-6">
          <div className="mr-3 flex size-9 items-center justify-center rounded-lg bg-blue-600"><Building2 size={20} className="text-white" /></div>
          <div><p className="text-[14px] font-bold tracking-wide text-white">AICTE<span className="text-blue-400">-SAMANVAY</span></p><p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Unified Case Management</p></div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 py-6" aria-label="Primary navigation">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          {navItems.map(({ label, icon: Icon, count, critical }) => <button key={label} onClick={() => { setActiveNav(label); setSidebarOpen(false) }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${activeNav === label ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={17} /><span className="flex-1">{label}</span>{count && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${critical ? 'bg-red-500/20 text-red-300' : 'bg-white/10'}`}>{count}</span>}</button>)}
        </nav>
        <div className="border-t border-white/10 p-4"><div className="flex items-center gap-3 rounded-lg bg-white/5 p-3"><div className="flex size-9 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">RK</div><div><p className="text-xs font-semibold text-white">Dr. Rajesh Kumar</p><p className="text-[10px] text-slate-500">Senior Director, SCSC</p></div></div></div>
      </aside>

      <div className="lg:pl-[254px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button>
            <div className="relative hidden w-[360px] md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input aria-label="Search cases" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-[12px] outline-none transition focus:border-blue-400 focus:bg-white" placeholder="Search by case ID, institution, or issue..." /></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 border-r border-slate-200 pr-5 text-right sm:flex"><CalendarDays size={16} className="text-slate-400" /><div><p className="text-[11px] font-semibold text-slate-700">Tuesday, 29 October 2026</p><p className="text-[10px] text-slate-400">10:42 AM · New Delhi</p></div></div>
            <button className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-red-500" /></button>
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100" aria-label="Open profile menu"><span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">RK</span><ChevronDown size={14} /></button>
            {profileOpen && <div className="absolute right-5 top-14 w-44 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-xl"><button className="w-full rounded px-3 py-2 text-left transition hover:bg-slate-50">My profile</button><button className="w-full rounded px-3 py-2 text-left transition hover:bg-slate-50">Sign out</button></div>}
          </div>
        </header>

        <main className="mx-auto max-w-[1450px] px-5 py-7 md:px-8 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">SCSC Command Center</p><h1 className="text-[27px] font-bold tracking-tight">Good morning, Dr. Kumar</h1><p className="mt-1 text-[13px] text-slate-500">Here is the latest cross-bureau overview of your case portfolio.</p></div><div className="flex items-center gap-2 text-[11px] text-slate-500"><span className={`size-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`} /> {error ? 'Data sync issue' : 'System operational'} <span className="mx-1 text-slate-300">|</span><button onClick={() => void fetchCases(true)} className="transition hover:text-blue-700">{refreshing ? 'Syncing…' : 'Refresh data'}</button></div></div>

          {error && <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void fetchCases(true)}>Retry</Button></div>}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Key performance indicators">
            <MetricCard label="Total Active Cases" value={metrics.total} detail="Live from case registry" icon={ClipboardList} accent="bg-blue-50 text-blue-700" loading={loadingCases} />
            <MetricCard label="Pending Resolution" value={metrics.pending} detail="Open or pending" icon={FileWarning} accent="bg-amber-50 text-amber-700" loading={loadingCases} />
            <MetricCard label="Under Process" value={metrics.underProcess} detail="Active workflow" icon={Users} accent="bg-violet-50 text-violet-700" loading={loadingCases} />
            <MetricCard label="Disposed (This Month)" value={metrics.disposed} detail="Resolved or merged" icon={CheckCircle2} accent="bg-emerald-50 text-emerald-700" loading={loadingCases} />
            <MetricCard label="SLA Breaches" value={metrics.breaches} detail="Requires attention" icon={AlertTriangle} accent="bg-red-50 text-red-700" alert loading={loadingCases} />
          </section>

          {overlapVisible && <section className="mt-6 overflow-hidden rounded-xl border border-red-200 bg-[#fff8f7] shadow-sm"><div className="flex flex-col gap-4 border-b border-red-100 bg-red-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-red-100 text-red-600"><AlertTriangle size={19} /></div><div><h2 className="text-[14px] font-bold text-red-900">CRITICAL OVERLAP DETECTED: Action Required</h2><p className="text-[11px] text-red-700/80">Automated cross-bureau conflict detection · Priority P1</p></div><span className="rounded-full bg-red-600 px-2 py-1 text-[9px] font-bold text-white">Live Alert</span></div><span className="font-mono text-[10px] text-red-700/70">2 CASES REQUIRE LINKING</span></div><div className="px-5 py-4"><p className="text-[13px] leading-6 text-slate-700"><strong>Institution: {overlapCases[0]?.institution}</strong> has active conflicting cases in multiple bureaus.</p><div className="mt-3 grid gap-2 md:grid-cols-2">{overlapCases.map((item) => <div key={item.id} className="rounded-lg border border-red-100 bg-white px-3 py-2.5 text-[11px]"><span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-blue-700">{item.caseNumber}</span><p className="mt-1.5 text-slate-600">{item.issue}</p></div>)}</div><div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-red-100 pt-4 sm:flex-row sm:items-center"><p className="text-[11px] font-medium text-red-800">Recommended action: create a joint SCSC docket.</p><Button variant="destructive" onClick={() => setModalOpen(true)}>Link Cases &amp; Open Joint SCSC Docket</Button></div></div></section>}

          <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-[15px] font-bold">Recent Cases</h2><p className="mt-0.5 text-[11px] text-slate-500">{filteredCases.length} of {cases.length} cases shown</p></div><Button variant="ghost" size="sm" onClick={() => void fetchCases(true)} disabled={refreshing}>{refreshing && <Loader2 className="animate-spin" />} {refreshing ? 'Refreshing…' : 'Refresh cases'}</Button></div>
            {loadingCases ? <CaseTableSkeleton /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Case ID</th><th className="px-3 py-3">Institution</th><th className="px-3 py-3">Issue</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Severity</th></tr></thead><tbody>{filteredCases.map((item) => <tr key={item.id} className="cursor-pointer border-b border-slate-50 transition hover:bg-blue-50/50 hover:shadow-[inset_3px_0_0_#2563eb]"><td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-blue-700">{item.caseNumber}</td><td className="px-3 py-3.5 text-[11px] font-medium text-slate-700">{item.institution}</td><td className="px-3 py-3.5 text-[11px] text-slate-500">{item.issue}</td><td className="px-3 py-3.5 text-[11px] text-slate-600">{item.status}</td><td className="px-3 py-3.5"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.severity === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{item.severity}</span></td></tr>)}</tbody></table>{filteredCases.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-500">{cases.length === 0 ? 'No cases are available yet.' : 'No cases match your search.'}</p>}</div>}
          </section>
        </main>
      </div>

      {toast && <div role="status" className={`fixed right-5 top-5 z-[70] flex max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${toast.type === 'success' ? 'border-emerald-200' : 'border-red-200'}`}><CheckCircle2 className={toast.type === 'success' ? 'mt-0.5 text-emerald-600' : 'mt-0.5 text-red-600'} size={20} /><div><p className={`text-sm font-bold ${toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>{toast.type === 'success' ? 'Success' : 'Action failed'}</p><p className="mt-0.5 text-xs text-slate-600">{toast.message}</p></div></div>}
      {modalOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="merge-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">P1 overlap resolution</p><h2 id="merge-title" className="mt-1 text-lg font-bold text-slate-900">Confirm Joint Docket Creation?</h2></div><button aria-label="Close confirmation" onClick={() => setModalOpen(false)} disabled={actionInProgress} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"><X size={18} /></button></div><p className="mt-4 text-sm leading-6 text-slate-600">This will create a joint docket and mark {overlapCaseNumbers.join(' and ')} as merged.</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={() => setModalOpen(false)} disabled={actionInProgress}>Cancel</Button><Button onClick={() => void confirmMerge()} disabled={actionInProgress}>{actionInProgress && <Loader2 className="animate-spin" />} {actionInProgress ? 'Merging…' : 'Confirm & Merge'}</Button></div></div></div>}
    </div>
  )
}
