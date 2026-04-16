import Link from 'next/link';
import { getDashboardStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl sm:text-4xl text-surface-900 font-bold">Dashboard</h1>
        <p className="text-surface-500 mt-1 text-sm sm:text-base">Panoramica delle performance dei tuoi link UTM</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {[
          { label: 'Clienti Totali', value: stats.total_clients, icon: '👥', color: 'from-blue-500 to-blue-600' },
          { label: 'Link Attivi', value: stats.total_links, icon: '🔗', color: 'from-violet-500 to-violet-600' },
          { label: 'Click Totali', value: stats.total_clicks.toLocaleString('it-IT'), icon: '📊', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Click Oggi', value: stats.clicks_today.toLocaleString('it-IT'), icon: '⚡', color: 'from-amber-500 to-amber-600' },
        ].map((stat, i) => (
          <div key={stat.label} className={`card-hover bg-white rounded-2xl p-4 sm:p-6 border border-surface-200 stat-pattern animate-fade-in stagger-${i + 1}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
              <div className={`w-8 h-1.5 rounded-full bg-gradient-to-r ${stat.color}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">{stat.value}</p>
            <p className="text-xs sm:text-sm text-surface-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 border border-surface-200 animate-fade-in stagger-3">
          <h3 className="font-semibold text-surface-800 mb-4">Andamento Click — Ultimi 14 giorni</h3>
          {stats.recentClicks.length > 0 ? (
            <BarChart data={[...stats.recentClicks].reverse()} />
          ) : (
            <EmptyState message="Nessun click registrato. Crea il tuo primo link UTM!" />
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-surface-200 animate-fade-in stagger-4">
          <h3 className="font-semibold text-surface-800 mb-4">Top Clienti</h3>
          {stats.topClients.length > 0 ? (
            <div className="space-y-3">
              {stats.topClients.map((client, i) => (
                <Link key={client.id} href={`/analytics/${client.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ background: client.color }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-800 truncate group-hover:text-brand-600 transition-colors">{client.name}</p>
                    <p className="text-xs text-surface-400">{Number(client.click_count).toLocaleString('it-IT')} click</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-surface-400">#{i + 1}</span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Nessun cliente ancora." />
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-fade-in stagger-5">
        <Link href="/create" className="card-hover flex items-center gap-4 p-5 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl text-white shadow-lg shadow-brand-200">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <div>
            <p className="font-semibold text-lg">Crea Nuovo Link UTM</p>
            <p className="text-white/70 text-sm">Genera un link tracciato con parametri UTM</p>
          </div>
        </Link>
        <Link href="/clients" className="card-hover flex items-center gap-4 p-5 bg-white rounded-2xl border border-surface-200">
          <div className="w-12 h-12 bg-surface-50 rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4c6ef5" strokeWidth="2" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-lg text-surface-800">Gestisci Clienti</p>
            <p className="text-surface-400 text-sm">Aggiungi o modifica i tuoi clienti</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => Number(d.count)), 1);
  return (
    <div className="flex items-end gap-2 h-[180px]">
      {data.map((d) => {
        const count = Number(d.count);
        const height = Math.max((count / max) * 100, 4);
        const day = new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[11px] font-mono font-semibold text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
            <div className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-md transition-all duration-300 group-hover:from-brand-600 group-hover:to-brand-500" style={{ height: `${height}%` }} />
            <span className="text-[10px] text-surface-400 font-mono">{day}</span>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ba5b9" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </div>
      <p className="text-sm text-surface-400">{message}</p>
    </div>
  );
}
