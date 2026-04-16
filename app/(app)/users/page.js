'use client';

import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function toggleStatus(user) {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, is_active: !user.is_active }),
    });
    loadUsers();
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo utente?')) return;
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    loadUsers();
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="font-display text-3xl sm:text-4xl text-surface-900 font-bold">Gestione Utenti</h1>
        <p className="text-surface-500 mt-1 text-sm sm:text-base">Gestisci gli agenti registrati sulla piattaforma</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-surface-400">Caricamento...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-surface-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ba5b9" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-700 mb-1">Nessun utente registrato</h3>
          <p className="text-sm text-surface-400">Gli agenti appariranno qui dopo la registrazione</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl border border-surface-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm ${
                    user.role === 'admin' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-brand-400 to-brand-600'
                  }`}>
                    {(user.name || user.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">{user.name} {user.surname}</p>
                    <p className="text-xs text-surface-400">@{user.username}</p>
                  </div>
                </div>
                {user.role !== 'admin' && (
                  <div className="flex gap-1">
                    <button onClick={() => toggleStatus(user)}
                      className={`p-1.5 rounded-lg transition-colors text-xs ${user.is_active ? 'hover:bg-amber-50 text-amber-500' : 'hover:bg-emerald-50 text-emerald-500'}`}
                      title={user.is_active ? 'Disattiva' : 'Attiva'}>
                      {user.is_active
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      }
                    </button>
                    <button onClick={() => handleDelete(user.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-surface-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                  <span className="truncate">{user.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{user.area || '—'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <span className={`badge ${user.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-brand-50 text-brand-700'}`}>
                  {user.role === 'admin' ? '👑 Admin' : '📋 Agente'}
                </span>
                <span className={`badge ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {user.is_active ? '● Attivo' : '○ Disattivato'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
