'use client';

import { useState, useEffect } from 'react';
import {
  WhatsAppIcon, InstagramIcon, FacebookIcon, GoogleIcon,
  GoogleBusinessIcon, LinkedInIcon, TikTokIcon, YouTubeIcon,
  EmailIcon, SmsIcon, QrCodeIcon, MetaAdsIcon, WebsiteIcon,
} from '@/components/ui/BrandIcons';

// ─── Channel Presets ───────────────────────────────────
const CHANNELS = [
  {
    id: 'whatsapp', name: 'WhatsApp', desc: 'Link condiviso tramite WhatsApp',
    Icon: WhatsAppIcon, color: '#25D366', bgLight: '#25D36612',
    utm_source: 'whatsapp', allowPaidChoice: true,
    organicMedium: 'social', paidMedium: 'paid_social',
  },
  {
    id: 'instagram', name: 'Instagram', desc: 'Post, stories, bio link, reels',
    Icon: InstagramIcon, color: '#E4405F', bgLight: '#E4405F12',
    utm_source: 'instagram', allowPaidChoice: true,
    organicMedium: 'social', paidMedium: 'paid_social',
  },
  {
    id: 'facebook', name: 'Facebook', desc: 'Post, pagina, gruppi',
    Icon: FacebookIcon, color: '#1877F2', bgLight: '#1877F212',
    utm_source: 'facebook', allowPaidChoice: true,
    organicMedium: 'social', paidMedium: 'cpc',
  },
  {
    id: 'google_ads', name: 'Google Ads', desc: 'Search, Display, Performance Max',
    Icon: GoogleIcon, color: '#4285F4', bgLight: '#4285F412',
    utm_source: 'google', allowPaidChoice: false,
    organicMedium: 'cpc', paidMedium: 'cpc', forcePaid: true,
  },
  {
    id: 'gbp', name: 'Google Business', desc: 'Scheda Google Business Profile',
    Icon: GoogleBusinessIcon, color: '#34A853', bgLight: '#34A85312',
    utm_source: 'google', allowPaidChoice: false,
    organicMedium: 'local', paidMedium: 'local', forceOrganic: true,
    hasSubOptions: true,
    subOptions: [
      { id: 'gbp_website', label: 'Sito Web nella scheda', desc: 'Pulsante "Sito web" sulla GBP', utm_content: 'gbp-website-button', icon: '🌐' },
      { id: 'gbp_whatsapp', label: 'WhatsApp nella scheda', desc: 'Pulsante WhatsApp sulla GBP', utm_content: 'gbp-whatsapp', icon: '💬' },
      { id: 'gbp_directions', label: 'Indicazioni stradali', desc: 'Pulsante "Indicazioni" Maps', utm_content: 'gbp-directions', icon: '🗺️' },
      { id: 'gbp_call', label: 'Pulsante Chiama', desc: 'Pulsante "Chiama" nella scheda', utm_content: 'gbp-call-button', icon: '📞' },
      { id: 'gbp_post', label: 'Post / Aggiornamento', desc: 'Link inserito nei post GBP', utm_content: 'gbp-post', icon: '📝' },
      { id: 'gbp_offer', label: 'Offerta / Promozione', desc: 'Link nelle offerte GBP', utm_content: 'gbp-offer', icon: '🏷️' },
      { id: 'gbp_product', label: 'Prodotto / Servizio', desc: 'Link nei prodotti GBP', utm_content: 'gbp-product', icon: '📦' },
      { id: 'gbp_booking', label: 'Prenotazione', desc: 'Pulsante "Prenota" sulla scheda', utm_content: 'gbp-booking', icon: '📅' },
      { id: 'gbp_menu', label: 'Menu', desc: 'Link al menu (ristoranti)', utm_content: 'gbp-menu', icon: '🍽️' },
    ],
  },
  {
    id: 'linkedin', name: 'LinkedIn', desc: 'Post, articoli, pagina aziendale',
    Icon: LinkedInIcon, color: '#0A66C2', bgLight: '#0A66C212',
    utm_source: 'linkedin', allowPaidChoice: true,
    organicMedium: 'social', paidMedium: 'cpc',
  },
  {
    id: 'tiktok', name: 'TikTok', desc: 'Video, bio, contenuti',
    Icon: TikTokIcon, color: '#010101', bgLight: '#01010110',
    utm_source: 'tiktok', allowPaidChoice: true,
    organicMedium: 'social', paidMedium: 'paid_social',
  },
  {
    id: 'youtube', name: 'YouTube', desc: 'Descrizioni, schede, shorts',
    Icon: YouTubeIcon, color: '#FF0000', bgLight: '#FF000012',
    utm_source: 'youtube', allowPaidChoice: true,
    organicMedium: 'video', paidMedium: 'cpc',
  },
  {
    id: 'email', name: 'Email / Newsletter', desc: 'Campagne email e newsletter',
    Icon: EmailIcon, color: '#7C3AED', bgLight: '#7C3AED12',
    utm_source: 'newsletter', allowPaidChoice: false,
    organicMedium: 'email', paidMedium: 'email', forceOrganic: true,
  },
  {
    id: 'sms', name: 'SMS', desc: 'Messaggi promozionali',
    Icon: SmsIcon, color: '#F59E0B', bgLight: '#F59E0B12',
    utm_source: 'sms', allowPaidChoice: false,
    organicMedium: 'sms', paidMedium: 'sms', forceOrganic: true,
  },
  {
    id: 'qrcode', name: 'QR Code', desc: 'Volantini, biglietti, vetrine',
    Icon: QrCodeIcon, color: '#6B7280', bgLight: '#6B728012',
    utm_source: 'qrcode', allowPaidChoice: false,
    organicMedium: 'offline', paidMedium: 'offline', forceOrganic: true,
  },
  {
    id: 'website', name: 'Sito Internet', desc: 'Blog, pagine, firma email, referral',
    Icon: WebsiteIcon, color: '#0EA5E9', bgLight: '#0EA5E912',
    utm_source: 'website', allowPaidChoice: false,
    organicMedium: 'referral', paidMedium: 'referral', forceOrganic: true,
  },
];

const CLIENT_COLORS = [
  '#4c6ef5', '#7950f2', '#be4bdb', '#e64980', '#fa5252',
  '#fd7e14', '#fab005', '#40c057', '#12b886', '#15aabf',
];

export default function CreateLinkPage() {
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [gbpSubOption, setGbpSubOption] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientColor, setNewClientColor] = useState(CLIENT_COLORS[0]);

  const TOTAL_STEPS = 5;

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // ─── Derived values ──────────────────────────────────
  const currentMedium = selectedChannel
    ? (isPaid ? selectedChannel.paidMedium : selectedChannel.organicMedium)
    : '';

  // Step 4 shows: 'gbp' for GBP sub-options, 'paid' for organic/paid choice, 'skip' for neither
  const step4Type = selectedChannel?.hasSubOptions ? 'gbp' : selectedChannel?.allowPaidChoice ? 'paid' : 'skip';

  function canProceed() {
    if (step === 1) return selectedClient !== null;
    if (step === 2) { try { new URL(url); return true; } catch { return false; } }
    if (step === 3) return selectedChannel !== null;
    if (step === 4) {
      if (step4Type === 'gbp') return gbpSubOption !== null;
      return true;
    }
    return true;
  }

  function generateCampaignSlug() {
    const client = clients.find(c => c.id === selectedClient);
    const clientSlug = (client?.name || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
    const channelSlug = selectedChannel?.id || 'link';
    const sub = gbpSubOption ? `-${gbpSubOption.id.replace('gbp_', '')}` : '';
    const type = isPaid ? 'paid' : 'org';
    const date = new Date().toISOString().slice(0, 7);
    return `${clientSlug}_${channelSlug}${sub}_${type}_${date}`;
  }

  function goToStep(n) {
    setError('');
    // Skip step 4 if channel doesn't need it
    if (n === 4 && step4Type === 'skip') {
      if (selectedChannel?.forcePaid) setIsPaid(true);
      else setIsPaid(false);
      n = 5;
    }
    if (n === 5 && !campaignName) {
      setCampaignName(generateCampaignSlug());
    }
    setStep(n);
  }

  function goBack() {
    if (step === 5 && step4Type === 'skip') {
      setStep(3);
    } else {
      setStep(step - 1);
    }
  }

  async function handleCreateClient(e) {
    e.preventDefault();
    if (!newClientName.trim()) return;
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newClientName.trim(), color: newClientColor }),
    });
    if (res.ok) {
      const client = await res.json();
      setClients(prev => [client, ...prev]);
      setSelectedClient(client.id);
      setNewClientName('');
      setShowNewClient(false);
    }
  }

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      // If GBP sub-option is selected, it provides utm_content; user's utmContent input extends it
      const finalUtmContent = gbpSubOption
        ? (utmContent ? `${gbpSubOption.utm_content}_${utmContent}` : gbpSubOption.utm_content)
        : utmContent;

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient,
          destination_url: url,
          utm_source: selectedChannel.utm_source,
          utm_medium: currentMedium,
          utm_campaign: campaignName || generateCampaignSlug(),
          utm_content: finalUtmContent,
          label: label || `${selectedChannel.name}${gbpSubOption ? ' — ' + gbpSubOption.label : ''}${campaignName ? ' — ' + campaignName : ''}`.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore nella creazione');
      }
      const link = await res.json();
      setCreatedLink(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetAll() {
    setStep(1); setSelectedClient(null); setSelectedChannel(null); setGbpSubOption(null); setIsPaid(false);
    setUrl(''); setLabel(''); setCampaignName(''); setUtmContent('');
    setCreatedLink(null); setError('');
  }

  const trackingUrl = createdLink
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${createdLink.short_code}`
    : '';

  // ═══════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ═══════════════════════════════════════════════════════
  if (createdLink) {
    const ChannelIcon = selectedChannel?.Icon;
    const fullUrl = (() => {
      try {
        const u = new URL(url);
        u.searchParams.set('utm_source', selectedChannel.utm_source);
        u.searchParams.set('utm_medium', currentMedium);
        u.searchParams.set('utm_campaign', campaignName);
        if (utmContent) u.searchParams.set('utm_content', utmContent);
        return u.toString();
      } catch { return url; }
    })();

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl border border-emerald-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-surface-900">Link Creato con Successo!</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {ChannelIcon && <ChannelIcon size={18} />}
              <span className="text-surface-500 font-medium">{selectedChannel.name} — {isPaid ? 'A pagamento' : 'Organico'}</span>
            </div>
          </div>

          <div className="space-y-5">
            {/* PRIMARY: Short tracking link */}
            <div>
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2 block">
                🔗 Link da condividere
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-surface-50 rounded-xl px-4 py-3.5 font-mono text-sm text-brand-700 border border-surface-200 truncate">
                  {trackingUrl}
                </div>
                <button onClick={() => copyToClipboard(trackingUrl)}
                  className="px-6 py-3.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors whitespace-nowrap">
                  {copied ? '✓ Copiato!' : 'Copia Link'}
                </button>
              </div>
              <p className="text-xs text-surface-400 mt-2">Ogni click verrà tracciato nella tua dashboard con device, browser, referer</p>
            </div>

            {/* UTM Parameters */}
            <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Parametri UTM</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {[
                  ['Source', selectedChannel.utm_source],
                  ['Medium', currentMedium],
                  ['Campaign', campaignName],
                  utmContent ? ['Content', utmContent] : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-surface-400">{k}:</span>
                    <span className="text-xs font-mono font-bold text-surface-700 break-all">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full URL preview */}
            <div>
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2 block">URL di destinazione completo</label>
              <div className="bg-surface-50 rounded-xl px-4 py-3 font-mono text-[11px] text-surface-500 border border-surface-200 break-all leading-relaxed">
                {fullUrl}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={resetAll} className="flex-1 py-3.5 bg-surface-800 text-white rounded-xl text-sm font-bold hover:bg-surface-900 transition-colors">Crea un altro link</button>
              <a href="/links" className="px-6 py-3.5 border border-surface-200 rounded-xl text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors text-center">Vedi tutti</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // WIZARD
  // ═══════════════════════════════════════════════════════
  // Calculate visible step for progress bar (skip step 4 if not applicable)
  const showStep4 = step4Type !== 'skip';
  const step4Label = step4Type === 'gbp' ? 'Posizione' : 'Tipo';
  const visibleSteps = [
    { n: 1, label: 'Cliente' },
    { n: 2, label: 'Link' },
    { n: 3, label: 'Canale' },
    ...(showStep4 ? [{ n: 4, label: step4Label }] : []),
    { n: 5, label: 'Conferma' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="font-display text-3xl sm:text-4xl text-surface-900 font-bold">Crea Link UTM</h1>
        <p className="text-surface-500 mt-1 text-sm sm:text-base">Segui i passaggi per generare il tuo link tracciato</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 animate-fade-in">
        {visibleSteps.map((s) => (
          <button
            key={s.n}
            onClick={() => { if (s.n < step) goToStep(s.n); }}
            className={`flex items-center justify-center sm:justify-start gap-2 flex-1 px-2 sm:px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              step === s.n
                ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                : step > s.n
                ? 'bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100'
                : 'bg-surface-100 text-surface-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              step === s.n ? 'bg-white/20' : step > s.n ? 'bg-emerald-200 text-emerald-700' : 'bg-surface-200'
            }`}>
              {step > s.n ? '✓' : s.n > 4 ? (showStep4 ? 5 : 4) : s.n}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">{error}</div>
      )}

      {/* ─── STEP 1: Cliente ─────────────────────────── */}
      {step === 1 && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="font-bold text-surface-900 text-lg mb-1">Per quale cliente è questo link?</h3>
            <p className="text-sm text-surface-500 mb-5">Seleziona un cliente esistente o creane uno nuovo</p>

            {clients.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {clients.map(client => (
                  <button key={client.id} onClick={() => setSelectedClient(client.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      selectedClient === client.id
                        ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                    }`}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: client.color }}>
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-surface-800 truncate">{client.name}</p>
                      <p className="text-xs text-surface-400">{Number(client.link_count || 0)} link</p>
                    </div>
                    {selectedClient === client.id && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4c6ef5" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!showNewClient ? (
              <button onClick={() => setShowNewClient(true)}
                className="w-full p-4 border-2 border-dashed border-surface-300 rounded-xl text-sm font-semibold text-surface-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all">
                + Aggiungi nuovo cliente
              </button>
            ) : (
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 animate-fade-in">
                <form onSubmit={handleCreateClient} className="flex flex-col sm:flex-row sm:items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-surface-600 mb-1.5 block">Nome Cliente</label>
                    <input type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)}
                      placeholder="Es. Acme Corp" className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm bg-white" autoFocus />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-surface-600 mb-1.5 block">Colore</label>
                    <div className="flex gap-1">
                      {CLIENT_COLORS.slice(0, 6).map(c => (
                        <button key={c} type="button" onClick={() => setNewClientColor(c)}
                          className={`w-8 h-8 sm:w-7 sm:h-7 rounded-lg transition-transform ${newClientColor === c ? 'scale-110 ring-2 ring-offset-1 ring-brand-400' : ''}`}
                          style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700">Aggiungi</button>
                    <button type="button" onClick={() => setShowNewClient(false)} className="px-3 py-2.5 text-surface-400 hover:text-surface-600 text-sm">✕</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── STEP 2: Link ────────────────────────────── */}
      {step === 2 && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="font-bold text-surface-900 text-lg mb-1">Dove vuoi mandare le persone?</h3>
            <p className="text-sm text-surface-500 mb-5">Incolla il link della pagina di destinazione</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-surface-600 mb-1.5 block">URL di Destinazione <span className="text-red-400">*</span></label>
                <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.esempio.com/pagina-prodotto"
                  className="w-full px-4 py-3.5 border border-surface-200 rounded-xl text-sm text-surface-800" autoFocus />
                {url && (() => { try { new URL(url); return null; } catch { return (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">URL non valido — deve iniziare con https://</p>
                ); }})()}
              </div>
              <div>
                <label className="text-xs font-bold text-surface-600 mb-1.5 block">Etichetta <span className="text-surface-400 font-normal">(opzionale)</span></label>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                  placeholder="Es. Promo Estate 2025, Landing Page Servizi..."
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 3: Canale ──────────────────────────── */}
      {step === 3 && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="font-bold text-surface-900 text-lg mb-1">Dove condividerai questo link?</h3>
            <p className="text-sm text-surface-500 mb-5">Seleziona il canale — i parametri UTM verranno configurati automaticamente</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CHANNELS.map(ch => {
                const Icon = ch.Icon;
                const isSelected = selectedChannel?.id === ch.id;
                return (
                  <button key={ch.id} onClick={() => { setSelectedChannel(ch); setGbpSubOption(null); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                    }`}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: ch.bgLight }}>
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm ${isSelected ? 'text-brand-700' : 'text-surface-800'}`}>{ch.name}</p>
                      <p className="text-[11px] text-surface-400 leading-tight mt-0.5">{ch.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 4a: GBP Placement ─────────────────── */}
      {step === 4 && step4Type === 'gbp' && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              {selectedChannel?.Icon && <selectedChannel.Icon size={24} />}
              <h3 className="font-bold text-surface-900 text-lg">
                Dove metterai il link nella Google Business?
              </h3>
            </div>
            <p className="text-sm text-surface-500 mb-6">Seleziona il posizionamento per tracciare quale elemento genera click</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedChannel?.subOptions?.map(opt => {
                const isSelected = gbpSubOption?.id === opt.id;
                return (
                  <button key={opt.id} onClick={() => setGbpSubOption(opt)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                    }`}>
                    <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold text-sm ${isSelected ? 'text-brand-700' : 'text-surface-800'}`}>{opt.label}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{opt.desc}</p>
                      {isSelected && (
                        <code className="inline-block mt-2 text-[10px] font-mono bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
                          content: {opt.utm_content}
                        </code>
                      )}
                    </div>
                    {isSelected && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4c6ef5" strokeWidth="2.5" className="flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 4b: Organico / Pagamento ────────────── */}
      {step === 4 && step4Type === 'paid' && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              {selectedChannel?.Icon && <selectedChannel.Icon size={24} />}
              <h3 className="font-bold text-surface-900 text-lg">
                Che tipo di contenuto è su {selectedChannel?.name}?
              </h3>
            </div>
            <p className="text-sm text-surface-500 mb-6">Questo determina il parametro <code className="text-xs font-mono bg-surface-100 px-1.5 py-0.5 rounded text-surface-700">utm_medium</code></p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Organico */}
              <button
                onClick={() => setIsPaid(false)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  !isPaid
                    ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                    : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                }`}
              >
                {!isPaid && (
                  <div className="absolute top-3 right-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2a10 10 0 1 0 10 10"/><path d="M2 12h10V2"/>
                  </svg>
                </div>
                <p className="font-bold text-surface-900 text-lg mb-1">Organico</p>
                <p className="text-sm text-surface-500 leading-relaxed">
                  Post, contenuti, storie o link condivisi senza budget pubblicitario
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                  <span className="text-[11px] font-mono font-bold">medium: {selectedChannel?.organicMedium}</span>
                </div>
              </button>

              {/* A Pagamento */}
              <button
                onClick={() => setIsPaid(true)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  isPaid
                    ? 'border-amber-400 bg-amber-50 shadow-sm'
                    : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                }`}
              >
                {isPaid && (
                  <div className="absolute top-3 right-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <p className="font-bold text-surface-900 text-lg mb-1">A Pagamento</p>
                <p className="text-sm text-surface-500 leading-relaxed">
                  Sponsorizzate, ads, campagne con budget investito
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700">
                  <span className="text-[11px] font-mono font-bold">medium: {selectedChannel?.paidMedium}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 5: Conferma ────────────────────────── */}
      {step === 5 && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="font-bold text-surface-900 text-lg mb-1">Dai un nome alla campagna</h3>
            <p className="text-sm text-surface-500 mb-5">Personalizza o usa il nome suggerito</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-surface-600 mb-1.5 block">Nome Campagna <span className="text-red-400">*</span></label>
                <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)}
                  placeholder="promo-estate-2025" className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm font-mono" autoFocus />
                <p className="text-xs text-surface-400 mt-1.5">Questo nome ti aiuterà a identificare la campagna su Google Analytics</p>
              </div>
              <div>
                <label className="text-xs font-bold text-surface-600 mb-1.5 block">Variante / Contenuto <span className="text-surface-400 font-normal">(opzionale — utile per A/B test)</span></label>
                <input type="text" value={utmContent} onChange={e => setUtmContent(e.target.value)}
                  placeholder="Es. banner-hero, cta-footer, versione-a..." className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm" />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Riepilogo Finale</p>
              <div className="space-y-3">
                <SummaryRow label="Cliente" value={clients.find(c => c.id === selectedClient)?.name} />
                <SummaryRow label="Canale">
                  <span className="flex items-center gap-2">
                    {selectedChannel?.Icon && <selectedChannel.Icon size={16} />}
                    <span className="font-medium text-surface-800">{selectedChannel?.name}</span>
                  </span>
                </SummaryRow>
                {gbpSubOption && (
                  <SummaryRow label="Posizione">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-700">
                      {gbpSubOption.icon} {gbpSubOption.label}
                    </span>
                  </SummaryRow>
                )}
                {!gbpSubOption && (
                  <SummaryRow label="Tipo">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold ${isPaid ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {isPaid ? '💰 A pagamento' : '🌱 Organico'}
                    </span>
                  </SummaryRow>
                )}
                <SummaryRow label="Destinazione" value={url} mono />
                <div className="border-t border-surface-200 pt-3 mt-3">
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2">Parametri UTM</p>
                  <div className="grid grid-cols-2 gap-2">
                    <MiniParam label="source" value={selectedChannel?.utm_source} />
                    <MiniParam label="medium" value={currentMedium} />
                    <MiniParam label="campaign" value={campaignName} />
                    {utmContent && <MiniParam label="content" value={utmContent} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Navigation ──────────────────────────────── */}
      <div className="flex items-center justify-between mt-6 animate-fade-in">
        <button onClick={() => step > 1 && goBack()}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-colors ${
            step > 1 ? 'text-surface-600 hover:bg-surface-100' : 'text-surface-300 cursor-not-allowed'
          }`} disabled={step <= 1}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Indietro
        </button>

        {step < 5 ? (
          <button onClick={() => canProceed() && goToStep(step + 1)} disabled={!canProceed()}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all ${
              canProceed()
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200'
                : 'bg-surface-200 text-surface-400 cursor-not-allowed'
            }`}>
            Continua
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        ) : (
          <button onClick={handleCreate} disabled={loading || !campaignName}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50">
            {loading ? 'Creazione in corso...' : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                Crea Link
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, mono, children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-surface-400">{label}</span>
      {children || (
        <span className={`text-sm text-surface-800 ${mono ? 'font-mono text-xs truncate max-w-[300px]' : 'font-medium'}`}>{value}</span>
      )}
    </div>
  );
}

function MiniParam({ label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-mono text-surface-400">{label}:</span>
      <span className="text-[11px] font-mono font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">{value}</span>
    </div>
  );
}
