"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-500/6 to-transparent rounded-full blur-[120px] -z-10" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Command Center for{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
              AI Call Management
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg">
            See real-time call analytics, smart routing, and AI transcriptions at a glance.
          </p>
        </motion.div>
        <motion.div style={{ y, scale, opacity }} className="relative mx-auto max-w-5xl">
          <div className="rounded-xl border border-white/[0.08] bg-[#0f0d0a]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-500 min-w-[240px] text-center">
                  app.aireceptionist.com/dashboard
                </div>
              </div>
              <div className="w-[52px]" />
            </div>
            <div className="relative aspect-[16/9.5] w-full">
              <Image
                src="/images/dashboard.webp"
                alt="AIReceptionist dashboard showing call analytics and AI transcriptions"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                quality={90}
                priority={false}
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 bg-violet-500/8 rounded-full blur-[40px]" />
        </motion.div>
      </div>
    </section>
  );
}
