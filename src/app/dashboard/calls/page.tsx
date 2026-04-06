'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Phone,
  PhoneCall,
  PhoneMissed,
  Voicemail,
  ArrowUpRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Call {
  id: string
  caller_number: string
  caller_name: string | null
  duration_seconds: number
  status: string
  summary: string | null
  flagged: boolean
  created_at: string
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [offset, setOffset] = useState(0)
  const limit = 20

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchCalls = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (dateFrom) params.set('from', dateFrom)
    if (dateTo) params.set('to', dateTo)
    params.set('limit', String(limit))
    params.set('offset', String(offset))

    const res = await fetch(`/api/calls?${params.toString()}`)
    const data = await res.json()
    setCalls(data.calls || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCalls()
  }, [statusFilter, dateFrom, dateTo, offset])

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (d: string) => {
    const date = new Date(d)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <PhoneCall className="w-4 h-4 text-green-400" />
      case 'missed': return <PhoneMissed className="w-4 h-4 text-red-400" />
      case 'voicemail': return <Voicemail className="w-4 h-4 text-amber-400" />
      case 'transferred': return <ArrowUpRight className="w-4 h-4 text-blue-400" />
      default: return <Phone className="w-4 h-4 text-zinc-400" />
    }
  }

  const statusLabel = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-500/10 text-green-400',
      missed: 'bg-red-500/10 text-red-400',
      voicemail: 'bg-amber-500/10 text-amber-400',
      transferred: 'bg-blue-500/10 text-blue-400',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[status] || 'bg-zinc-500/10 text-zinc-400'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Call Log</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setOffset(0) }}
            className="px-3 py-1.5 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All statuses</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="voicemail">Voicemail</option>
            <option value="transferred">Transferred</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setOffset(0) }}
            className="px-3 py-1.5 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white focus:outline-none focus:border-amber-500/50"
            placeholder="From"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setOffset(0) }}
            className="px-3 py-1.5 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white focus:outline-none focus:border-amber-500/50"
            placeholder="To"
          />
        </motion.div>

        {/* Calls Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
            </div>
          ) : calls.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Phone className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <p className="text-sm text-zinc-500 mb-2">No calls found</p>
              <p className="text-xs text-zinc-600">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                <div className="col-span-1">Status</div>
                <div className="col-span-3">Caller</div>
                <div className="col-span-2">Date / Time</div>
                <div className="col-span-1">Duration</div>
                <div className="col-span-4">Summary</div>
                <div className="col-span-1"></div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {calls.map((call) => (
                  <Link
                    key={call.id}
                    href={`/dashboard/calls/${call.id}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-3.5 hover:bg-white/[2%] transition-colors items-center"
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      {statusIcon(call.status)}
                      <span className="md:hidden">{statusLabel(call.status)}</span>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm text-white truncate">
                        {call.caller_name || call.caller_number || 'Unknown'}
                      </p>
                      {call.caller_name && (
                        <p className="text-[11px] text-zinc-500">{call.caller_number}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-zinc-300">{formatDate(call.created_at)}</p>
                      <p className="text-[11px] text-zinc-500">{formatTime(call.created_at)}</p>
                    </div>
                    <div className="col-span-1 text-xs text-zinc-400">
                      {formatDuration(call.duration_seconds)}
                    </div>
                    <div className="col-span-4">
                      <p className="text-xs text-zinc-400 truncate">{call.summary || 'No summary'}</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-2">
                      {call.flagged && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && calls.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="px-4 py-2 rounded-lg bg-white/[3%] border border-white/5 text-sm text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-zinc-500">
              Showing {offset + 1} - {offset + calls.length}
            </span>
            <button
              disabled={calls.length < limit}
              onClick={() => setOffset(offset + limit)}
              className="px-4 py-2 rounded-lg bg-white/[3%] border border-white/5 text-sm text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
