'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FloatingPathsBackground } from '@/components/ui/FloatingPaths';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', surname: '', area: '', email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Le password non coincidono');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore nella registrazione');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-10">
      <div className="fixed inset-0 -z-10">
        <FloatingPathsBackground position={-1} className="absolute inset-0 h-full" />
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
          <h1 className="text-2xl font-bold text-white">Crea il tuo Account</h1>
          <p className="text-white/50 mt-1 text-sm">Registrati come agente per iniziare</p>
        </div>

        {/* Form */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm font-medium mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Nome *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Mario" required
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Cognome *</label>
                <input type="text" value={form.surname} onChange={e => update('surname', e.target.value)}
                  placeholder="Rossi" required
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Area / Zona *</label>
              <input type="text" value={form.area} onChange={e => update('area', e.target.value)}
                placeholder="Es. Roma, Lombardia, Nord Italia..." required
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Email *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="mario.rossi@email.com" required
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Username *</label>
              <input type="text" value={form.username} onChange={e => update('username', e.target.value)}
                placeholder="mrossi" required
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 caratteri" required minLength={6}
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Conferma *</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Ripeti password" required
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/30 focus:border-brand-400 focus:ring-0 focus:outline-none" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-white text-[#0a0e1a] rounded-xl font-bold text-sm hover:bg-white/95 transition-all disabled:opacity-50 shadow-lg shadow-white/10 mt-2">
              {loading ? 'Registrazione in corso...' : 'Registrati come Agente'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Hai già un account?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
