'use client'

import { motion } from 'framer-motion'
import { PhoneForwarded, Bot, FileText, Bell } from 'lucide-react'

const steps = [
  {
    icon: PhoneForwarded,
    title: 'Connect your number',
    description: 'Forward your business line to AIReceptionist. Takes 2 minutes.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: Bot,
    title: 'AI answers calls',
    description: 'Our AI greets callers naturally, answers questions, and handles requests.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: FileText,
    title: 'Get summaries',
    description: 'After each call, receive a summary with action items and sentiment analysis.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Bell,
    title: 'Never miss a lead',
    description: 'Important calls get flagged. Appointments get booked. You focus on your work.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Set up in minutes. Start receiving calls immediately.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className="text-xs text-zinc-600 font-mono mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
