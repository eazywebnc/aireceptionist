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
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

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

interface Message {
  id: string
  caller_phone: string
  message_text: string
  handled: boolean
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [calls, setCalls] = useState<Call[]>([])
  const [messages, setMessages] = useState<Message[]>([])
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

      // Ensure profile exists
      await fetch('/api/auth/ensure-profile', { method: 'POST' })

      // Fetch recent calls
      const { data: callData } = await supabase
        .from('ar_calls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setCalls(callData || [])

      // Fetch pending messages
      const { data: msgData } = await supabase
        .from('ar_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('handled', false)
        .order('created_at', { ascending: false })
        .limit(5)

      setMessages(msgData || [])
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

  const todayCalls = calls.filter(c => {
    const today = new Date()
    const callDate = new Date(c.created_at)
    return callDate.toDateString() === today.toDateString()
  })

  const avgDuration = calls.length > 0
    ? Math.round(calls.reduce((a, c) => a + c.duration_seconds, 0) / calls.length)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">AIReceptionist</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/settings" className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
            <span className="text-xs text-zinc-500">{user?.email}</span>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500">Your AI receptionist overview</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Phone, label: 'Total Calls', value: String(calls.length), color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: PhoneCall, label: 'Calls Today', value: String(todayCalls.length), color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: Clock, label: 'Avg Duration', value: calls.length > 0 ? formatDuration(avgDuration) : '--', color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { icon: MessageSquare, label: 'Messages Pending', value: String(messages.length), color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <Link
            href="/dashboard/calls"
            className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur hover:bg-white/[4%] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Call Log</p>
                <p className="text-xs text-zinc-500">View all calls, filter, and manage</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
          </Link>
          <Link
            href="/dashboard/settings"
            className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur hover:bg-white/[4%] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Settings</p>
                <p className="text-xs text-zinc-500">Business info, hours, greeting, FAQ</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's calls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Recent Calls</h2>
              <Link href="/dashboard/calls" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                View all
              </Link>
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
                {calls.slice(0, 8).map((call) => (
                  <Link
                    key={call.id}
                    href={`/dashboard/calls/${call.id}`}
                    className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/[2%] transition-colors"
                  >
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
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent messages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white">Pending Messages</h2>
            </div>
            {messages.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-xs text-zinc-500">No pending messages</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {messages.map((msg) => (
                  <div key={msg.id} className="px-6 py-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-white">{msg.caller_phone}</p>
                      <p className="text-[10px] text-zinc-600">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">{msg.message_text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
