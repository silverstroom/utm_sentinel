'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { FloatingPathsBackground } from '@/components/ui/FloatingPaths';

export default function LandingPage() {
  const title = 'UTM Tracker';
  const words = title.split(' ');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Floating paths — two layers crossing each other */}
      <div className="absolute inset-0 text-slate-950">
        <FloatingPathsBackground position={1} className="absolute inset-0 h-full text-slate-950" />
        <FloatingPathsBackground position={-1} className="absolute inset-0 h-full text-slate-950" />
      </div>

      {/* Top bar with small logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 flex items-center gap-2.5"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-200/50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <span className="font-bold text-surface-800 tracking-tight">UTM Tracker Pro</span>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Animated title — letter by letter with spring */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-3 sm:mr-4 last:mr-0">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: 'spring',
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed px-2"
          >
            Crea link UTM professionali, organizza per cliente
            e monitora ogni click con analytics dettagliate.
          </motion.p>

          {/* CTA — glassmorphism button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-col items-center gap-5"
          >
            <Link
              href="/login"
              className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <span className="inline-flex items-center rounded-[1.15rem] px-7 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold backdrop-blur-md bg-white/95 hover:bg-white text-black transition-all duration-300 group-hover:-translate-y-0.5 border border-black/10 hover:shadow-md">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  Accedi alla Dashboard
                </span>
                <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                  →
                </span>
              </span>
            </Link>

            <p className="text-sm text-neutral-500">
              Nuovo qui?{' '}
              <Link href="/register" className="font-semibold text-neutral-900 hover:underline underline-offset-4">
                Registrati come agente
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-neutral-200 backdrop-blur-sm shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-neutral-600">Analytics in tempo reale</span>
        </div>
      </motion.div>
    </div>
  );
}
