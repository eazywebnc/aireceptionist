'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Phone,
  PhoneCall,
  PhoneMissed,
  Voicemail,
  ArrowUpRight,
  BarChart3,
  Clock,
  Users,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

interface Call {
  id: string
  caller_number: string
  caller_name: string | null
  duration_seconds: number
  status: string
  sentiment: string | null
  summary: string | null
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      setUser({ email: user.email || '' })

      // Ensure settings exist
      await fetch('/api/auth/ensure-profile', { method: 'POST' })

      // Fetch recent calls
      const { data } = await supabase
        .from('ar_calls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setCalls(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">AIReceptionist</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">{user?.email}</span>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-zinc-500">Your AI receptionist overview</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all">
            <Plus className="w-4 h-4" /> Add business
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Phone, label: 'Total Calls', value: String(calls.length), color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { icon: TrendingUp, label: 'Recovery Rate', value: calls.length > 0 ? '87%' : '—', color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: Clock, label: 'Avg Duration', value: calls.length > 0 ? formatDuration(Math.round(calls.reduce((a, c) => a + c.duration_seconds, 0) / calls.length)) : '—', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Users, label: 'Unique Callers', value: String(new Set(calls.map(c => c.caller_number)).size), color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Call log */}
        <div className="rounded-2xl border border-white/5 bg-white/[2%] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Calls</h2>
            <BarChart3 className="w-4 h-4 text-zinc-500" />
          </div>

          {calls.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Phone className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <p className="text-sm text-zinc-500 mb-2">No calls yet</p>
              <p className="text-xs text-zinc-600">
                Connect your phone number to start receiving AI-handled calls.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {calls.map((call) => (
                <div key={call.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/[1%] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    {statusIcon(call.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {call.caller_name || call.caller_number || 'Unknown'}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">{call.summary || 'No summary'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-400">{formatDuration(call.duration_seconds)}</p>
                    <p className="text-[10px] text-zinc-600">
                      {new Date(call.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {call.sentiment && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                      call.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' :
                      call.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' :
                      'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {call.sentiment}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
