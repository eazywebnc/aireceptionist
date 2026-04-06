'use client'

import { useEffect, useState } from 'react'
import {
  Settings,
  Save,
  ChevronLeft,
  Plus,
  Trash2,
  Clock,
  MessageSquare,
  Mic,
  Building,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BusinessHours {
  [key: string]: string
}

interface FaqEntry {
  question: string
  answer: string
}

interface SettingsData {
  business_name: string
  business_phone: string
  business_hours: BusinessHours
  greeting_message: string
  faq_entries: FaqEntry[]
  voice_style: string
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

const defaultHours: BusinessHours = {
  mon: '09:00-17:00',
  tue: '09:00-17:00',
  wed: '09:00-17:00',
  thu: '09:00-17:00',
  fri: '09:00-17:00',
  sat: 'closed',
  sun: 'closed',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    business_name: '',
    business_phone: '',
    business_hours: defaultHours,
    greeting_message: 'Thank you for calling. How can I help you today?',
    faq_entries: [],
    voice_style: 'professional',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/business')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings({
            business_name: data.settings.business_name || '',
            business_phone: data.settings.business_phone || '',
            business_hours: data.settings.business_hours || defaultHours,
            greeting_message: data.settings.greeting_message || 'Thank you for calling. How can I help you today?',
            faq_entries: data.settings.faq_entries || [],
            voice_style: data.settings.voice_style || 'professional',
          })
        }
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const res = await fetch('/api/business', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const updateHours = (day: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      business_hours: { ...prev.business_hours, [day]: value },
    }))
  }

  const toggleDay = (day: string) => {
    const current = settings.business_hours[day]
    updateHours(day, current === 'closed' ? '09:00-17:00' : 'closed')
  }

  const addFaq = () => {
    setSettings(prev => ({
      ...prev,
      faq_entries: [...prev.faq_entries, { question: '', answer: '' }],
    }))
  }

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setSettings(prev => {
      const entries = [...prev.faq_entries]
      entries[index] = { ...entries[index], [field]: value }
      return { ...prev, faq_entries: entries }
    })
  }

  const removeFaq = (index: number) => {
    setSettings(prev => ({
      ...prev,
      faq_entries: prev.faq_entries.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Settings className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Business Settings</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium flex items-center gap-2 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Business Info */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Business Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Acme Corp"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[3%] border border-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Business Phone</label>
              <input
                type="tel"
                value={settings.business_phone}
                onChange={(e) => setSettings(prev => ({ ...prev, business_phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[3%] border border-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </motion.section>

        {/* Business Hours */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Business Hours</h2>
          </div>
          <div className="p-6 space-y-3">
            {DAYS.map((day) => {
              const isClosed = settings.business_hours[day] === 'closed'
              const [open, close] = isClosed ? ['', ''] : (settings.business_hours[day] || '09:00-17:00').split('-')
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-zinc-300">{DAY_LABELS[day]}</span>
                  <button
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isClosed
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}
                  >
                    {isClosed ? 'Closed' : 'Open'}
                  </button>
                  {!isClosed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={open}
                        onChange={(e) => updateHours(day, `${e.target.value}-${close}`)}
                        className="px-3 py-1.5 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                      />
                      <span className="text-zinc-500 text-xs">to</span>
                      <input
                        type="time"
                        value={close}
                        onChange={(e) => updateHours(day, `${open}-${e.target.value}`)}
                        className="px-3 py-1.5 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Greeting Message */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">AI Greeting Message</h2>
          </div>
          <div className="p-6">
            <textarea
              value={settings.greeting_message}
              onChange={(e) => setSettings(prev => ({ ...prev, greeting_message: e.target.value }))}
              rows={3}
              placeholder="Thank you for calling [Business Name]. How can I help you today?"
              className="w-full px-4 py-3 rounded-xl bg-white/[3%] border border-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none"
            />
            <p className="text-[11px] text-zinc-600 mt-2">This is the first thing the AI will say when answering a call.</p>
          </div>
        </motion.section>

        {/* Voice Style */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Voice Style</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3">
              {['professional', 'friendly', 'casual'].map((style) => (
                <button
                  key={style}
                  onClick={() => setSettings(prev => ({ ...prev, voice_style: style }))}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    settings.voice_style === style
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-white/5 bg-white/[2%] hover:bg-white/[4%]'
                  }`}
                >
                  <p className={`text-sm font-medium capitalize ${
                    settings.voice_style === style ? 'text-amber-400' : 'text-zinc-300'
                  }`}>
                    {style}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {style === 'professional' && 'Formal and business-like'}
                    {style === 'friendly' && 'Warm and approachable'}
                    {style === 'casual' && 'Relaxed and conversational'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Entries */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">FAQ Entries</h2>
            </div>
            <button
              onClick={addFaq}
              className="px-3 py-1.5 rounded-lg bg-white/[3%] border border-white/5 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>
          <div className="p-6 space-y-4">
            {settings.faq_entries.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">
                No FAQ entries yet. Add questions and answers the AI should know.
              </p>
            ) : (
              settings.faq_entries.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[2%] border border-white/5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(i, 'question', e.target.value)}
                        placeholder="What are your business hours?"
                        className="w-full px-3 py-2 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <button
                      onClick={() => removeFaq(i)}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                      placeholder="We are open Monday through Friday, 9 AM to 5 PM."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/[3%] border border-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.section>

        {/* Bottom save */}
        <div className="flex justify-end pb-12">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium flex items-center gap-2 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Settings Saved!' : 'Save All Changes'}
          </button>
        </div>
      </main>
    </div>
  )
}
