'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Phone, PhoneCall, Clock, Users, Mic } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ---- Live call mockup with sound waves ---- */
function LiveCallMockup() {
  const [callState, setCallState] = useState<'ringing' | 'active' | 'summary'>('ringing')

  useEffect(() => {
    const t1 = setTimeout(() => setCallState('active'), 2000)
    const t2 = setTimeout(() => setCallState('summary'), 7000)
    const t3 = setTimeout(() => setCallState('ringing'), 10000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [callState])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-violet-500/10 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-indigo-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="relative">
            <Phone className="w-4 h-4 text-indigo-400" />
            {callState === 'active' && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
          <span className="text-xs font-medium text-white/70">AI Receptionist</span>
          <div className="ml-auto">
            <AnimatePresence mode="wait">
              {callState === 'ringing' && (
                <motion.span key="ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-amber-400 font-medium">
                  Incoming call...
                </motion.span>
              )}
              {callState === 'active' && (
                <motion.span key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-green-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live — 0:42
                </motion.span>
              )}
              {callState === 'summary' && (
                <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-indigo-400 font-medium">
                  Call complete
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Caller info */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">+1 (555) 012-3456</p>
              <p className="text-[10px] text-zinc-500">New caller · Plumbing inquiry</p>
            </div>
          </motion.div>

          {/* Sound wave visualization */}
          <AnimatePresence mode="wait">
            {callState === 'active' && (
              <motion.div
                key="waves"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                className="flex items-center justify-center gap-1 py-4"
              >
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 sound-wave"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      animationDuration: `${0.8 + Math.random() * 0.6}s`,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversation transcript */}
          <AnimatePresence mode="wait">
            {callState === 'active' && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {[
                  { speaker: 'AI', text: "Good morning! Thank you for calling Johnson Plumbing. How can I help you today?", delay: 0 },
                  { speaker: 'Caller', text: "Hi, I have a leaking pipe in my kitchen. Can someone come today?", delay: 0.3 },
                  { speaker: 'AI', text: "I'd be happy to help! Let me check today's availability...", delay: 0.6 },
                ].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.speaker === 'AI' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: msg.delay }}
                    className={`flex gap-2 ${msg.speaker === 'Caller' ? 'justify-end' : ''}`}
                  >
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                      msg.speaker === 'AI'
                        ? 'bg-indigo-500/10 border border-indigo-500/15 text-indigo-100'
                        : 'bg-white/5 border border-white/5 text-zinc-300'
                    }`}>
                      <span className={`text-[9px] font-bold block mb-0.5 ${
                        msg.speaker === 'AI' ? 'text-indigo-400' : 'text-zinc-500'
                      }`}>{msg.speaker}</span>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {callState === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/15 space-y-2"
              >
                <p className="text-[10px] font-bold text-indigo-400">Call Summary</p>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Caller needs emergency plumbing service for kitchen leak. Appointment booked for today 2-4 PM. Sent confirmation SMS to caller.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-medium">Appointment booked</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-medium">SMS sent</span>
                </div>
              </motion.div>
            )}

            {callState === 'ringing' && (
              <motion.div
                key="ringing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 pulse-ring" />
                  <div className="absolute -inset-3 rounded-full border border-indigo-500/15 pulse-ring" style={{ animationDelay: '0.5s' }} />
                </div>
                <p className="mt-3 text-sm text-indigo-300 font-medium animate-pulse">Ringing...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-500/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — Text */}
        <div ref={textRef} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8"
          >
            <Mic className="w-4 h-4" />
            AI-powered voice receptionist
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            {['Never', 'miss', 'a', 'call'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="inline-block mr-[0.3em] text-foreground"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <span className="gradient-text">
              {Array.from('again.').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, delay: 0.42 + i * 0.04 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10"
          >
            Your AI receptionist answers calls 24/7, books appointments, answers FAQs,
            and sends you detailed summaries — so you never lose a lead.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-12"
          >
            <Link
              href="/auth/login"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-2"
            >
              Start free trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl border border-white/10 text-zinc-300 font-medium text-lg hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 justify-center lg:justify-start"
          >
            {[
              { icon: Phone, label: 'Calls handled', value: '24/7', color: 'text-indigo-400' },
              { icon: Clock, label: 'Avg response', value: '<1s', color: 'text-purple-400' },
              { icon: Users, label: 'Businesses', value: '500+', color: 'text-violet-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center lg:text-left">
                <div className={`inline-flex items-center gap-1.5 ${color} mb-0.5`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xl font-bold">{value}</span>
                </div>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Live call mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <LiveCallMockup />
        </motion.div>
      </div>
    </section>
  )
}
