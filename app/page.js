'use client';

import { DottedSurface } from '@/components/ui/DottedSurface';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0e1a]">
      {/* Three.js Dotted Surface */}
      <DottedSurface />

      {/* Gradient overlays for depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/30 via-transparent to-[#0a0e1a]/90" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(76,110,245,0.08), transparent 60%)' }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header className={`flex items-center justify-between px-5 sm:px-10 py-5 sm:py-7 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">UTM Tracker Pro</span>
          </div>
        </header>

        {/* Hero */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-8">
          <div className="text-center max-w-3xl w-full">

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/[0.07] border border-white/[0.12] backdrop-blur-sm mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-400"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-white/70 tracking-wide">Analytics in tempo reale</span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-5 sm:mb-7 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Traccia ogni click.
              <br />
              <span className="bg-gradient-to-r from-brand-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Misura ogni risultato.
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-base sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 font-normal transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Crea link UTM professionali in pochi secondi, organizzali per cliente
              e monitora le performance con analytics dettagliate.
            </p>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-3 px-7 sm:px-9 py-4 sm:py-[18px] bg-white text-[#0a0e1a] rounded-2xl font-bold text-sm sm:text-base transition-all shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.03] active:scale-[0.98]"
              >
                Accedi alla Dashboard
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-4 sm:py-[18px] border border-white/20 text-white rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/[0.06] hover:border-white/30 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Crea un Link
              </Link>
            </div>

            {/* Feature cards */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-10 sm:mt-16 transition-all duration-1000 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { icon: '🔗', label: 'UTM Builder guidato', desc: 'Wizard step-by-step' },
                { icon: '📊', label: 'Click Analytics', desc: 'Device, browser, referer' },
                { icon: '👥', label: 'Multi-cliente', desc: 'Organizza per brand' },
                { icon: '⚡', label: 'Link abbreviati', desc: 'Redirect con tracking' },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-4 sm:py-5 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
                >
                  <span className="text-xl sm:text-2xl mb-0 sm:mb-1">{f.icon}</span>
                  <span className="text-xs sm:text-sm font-semibold text-white/80 text-center">{f.label}</span>
                  <span className="text-xs text-white/40">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
