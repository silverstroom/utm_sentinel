'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const linkId = searchParams.get('link');

  const [client, setClient] = useState(null);
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(linkId || '');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedLink) {
      loadLinkStats(selectedLink);
    } else {
      loadClientStats();
    }
  }, [selectedLink]);

  async function loadData() {
    const [clientRes, linksRes] = await Promise.all([
      fetch('/api/clients'),
      fetch(`/api/links?client_id=${id}`),
    ]);
    const clients = await clientRes.json();
    const c = clients.find(cl => cl.id === id);
    setClient(c);
    const l = await linksRes.json();
    setLinks(l);

    if (linkId) {
      setSelectedLink(linkId);
    } else {
      loadClientStats();
    }
  }

  async function loadClientStats() {
    setLoading(true);
    const res = await fetch(`/api/clicks?client_id=${id}`);
    const data = await res.json();
    setStats({ type: 'client', ...data });
    setLoading(false);
  }

  async function loadLinkStats(lid) {
    setLoading(true);
    const res = await fetch(`/api/clicks?link_id=${lid}`);
    const data = await res.json();
    setStats({ type: 'link', ...data });
    setLoading(false);
  }

  if (!client) {
    return <div className="text-center py-20 text-surface-400">Caricamento...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-fade-in">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href="/clients" className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-400 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0"
            style={{ background: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl text-surface-900 font-bold truncate">{client.name}</h1>
            <p className="text-surface-500 text-xs sm:text-sm">Analytics e performance dei link</p>
          </div>
        </div>

        <select
          value={selectedLink}
          onChange={e => setSelectedLink(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 border border-surface-200 rounded-xl text-sm bg-white sm:min-w-[200px]"
        >
          <option value="">Panoramica cliente</option>
          {links.map(l => (
            <option key={l.id} value={l.id}>
              {l.label || l.utm_campaign || l.short_code} ({l.click_count} click)
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-surface-400">Caricamento analytics...</div>
      ) : !stats ? (
        <div className="text-center py-20 text-surface-400">Nessun dato disponibile</div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Click Totali"
              value={stats.type === 'client' ? stats.totalClicks : stats.total}
              icon="📊"
            />
            <StatCard
              label="Link Attivi"
              value={links.filter(l => l.is_active).length}
              icon="🔗"
            />
            <StatCard
              label="Media Giornaliera"
              value={(() => {
                const days = stats.type === 'client' ? stats.clicksByDay : stats.byDay;
                if (!days?.length) return 0;
                const total = days.reduce((s, d) => s + d.count, 0);
                return Math.round(total / days.length);
              })()}
              icon="📈"
            />
            <StatCard
              label="Periodo"
              value="30gg"
              icon="📅"
              isText
            />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="font-semibold text-surface-800 mb-4">Andamento Click</h3>
            <ClickChart data={(stats.type === 'client' ? stats.clicksByDay : stats.byDay) || []} color={client.color} />
          </div>

          {stats.type === 'link' ? (
            /* Link-specific analytics */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <BreakdownCard title="Dispositivi" data={stats.byDevice} />
              <BreakdownCard title="Browser" data={stats.byBrowser} />
              <BreakdownCard title="Paesi" data={stats.byCountry} />
            </div>
          ) : (
            /* Client overview - top links */
            <div className="bg-white rounded-2xl border border-surface-200 p-6">
              <h3 className="font-semibold text-surface-800 mb-4">Top Link per Click</h3>
              {stats.topLinks?.length > 0 ? (
                <div className="space-y-3">
                  {stats.topLinks.map((link, i) => {
                    const maxClicks = Math.max(...stats.topLinks.map(l => l.click_count), 1);
                    const width = (link.click_count / maxClicks) * 100;
                    return (
                      <button
                        key={link.id}
                        onClick={() => setSelectedLink(link.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors text-left group"
                      >
                        <span className="text-xs font-mono font-bold text-surface-300 w-6">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-surface-800 truncate group-hover:text-brand-600 transition-colors">
                            {link.label || link.utm_campaign || 'Senza etichetta'}
                          </p>
                          <p className="text-xs text-surface-400 truncate">{link.destination_url}</p>
                          <div className="mt-2 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${width}%`, background: client.color }}
                            />
                          </div>
                        </div>
                        <span className="text-lg font-bold text-surface-900">{link.click_count.toLocaleString('it-IT')}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-surface-400 text-center py-8">Nessun click registrato</p>
              )}
            </div>
          )}

          {stats.type === 'link' && stats.byReferer?.length > 0 && (
            <div className="bg-white rounded-2xl border border-surface-200 p-6">
              <h3 className="font-semibold text-surface-800 mb-4">Top Referrer</h3>
              <div className="space-y-2">
                {stats.byReferer.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-50">
                    <span className="text-sm text-surface-600 truncate max-w-[70%] font-mono">{r.referer}</span>
                    <span className="text-sm font-bold text-surface-800">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, isText }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 stat-pattern">
      <span className="text-xl mb-3 block">{icon}</span>
      <p className={`${isText ? 'text-2xl' : 'text-3xl'} font-bold text-surface-900 tracking-tight`}>
        {typeof value === 'number' ? value.toLocaleString('it-IT') : value}
      </p>
      <p className="text-sm text-surface-400 mt-1 font-medium">{label}</p>
    </div>
  );
}

function ClickChart({ data, color }) {
  if (!data.length) {
    return <p className="text-sm text-surface-400 text-center py-12">Nessun dato per il periodo selezionato</p>;
  }

  const reversed = [...data].reverse();
  const max = Math.max(...reversed.map(d => d.count), 1);

  return (
    <div className="flex items-end gap-1.5 h-[200px]">
      {reversed.map((d) => {
        const height = Math.max((d.count / max) * 100, 3);
        const day = new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[11px] font-mono font-semibold text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {d.count}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
              style={{ height: `${height}%`, background: color }}
            />
            <span className="text-[9px] text-surface-400 font-mono whitespace-nowrap">{day}</span>
          </div>
        );
      })}
    </div>
  );
}

function BreakdownCard({ title, data }) {
  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-4">{title}</h3>
        <p className="text-sm text-surface-400 text-center py-4">Nessun dato</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6">
      <h3 className="font-semibold text-surface-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 6).map((item, i) => {
          const key = Object.keys(item).find(k => k !== 'count') || 'unknown';
          const label = item[key] || 'Sconosciuto';
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-surface-700 font-medium capitalize">{label}</span>
                <span className="text-xs text-surface-400 font-mono">{pct}%</span>
              </div>
              <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
