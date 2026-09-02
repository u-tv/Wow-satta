// ============================================
// WOW SATTA — ENTERPRISE CLOUDFLARE WORKER
// 20-Source Cascading Failover | Real-Time Sync
// Version: 3.0.0 | Build: Enterprise
// ============================================

const SOURCES = [
  { name: 'SattaKingOrg',      url: 'https://sattaking.org',              type: 'html' },
  { name: 'SattaKingFast',     url: 'https://satta-king-fast.com',        type: 'html' },
  { name: 'SattaKingResult',   url: 'https://sattakingresult.in',         type: 'html' },
  { name: 'SattaKingDaily',    url: 'https://sattakingdaily.com',         type: 'html' },
  { name: 'SattaMatka',        url: 'https://sattamatka.com',             type: 'html' },
  { name: 'SattaKingBaba',     url: 'https://sattakingbaba.com',          type: 'html' },
  { name: 'SattaKing786',      url: 'https://sattaking786.in',            type: 'html' },
  { name: 'SattaKingGali',     url: 'https://sattaking-gali.com',         type: 'html' },
  { name: 'SattaKingDesawar',  url: 'https://sattaking-desawar.com',      type: 'html' },
  { name: 'SattaKingChart',    url: 'https://sattakingchart.com',         type: 'html' },
  { name: 'SattaKingLive',     url: 'https://sattakinglive.in',           type: 'html' },
  { name: 'SattaKingToday',    url: 'https://sattakingtoday.in',          type: 'html' },
  { name: 'SattaKing2026',     url: 'https://sattaking2026.com',          type: 'html' },
  { name: 'SattaKingUp',       url: 'https://sattakingup.com',            type: 'html' },
  { name: 'SattaKingDelhi',    url: 'https://sattakingdelhi.com',         type: 'html' },
  { name: 'SattaKingPro',      url: 'https://sattakingpro.com',           type: 'html' },
  { name: 'SattaKingVIP',      url: 'https://sattakingvip.com',           type: 'html' },
  { name: 'SattaKingMobi',     url: 'https://sattaking.mobi',             type: 'html' },
  { name: 'SattaKingOnline',   url: 'https://sattakingonline.in',         type: 'html' },
  { name: 'SattaKingApp',      url: 'https://sattakingapp.com',           type: 'html' },
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function parseGeneric(html) {
  const results = {};
  const patterns = [
    { key: 'ds', regexes: [/desawar[^0-9]{0,30}(\d{2})/i, /deshawar[^0-9]{0,30}(\d{2})/i, /ds[^0-9]{0,20}(\d{2})/i] },
    { key: 'fb', regexes: [/faridabad[^0-9]{0,30}(\d{2})/i, /fb[^0-9]{0,20}(\d{2})/i, /fbd[^0-9]{0,20}(\d{2})/i] },
    { key: 'gz', regexes: [/ghaziabad[^0-9]{0,30}(\d{2})/i, /gz[^0-9]{0,20}(\d{2})/i, /gbd[^0-9]{0,20}(\d{2})/i] },
    { key: 'gl', regexes: [/gali[^0-9]{0,30}(\d{2})/i, /gl[^0-9]{0,20}(\d{2})/i] }
  ];
  patterns.forEach(p => {
    for (const rx of p.regexes) {
      const m = html.match(rx);
      if (m && m[1]) {
        const num = parseInt(m[1]);
        if (num >= 0 && num <= 99) { results[p.key] = m[1].padStart(2, '0'); break; }
      }
    }
  });
  return results;
}

async function fetchWithFailover() {
  let lastError = null;
  for (const source of SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(source.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const html = await res.text();
      const data = parseGeneric(html);
      if (Object.keys(data).length >= 2) {
        return { success: true, source: source.name, data, count: Object.keys(data).length };
      }
    } catch (e) { lastError = e.message; continue; }
  }
  return { success: false, error: lastError || 'All 20 sources failed' };
}

async function getStoredResults(env) {
  try { const stored = await env.WOWSATTA_KV.get('live_results'); if (stored) return JSON.parse(stored); } catch (e) {}
  return null;
}

async function storeResults(env, results) {
  try { await env.WOWSATTA_KV.put('live_results', JSON.stringify(results), { expirationTtl: 86400 }); } catch (e) {}
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    if (path === '/api/live') {
      const fresh = await fetchWithFailover();
      if (fresh.success) {
        const payload = { success: true, timestamp: new Date().toISOString(), source: fresh.source, sourceIndex: SOURCES.findIndex(s => s.name === fresh.source) + 1, totalSources: SOURCES.length, data: fresh.data, cached: false };
        await storeResults(env, payload);
        return new Response(JSON.stringify(payload), { headers: corsHeaders });
      }
      const cached = await getStoredResults(env);
      if (cached) { cached.cached = true; cached.freshError = fresh.error; return new Response(JSON.stringify(cached), { headers: corsHeaders }); }
      return new Response(JSON.stringify({ success: false, error: fresh.error, message: 'All 20 sources failed. No cached data.' }), { headers: corsHeaders, status: 503 });
    }

    if (path === '/api/history') {
      const year = url.searchParams.get('year') || '2026';
      const market = url.searchParams.get('market') || 'all';
      const history = await env.WOWSATTA_KV.get('history_' + year + '_' + market);
      if (history) return new Response(history, { headers: corsHeaders });
      return new Response(JSON.stringify({ success: true, year, market, data: [], message: 'Historical data not yet populated' }), { headers: corsHeaders });
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', worker: 'WOW SATTA Enterprise', version: '3.0.0', sources: SOURCES.length, timestamp: new Date().toISOString() }), { headers: corsHeaders });
    }

    if (path === '/api/sources') {
      return new Response(JSON.stringify({ success: true, sources: SOURCES.map((s, i) => ({ id: i+1, name: s.name, url: s.url, active: true })) }), { headers: corsHeaders });
    }

    return new Response(HTML_CONTENT, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};
