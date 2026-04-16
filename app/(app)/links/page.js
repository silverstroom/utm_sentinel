'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterClient, setFilterClient] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadData();
  }, [filterClient]);

  async function loadData() {
    setLoading(true);
    const [linksRes, clientsRes] = await Promise.all([
      fetch(`/api/links${filterClient ? `?client_id=${filterClient}` : ''}`),
      fetch('/api/clients'),
    ]);
    const linksData = await linksRes.json();
    const clientsData = await clientsRes.json();
    setLinks(Array.isArray(linksData) ? linksData : []);
    setClients(Array.isArray(clientsData) ? clientsData : []);
    setLoading(false);
  }

  function copyLink(link) {
    navigator.clipboard.writeText(`${window.location.origin}/r/${link.short_code}`);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function toggleActive(link) {
    await fetch('/api/links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...link, is_active: link.is_active ? 0 : 1 }),
    });
    loadData();
  }

  async function deleteLink(id) {
    if (!confirm('Eliminare questo link?')) return;
    await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
    loadData();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-surface-900 font-bold">Tutti i Link</h1>
          <p className="text-surface-500 mt-1 text-sm sm:text-base">{links.length} link totali</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
            className="flex-1 sm:flex-initial px-4 py-3 border border-surface-200 rounded-xl text-sm bg-white"
          >
            <option value="">Tutti i clienti</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Link
            href="/create"
            className="px-4 sm:px-5 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            <span className="hidden sm:inline">Nuovo Link</span>
            <span className="sm:hidden">Nuovo</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-surface-400">Caricamento...</div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-surface-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ba5b9" strokeWidth="1.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-700 mb-1">Nessun link</h3>
          <p className="text-sm text-surface-400 mb-4">Crea il tuo primo link UTM tracciato</p>
          <Link href="/create" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">
            Crea Link
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop: Table view */}
          <div className="hidden lg:block bg-white rounded-2xl border border-surface-200 overflow-hidden animate-fade-in">
            <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Link / Campagna</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">UTM</th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Click</th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Stato</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="table-row border-b border-surface-50 last:border-0">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-surface-800">
                        {link.label || link.utm_campaign || 'Senza etichetta'}
                      </p>
                      <p className="text-xs text-surface-400 font-mono truncate max-w-[280px]">
                        {link.destination_url}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ background: link.client_color }}
                      >
                        {link.client_name?.charAt(0)}
                      </div>
                      <span className="text-sm text-surface-600">{link.client_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {link.utm_source && <span className="badge bg-blue-50 text-blue-600">{link.utm_source}</span>}
                      {link.utm_medium && <span className="badge bg-violet-50 text-violet-600">{link.utm_medium}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-lg font-bold text-surface-900">{link.click_count.toLocaleString('it-IT')}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleActive(link)}
                      className={`badge cursor-pointer ${link.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-100 text-surface-400'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${link.is_active ? 'bg-emerald-500' : 'bg-surface-300'}`}
                        style={link.is_active ? { animation: 'pulse-dot 2s infinite' } : {}}
                      />
                      {link.is_active ? 'Attivo' : 'Inattivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => copyLink(link)}
                        className={`p-2 rounded-lg transition-colors text-sm ${
                          copiedId === link.id
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'hover:bg-surface-50 text-surface-400 hover:text-surface-600'
                        }`}
                        title="Copia link"
                      >
                        {copiedId === link.id ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        )}
                      </button>
                      <Link
                        href={`/analytics/${link.client_id}?link=${link.id}`}
                        className="p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-400 hover:text-brand-600"
                        title="Analytics"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 20V10M12 20V4M6 20v-6"/>
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-surface-400 hover:text-red-500"
                        title="Elimina"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile: Card view */}
          <div className="lg:hidden space-y-3 animate-fade-in">
            {links.map((link) => (
              <div key={link.id} className="bg-white rounded-2xl border border-surface-200 p-4">
                {/* Header with client + status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: link.client_color }}>
                      {link.client_name?.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-surface-600 truncate">{link.client_name}</span>
                  </div>
                  <button
                    onClick={() => toggleActive(link)}
                    className={`badge cursor-pointer ${link.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-100 text-surface-400'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${link.is_active ? 'bg-emerald-500' : 'bg-surface-300'}`}
                      style={link.is_active ? { animation: 'pulse-dot 2s infinite' } : {}} />
                    {link.is_active ? 'Attivo' : 'Inattivo'}
                  </button>
                </div>

                {/* Label/Campaign */}
                <p className="font-semibold text-surface-800 mb-1 truncate">
                  {link.label || link.utm_campaign || 'Senza etichetta'}
                </p>
                <p className="text-xs text-surface-400 font-mono truncate mb-3">
                  {link.destination_url}
                </p>

                {/* UTM badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {link.utm_source && <span className="badge bg-blue-50 text-blue-600">{link.utm_source}</span>}
                  {link.utm_medium && <span className="badge bg-violet-50 text-violet-600">{link.utm_medium}</span>}
                </div>

                {/* Footer: clicks + actions */}
                <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                  <div>
                    <p className="text-2xl font-bold text-surface-900 leading-none">{link.click_count.toLocaleString('it-IT')}</p>
                    <p className="text-[11px] text-surface-400 font-medium mt-0.5">click</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyLink(link)}
                      className={`p-2.5 rounded-lg transition-colors ${
                        copiedId === link.id ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-50 text-surface-500 hover:text-surface-700'
                      }`}
                      title="Copia link"
                    >
                      {copiedId === link.id ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      )}
                    </button>
                    <Link
                      href={`/analytics/${link.client_id}?link=${link.id}`}
                      className="p-2.5 bg-surface-50 rounded-lg text-surface-500 hover:text-brand-600 transition-colors"
                      title="Analytics"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 20V10M12 20V4M6 20v-6"/>
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-2.5 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                      title="Elimina"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
