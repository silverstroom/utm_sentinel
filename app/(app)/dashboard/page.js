import Link from 'next/link';
import { cookies } from 'next/headers';
import { getAgentStats, getAllClients } from '@/lib/db';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const token = cookies().get('utm_session')?.value;
  const user = verifySessionToken(token);

  const [stats, clients] = await Promise.all([
    getAgentStats(user?.id).catch(() => ({ total_clients: 0, total_links: 0, total_clicks: 0, clicks_today: 0, clicks_week: 0, recentClicks: [], topLinks: [] })),
    getAllClients().catch(() => []),
  ]);

  const topClients = clients.slice().sort((a, b) => Number(b.total_clicks) - Number(a.total_clicks)).slice(0, 5);
  const avgDailyClicks = stats.recentClicks.length > 0
    ? Math.round(stats.recentClicks.reduce((s, d) => s + Number(d.count), 0) / stats.recentClicks.length)
    : 0;

  const clicksYesterday = (() => {
    if (!stats.recentClicks.length) return 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const ydStr = yesterday.toISOString().slice(0, 10);
    const match = stats.recentClicks.find(d => d.date === ydStr);
    return Number(match?.count ?? 0);
  })();

  const trend = clicksYesterday > 0 ? ((stats.clicks_today - clicksYesterday) / clicksYesterday) * 100 : 0;

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-surface-900 font-bold">
            Ciao, {user?.name || 'Utente'}!
          </h1>
          <p className="text-surface-500 mt-1 text-sm sm:text-base">
            Ecco una panoramica delle performance della tua piattaforma UTM
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/create" className="px-5 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-md shadow-brand-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Nuovo Link
          </Link>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard
          label="Click Oggi" value={stats.clicks_today} icon="⚡" gradient="from-amber-400 to-amber-600"
          trend={trend} trendLabel={`${trend >= 0 ? '+' : ''}${trend.toFixed(0)}% vs ieri`}
          animateIndex={1}
        />
        <StatCard
          label="Click 7gg" value={stats.clicks_week} icon="📅" gradient="from-emerald-400 to-emerald-600"
          subLabel={`${Math.round(stats.clicks_week / 7)} al giorno in media`}
          animateIndex={2}
        />
        <StatCard
          label="Click Totali" value={stats.total_clicks} icon="📊" gradient="from-brand-400 to-brand-600"
          subLabel="Dall'inizio del tracking"
          animateIndex={3}
        />
        <StatCard
          label="Link Attivi" value={stats.total_links} icon="🔗" gradient="from-violet-400 to-violet-600"
          subLabel={`${stats.total_clients} clienti`}
          animateIndex={4}
        />
      </div>

      {/* Main Grid: Chart + Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 border border-surface-200 animate-fade-in stagger-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-surface-900">Andamento Click</h3>
              <p className="text-xs text-surface-400 mt-0.5">Ultimi 14 giorni</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div>
                <p className="text-surface-400 font-medium">Media</p>
                <p className="font-bold text-surface-800">{avgDailyClicks.toLocaleString('it-IT')}/gg</p>
              </div>
              <div>
                <p className="text-surface-400 font-medium">Picco</p>
                <p className="font-bold text-surface-800">{Math.max(...stats.recentClicks.map(d => Number(d.count)), 0).toLocaleString('it-IT')}</p>
              </div>
            </div>
          </div>
          {stats.recentClicks.length > 0 ? (
            <BarChart data={[...stats.recentClicks].reverse().slice(-14)} />
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-200 animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-surface-900">Top Clienti</h3>
            <Link href="/clients" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Vedi tutti →
            </Link>
          </div>
          {topClients.length > 0 ? (
            <div className="space-y-2">
              {topClients.map((client, i) => {
                const maxClicks = Math.max(...topClients.map(c => Number(c.total_clicks)), 1);
                const pct = (Number(client.total_clicks) / maxClicks) * 100;
                return (
                  <Link key={client.id} href={`/analytics/${client.id}`} className="block p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0" style={{ background: client.color }}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-800 truncate group-hover:text-brand-600 transition-colors">
                          {client.name}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-surface-900">{Number(client.total_clicks).toLocaleString('it-IT')}</span>
                    </div>
                    <div className="h-1 bg-surface-100 rounded-full overflow-hidden ml-11">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: client.color }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-surface-400">Nessun cliente ancora</p>
              <Link href="/clients" className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-2 inline-block">
                Aggiungi il primo cliente →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Top Links */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-200 animate-fade-in stagger-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-surface-900">Top Link per Performance</h3>
            <p className="text-xs text-surface-400 mt-0.5">I link più cliccati</p>
          </div>
          <Link href="/links" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            Vedi tutti →
          </Link>
        </div>
        {stats.topLinks.length > 0 ? (
          <div className="space-y-2">
            {stats.topLinks.slice(0, 5).map((link, i) => (
              <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <span className="text-xs font-mono font-bold text-surface-300 w-6 flex-shrink-0">#{i + 1}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0" style={{ background: link.client_color }}>
                  {link.client_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 truncate">
                    {link.label || link.utm_campaign || 'Senza etichetta'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold text-surface-500">{link.client_name}</span>
                    {link.utm_source && <span className="badge bg-blue-50 text-blue-600 text-[10px]">{link.utm_source}</span>}
                    {link.utm_medium && <span className="badge bg-violet-50 text-violet-600 text-[10px]">{link.utm_medium}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-surface-900 leading-none">{Number(link.click_count).toLocaleString('it-IT')}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">click</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-surface-400 mb-2">Nessun click registrato ancora</p>
            <Link href="/create" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Crea il tuo primo link →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in stagger-5">
        <QuickAction
          href="/create" title="Nuovo Link UTM" desc="Crea un link tracciato con wizard guidato"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>}
          primary
        />
        <QuickAction
          href="/clients" title="Gestisci Clienti" desc="Aggiungi o modifica clienti"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <QuickAction
          href="/links" title="Tutti i Link" desc="Visualizza e gestisci i link creati"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient, trend, trendLabel, subLabel, animateIndex }) {
  const isUp = trend !== undefined && trend >= 0;
  return (
    <div className={`card-hover bg-white rounded-2xl p-4 sm:p-5 border border-surface-200 stat-pattern animate-fade-in stagger-${animateIndex}`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <div className={`w-7 h-1 rounded-full bg-gradient-to-r ${gradient}`} />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight leading-tight">
        {typeof value === 'number' ? value.toLocaleString('it-IT') : value}
      </p>
      <p className="text-xs sm:text-sm text-surface-400 mt-1 font-medium">{label}</p>
      {trendLabel && (
        <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {isUp ? '↑' : '↓'} {trendLabel}
        </div>
      )}
      {subLabel && !trendLabel && (
        <p className="text-[11px] text-surface-400 mt-2 font-medium">{subLabel}</p>
      )}
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => Number(d.count)), 1);
  return (
    <div className="flex items-end gap-1 sm:gap-2 h-[180px] sm:h-[200px]">
      {data.map((d) => {
        const count = Number(d.count);
        const height = Math.max((count / max) * 100, 3);
        const day = new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[11px] font-mono font-bold text-surface-700 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
            <div className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-md transition-all duration-300 group-hover:from-brand-600 group-hover:to-brand-500" style={{ height: `${height}%` }} />
            <span className="text-[9px] sm:text-[10px] text-surface-400 font-mono whitespace-nowrap">{day}</span>
          </div>
        );
      })}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ba5b9" strokeWidth="1.5">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
      </div>
      <p className="text-sm text-surface-400">Nessun click registrato</p>
      <Link href="/create" className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-2">Crea il tuo primo link →</Link>
    </div>
  );
}

function QuickAction({ href, title, desc, icon, primary }) {
  if (primary) {
    return (
      <Link href={href} className="card-hover flex items-center gap-4 p-4 sm:p-5 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl text-white shadow-lg shadow-brand-200">
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="font-bold text-base">{title}</p>
          <p className="text-white/70 text-xs">{desc}</p>
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className="card-hover flex items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-surface-200">
      <div className="w-11 h-11 bg-surface-50 rounded-xl flex items-center justify-center text-brand-600 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="font-bold text-base text-surface-800">{title}</p>
        <p className="text-surface-400 text-xs">{desc}</p>
      </div>
    </Link>
  );
}
