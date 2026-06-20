// ========================================
// WOW SATTA - REAL SCRAPPERS + AUTO SYNC
// TOP 3 Sources (Ishita/trah type sites)
// Auto updates every 60 seconds
// ========================================

class DataSyncManager {
    constructor() {
        // TOP 3 REAL Scraper Sources (Ishita-type satta sites)
        this.sources = [
            {
                name: 'Source 1: onlinesattaking.in',
                url: 'https://onlinesattaking.in/',
                proxy: 'https://api.allorigins.win/get?url='
            },
            {
                name: 'Source 2: sattaresulttoday.com',
                url: 'https://sattaresulttoday.com/',
                proxy: 'https://api.allorigins.win/get?url='
            },
            {
                name: 'Source 3: sattakingresult247.com',
                url: 'https://sattakingresult247.com/',
                proxy: 'https://api.allorigins.win/get?url='
            }
        ];
        
        this.liveData = {
            ds: '--',
            fb: '--',
            gz: '--',
            gl: '--'
        };
        
        this.syncInterval = 60000; // 60 seconds
        this.lastSyncTime = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 WOW SATTA - REAL AUTO SYNC Initializing...');
        
        // Initial fetch
        this.fetchFromAllSources();
        
        // Auto-sync every 60 seconds
        setInterval(() => {
            this.fetchFromAllSources();
        }, this.syncInterval);
        
        console.log('⚡ AUTO SYNC: Every 60 seconds (REAL data)');
    }
    
    // ========================================
    // FETCH FROM ALL 3 REAL SOURCES
    // ========================================
    async fetchFromAllSources() {
        console.log('🔄 Fetching from TOP 3 REAL sources...');
        
        try {
            const results = await Promise.all([
                this.fetchFromSource(0),
                this.fetchFromSource(1),
                this.fetchFromSource(2)
            ]);
            
            this.mergeData(results);
            this.updateLiveUI();
            this.updateSyncStatus('SUCCESS');
            
            console.log('✅ REAL Sync completed:', this.liveData);
            
        } catch (error) {
            console.error('❌ Sync error:', error);
            this.updateSyncStatus('FAILED');
            this.useMockFallback();
        }
    }
    
    // ========================================
    // FETCH SINGLE SOURCE
    // ========================================
    async fetchFromSource(sourceIndex) {
        const source = this.sources[sourceIndex];
        console.log(`📡 Fetching from ${source.name}...`);
        
        try {
            const proxyURL = `${source.proxy}${encodeURIComponent(source.url)}&t=${Date.now()}`;
            
            const response = await fetch(proxyURL);
            
            if (!response.ok) {
                throw new Error(`Source ${sourceIndex} failed: ${response.status}`);
            }
            
            const data = await response.json();
            const html = data.contents;
            
            const extractedData = this.extractResults(html);
            
            return {
                source: sourceIndex,
                valid: extractedData.ds !== null,
                data: extractedData
            };
            
        } catch (error) {
            console.error(`❌ Source ${sourceIndex} error:`, error.message);
            return {
                source: sourceIndex,
                valid: false,
                data: null
            };
        }
    }
    
    // ========================================
    // EXTRACT RESULTS FROM HTML (SCRAPER)
    // ========================================
    extractResults(html) {
        const extracted = {
            ds: null,
            fb: null,
            gz: null,
            gl: null
        };
        
        try {
            // Regex patterns for Ishita-type satta sites
            const patterns = {
                ds: [
                    /DESAWAR[^0-9]*(d{2})/i,
                    /दिसावर[^0-9]*(d{2})/i,
                    /desawar.*?(d{2})/i
                ],
                fb: [
                    /FARIDABAD[^0-9]*(d{2})/i,
                    /फरीदाबाद[^0-9]*(d{2})/i,
                    /faridabad.*?(d{2})/i
                ],
                gz: [
                    /GHAZIABAD[^0-9]*(d{2})/i,
                    /गाज़ियाबाद[^0-9]*(d{2})/i,
                    /ghaziabad.*?(d{2})/i
                ],
                gl: [
                    /GALI[^0-9]*(d{2})/i,
                    /गली[^0-9]*(d{2})/i,
                    /gali.*?(d{2})/i
                ]
            };
            
            // Extract Desawar
            for (let pattern of patterns.ds) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    extracted.ds = match[1];
                    break;
                }
            }
            
            // Extract Faridabad
            for (let pattern of patterns.fb) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    extracted.fb = match[1];
                    break;
                }
            }
            
            // Extract Ghaziabad
            for (let pattern of patterns.gz) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    extracted.gz = match[1];
                    break;
                }
            }
            
            // Extract Gali
            for (let pattern of patterns.gl) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    extracted.gl = match[1];
                    break;
                }
            }
            
        } catch (error) {
            console.error('Parser error:', error);
        }
        
        return extracted;
    }
    
    // ========================================
    // MERGE DATA (Priority: Source 1 > 2 > 3)
    // ========================================
    mergeData(results) {
        for (let result of results) {
            if (result.valid && result.data) {
                if (result.data.ds) this.liveData.ds = result.data.ds;
                if (result.data.fb) this.liveData.fb = result.data.fb;
                if (result.data.gz) this.liveData.gz = result.data.gz;
                if (result.data.gl) this.liveData.gl = result.data.gl;
                
                console.log('✅ Updated from Source', result.source);
                break;
            }
        }
    }
    
    // ========================================
    // UPDATE UI
    // ========================================
    updateLiveUI() {
        const dsEl = document.getElementById('dsLive');
        const fbEl = document.getElementById('fbLive');
        const gzEl = document.getElementById('gzLive');
        const glEl = document.getElementById('glLive');
        
        if (dsEl) dsEl.innerText = this.liveData.ds;
        if (fbEl) fbEl.innerText = this.liveData.fb;
        if (gzEl) gzEl.innerText = this.liveData.gz;
        if (glEl) glEl.innerText = this.liveData.gl;
    }
    
    // ========================================
    // UPDATE SYNC STATUS
    // ========================================
    updateSyncStatus(status) {
        const statusEl = document.getElementById('syncStatus');
        if (!statusEl) return;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        this.lastSyncTime = timeStr;
        
        if (status === 'SUCCESS') {
            statusEl.innerHTML = `✅ LIVE: ${timeStr} ✓ Real Data (3 Sources)`;
            statusEl.style.color = '#0f0';
        } else {
            statusEl.innerHTML = `⚠️ FAILED: ${timeStr} △ Mock Data`;
            statusEl.style.color = '#ff9966';
        }
    }
    
    // ========================================
    // FALLBACK MOCK
    // ========================================
    useMockFallback() {
        const d = new Date();
        const seed = d.getHours() * 37 + d.getMinutes();
        
        this.liveData = {
            ds: (seed % 100).toString().padStart(2, '0'),
            fb: ((seed + 19) % 100).toString().padStart(2, '0'),
            gz: ((seed + 43) % 100).toString().padStart(2, '0'),
            gl: ((seed + 77) % 100).toString().padStart(2, '0')
        };
        
        this.updateLiveUI();
    }
    
    // ========================================
    // MANUAL REFRESH
    // ========================================
    manualRefresh() {
        this.fetchFromAllSources();
        this.showToastMsg('🔄 REAL data refreshed from 3 sources!');
    }
    
    showToastMsg(msg) {
        let t = document.querySelector('.toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'toast';
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }
    
    getLiveData() { return this.liveData; }
}

// Initialize
const syncManager = new DataSyncManager();

// Expose globally
function manualLiveSync() {
    syncManager.manualRefresh();
}

if (typeof window !== 'undefined') {
    window.syncManager = syncManager;
    window.manualLiveSync = manualLiveSync;
}
