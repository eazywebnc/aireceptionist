'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

const tiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for solo businesses and freelancers.',
    features: [
      '50 calls/month',
      '1 business line',
      'Basic greeting customization',
      'Call summaries via email',
      'Business hours routing',
    ],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For growing businesses that need more.',
    features: [
      '200 calls/month',
      '3 business lines',
      'Custom AI personality',
      'Appointment booking',
      'Call analytics dashboard',
      'SMS notifications',
      'Voicemail transcription',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Business',
    price: '$149',
    period: '/month',
    description: 'Unlimited power for established businesses.',
    features: [
      'Unlimited calls',
      'Unlimited business lines',
      'Multi-language support',
      'Custom call flows',
      'API access',
      'Priority support',
      'Advanced analytics',
      'CRM integrations',
    ],
    cta: 'Contact sales',
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple{' '}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Start with a 14-day free trial. No credit card required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                tier.popular
                  ? 'border-2 border-indigo-500/50 bg-gradient-to-b from-indigo-500/10 to-transparent shadow-xl shadow-indigo-500/10 scale-[1.02]'
                  : 'border border-white/10 bg-white/[2%] hover:bg-white/[3%]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-zinc-500">{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">{tier.price}</span>
                <span className="text-zinc-500 text-sm ml-1">{tier.period}</span>
              </div>

              <Link
                href="/auth/login"
                className={`block w-full text-center py-3 rounded-xl font-medium text-sm transition-all mb-8 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                    : 'border border-white/10 text-zinc-300 hover:bg-white/5'
                }`}
              >
                {tier.cta}
              </Link>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
