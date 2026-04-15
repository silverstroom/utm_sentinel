'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COLORS = [
  '#4c6ef5', '#7950f2', '#be4bdb', '#e64980', '#fa5252',
  '#fd7e14', '#fab005', '#40c057', '#12b886', '#15aabf',
];

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, name: name.trim(), color }),
      });
    } else {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color }),
      });
    }

    setName('');
    setColor(COLORS[0]);
    setEditingId(null);
    setShowForm(false);
    loadClients();
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo cliente e tutti i suoi link?')) return;
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
    loadClients();
  }

  function startEdit(client) {
    setEditingId(client.id);
    setName(client.name);
    setColor(client.color);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-4xl text-surface-900 font-bold">Clienti</h1>
          <p className="text-surface-500 mt-1">Gestisci i tuoi clienti e monitora le performance</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setName(''); setColor(COLORS[0]); }}
          className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nuovo Cliente
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold text-surface-800 mb-4">{editingId ? 'Modifica Cliente' : 'Nuovo Cliente'}</h3>
          <form onSubmit={handleSubmit} className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-surface-500 mb-1.5 block">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Es. Acme Corp"
                className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-500 mb-1.5 block">Colore</label>
              <div className="flex gap-1.5">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-brand-400' : 'hover:scale-105'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
              {editingId ? 'Salva' : 'Aggiungi'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-500 hover:bg-surface-50">
              Annulla
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-surface-400">Caricamento...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-surface-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ba5b9" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-700 mb-1">Nessun cliente</h3>
          <p className="text-sm text-surface-400 mb-4">Aggiungi il tuo primo cliente per iniziare</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700"
          >
            Aggiungi Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <div
              key={client.id}
              className={`card-hover bg-white rounded-2xl border border-surface-200 p-6 animate-fade-in stagger-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm"
                    style={{ background: client.color }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900">{client.name}</h3>
                    <p className="text-xs text-surface-400">
                      {new Date(client.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(client)}
                    className="p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-400 hover:text-surface-600"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-surface-400 hover:text-red-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-surface-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-surface-900">{client.link_count}</p>
                  <p className="text-[11px] text-surface-400 font-medium">Link</p>
                </div>
                <div className="flex-1 bg-surface-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-surface-900">{client.total_clicks.toLocaleString('it-IT')}</p>
                  <p className="text-[11px] text-surface-400 font-medium">Click</p>
                </div>
              </div>

              <Link
                href={`/analytics/${client.id}`}
                className="block text-center py-2.5 border border-surface-200 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-50 hover:text-brand-600 transition-colors"
              >
                Vedi Analytics →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
