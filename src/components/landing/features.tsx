'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  Phone,
  Calendar,
  MessageSquare,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Bell,
} from 'lucide-react'

const features = [
  {
    icon: Phone,
    title: '24/7 Call Answering',
    description: 'Your AI receptionist never sleeps. Every call answered instantly, even at 3 AM.',
    gradient: 'from-indigo-500 to-blue-500',
    glow: 'bg-indigo-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description: 'Automatically books appointments into your calendar with smart scheduling.',
    gradient: 'from-purple-500 to-violet-500',
    glow: 'bg-purple-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversations',
    description: 'Powered by advanced AI — callers can\'t tell they\'re talking to an AI.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'bg-violet-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: BarChart3,
    title: 'Call Analytics',
    description: 'Track call volume, sentiment, peak hours, and common questions. Data-driven insights.',
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'bg-indigo-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Handles calls in English, French, Spanish, and more. Perfect for diverse markets.',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'bg-blue-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Shield,
    title: 'Smart Transfers',
    description: 'Urgent calls? AI transfers to the right person. Non-urgent? Scheduled callback.',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'bg-purple-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Connect your phone number in 2 minutes. No hardware, no complex setup.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'bg-amber-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description: 'Get SMS/email summaries after every call. Never miss important details.',
    gradient: 'from-indigo-500 to-purple-500',
    glow: 'bg-indigo-500/20',
    span: 'md:col-span-1',
  },
]

export function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section ref={ref} id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.15_0.08_270),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Your business,{' '}
            <span className="gradient-text">always available</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything a great receptionist does — powered by AI, available 24/7, at a fraction of the cost.
          </p>
        </motion.div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[2%] hover:bg-white/[4%] transition-all duration-300 overflow-hidden ${feature.span}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl ${feature.glow}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
