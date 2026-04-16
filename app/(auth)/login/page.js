'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FloatingPathsBackground } from '@/components/ui/FloatingPaths';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore di login');
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 sm:p-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2 block">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Il tuo username"
            className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none transition-colors"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="La tua password"
            className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white text-[#0a0e1a] rounded-xl font-bold text-sm hover:bg-white/95 transition-all disabled:opacity-50 shadow-lg shadow-white/10"
        >
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/40 text-sm">
          Non hai un account?{' '}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 sm:p-8">
      <div className="h-10 bg-white/5 rounded-xl animate-pulse mb-4" />
      <div className="h-10 bg-white/5 rounded-xl animate-pulse mb-4" />
      <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="fixed inset-0 -z-10">
        <FloatingPathsBackground position={1} className="absolute inset-0 h-full" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/25 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Accedi a UTM Tracker</h1>
          <p className="text-white/50 mt-1 text-sm">Inserisci le tue credenziali</p>
        </div>

        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
