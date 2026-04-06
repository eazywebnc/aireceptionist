'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Phone,
  PhoneCall,
  PhoneMissed,
  Voicemail,
  ArrowUpRight,
  ChevronLeft,
  Flag,
  CheckCircle,
  MessageSquare,
  Clock,
  User,
  Bot,
  Save,
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
  flagged: boolean
  notes: string | null
  created_at: string
}

interface TranscriptEntry {
  speaker: string
  content: string
  timestamp_ms: number
}

export default function CallDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [call, setCall] = useState<Call | null>(null)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCall = async () => {
      const res = await fetch(`/api/calls/${id}`)
      if (!res.ok) {
        router.push('/dashboard/calls')
        return
      }
      const data = await res.json()
      setCall(data.call)
      setTranscript(data.transcript)
      setNotes(data.call.notes || '')
      setLoading(false)
    }
    fetchCall()
  }, [id])

  const updateCall = async (updates: Record<string, unknown>) => {
    setSaving(true)
    const res = await fetch(`/api/calls/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const data = await res.json()
      setCall(data.call)
    }
    setSaving(false)
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const formatTimestamp = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <PhoneCall className="w-5 h-5 text-green-400" />
      case 'missed': return <PhoneMissed className="w-5 h-5 text-red-400" />
      case 'voicemail': return <Voicemail className="w-5 h-5 text-amber-400" />
      case 'transferred': return <ArrowUpRight className="w-5 h-5 text-blue-400" />
      default: return <Phone className="w-5 h-5 text-zinc-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!call) return null

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/calls" className="text-zinc-500 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold text-white">Call Detail</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateCall({ flagged: !call.flagged })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                call.flagged
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/[3%] text-zinc-400 border border-white/5 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              {call.flagged ? 'Flagged' : 'Flag'}
            </button>
            <button
              onClick={() => updateCall({ status: 'completed' })}
              className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium flex items-center gap-1.5 hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Handled
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Call info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              {statusIcon(call.status)}
              <span className="text-xs font-medium text-zinc-400 uppercase">{call.status}</span>
            </div>
            <p className="text-lg font-bold text-white">{call.caller_name || 'Unknown'}</p>
            <p className="text-sm text-zinc-500">{call.caller_number}</p>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur">
            <Clock className="w-5 h-5 text-amber-400 mb-3" />
            <p className="text-lg font-bold text-white">{formatDuration(call.duration_seconds)}</p>
            <p className="text-xs text-zinc-500">Duration</p>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur">
            <Phone className="w-5 h-5 text-amber-400 mb-3" />
            <p className="text-sm font-bold text-white">
              {new Date(call.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-xs text-zinc-500">
              {new Date(call.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur">
            <MessageSquare className="w-5 h-5 text-amber-400 mb-3" />
            <p className="text-sm font-bold text-white">{transcript.length} messages</p>
            <p className="text-xs text-zinc-500">Transcript</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transcript */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white">Transcript</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {transcript.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No transcript available</p>
              ) : (
                transcript.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${entry.speaker === 'ai' ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      entry.speaker === 'ai' ? 'bg-amber-500/20' : 'bg-white/10'
                    }`}>
                      {entry.speaker === 'ai' ? (
                        <Bot className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${entry.speaker === 'ai' ? '' : 'text-right'}`}>
                      <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                        entry.speaker === 'ai'
                          ? 'bg-amber-500/10 text-zinc-200 rounded-tl-sm'
                          : 'bg-white/5 text-zinc-300 rounded-tr-sm'
                      }`}>
                        {entry.content}
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-1">{formatTimestamp(entry.timestamp_ms)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Sidebar: Summary + Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* AI Summary */}
            <div className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">AI Summary</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {call.summary || 'No summary generated for this call.'}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">Notes</h3>
              </div>
              <div className="p-5">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note about this call..."
                  rows={4}
                  className="w-full bg-white/[3%] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
                <button
                  onClick={() => updateCall({ notes })}
                  disabled={saving}
                  className="mt-3 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
