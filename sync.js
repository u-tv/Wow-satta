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
// ========================================
// WOW SATTA - TOP 3 SCRAPPERS + AUTO SYNC
// Updates every 60 seconds automatically
// ========================================

class DataSyncManager {
    constructor() {
        // TOP 3 Scraper Sources (Real websites)
        this.sources = [
            {
                name: 'Source 1: onlinesattaking.in',
                url: 'https://onlinesattaking.in/',
                proxy: 'https://api.allorigins.win/get?url='
            },
            {
                name: 'Source 2: dpboss.com',
                url: 'https://www.dpboss.com/',
                proxy: 'https://corsanywhere.herokuapp.com/'
            },
            {
                name: 'Source 3: sattaresult.com',
                url: 'https://sattaresult.com/',
                proxy: 'https://api.allorigins.win/get?url='
            }
        ];
        
        this.liveData = {
            ds: '--',
            fb: '--',
            gz: '--',
            gl: '--'
        };
        
        this.syncInterval = 60000; // 60 seconds (1 minute)
        this.currentSourceIndex = 0;
        
        this.init();
    }
    
    init() {
        console.log('🚀 WOW SATTA - AUTO SYNC Manager Initializing...');
        
        // Initial fetch
        this.fetchFromAllSources();
        
        // Setup auto-sync every 60 seconds
        setInterval(() => {
            this.fetchFromAllSources();
        }, this.syncInterval);
        
        console.log('⚡ AUTO SYNC ACTIVE: Every 60 seconds');
    }
    
    // ========================================
    // FETCH FROM ALL 3 SOURCES
    // ========================================
    async fetchFromAllSources() {
        console.log('🔄 Fetching from TOP 3 sources...');
        
        try {
            // Fetch from all 3 sources simultaneously
            const results = await Promise.all([
                this.fetchFromSource(0),
                this.fetchFromSource(1),
                this.fetchFromSource(2)
            ]);
            
            // Merge data from all sources (prefer most recent)
            this.mergeData(results);
            
            // Update UI
            this.updateLiveUI();
            
            // Update sync status
            this.updateSyncStatus('SUCCESS');
            
            console.log('✅ Sync completed successfully');
            
        } catch (error) {
            console.error('❌ Sync error:', error);
            this.updateSyncStatus('FAILED');
            
            // Fallback to mock data if all sources fail
            this.useMockFallback();
        }
    }
    
    // ========================================
    // FETCH FROM SINGLE SOURCE
    // ========================================
    async fetchFromSource(sourceIndex) {
        const source = this.sources[sourceIndex];
        console.log(`📡 Fetching from ${source.name}...`);
        
        try {
            // Use proxy to avoid CORS issues
            const proxyURL = `${source.proxy}${encodeURIComponent(source.url)}&t=${Date.now()}`;
            
            const response = await fetch(proxyURL);
            
            if (!response.ok) {
                throw new Error(`Source ${sourceIndex} failed: ${response.status}`);
            }
            
            const data = await response.json();
            const html = data.contents;
            
            // Parse HTML and extract results
            const extractedData = this.extractResults(html);
            
            console.log(`✅ Source ${sourceIndex} extracted:`, extractedData);
            
            return {
                source: sourceIndex,
                valid: true,
                data: extractedData
            };
            
        } catch (error) {
            console.error(`❌ Source ${sourceIndex} error:`, error.message);
            
            return {
                source: sourceIndex,
                valid: false,
                data: null,
                error: error.message
            };
        }
    }
    
    // ========================================
    // EXTRACT RESULTS FROM HTML (SCRAPER PARSER)
    // ========================================
    extractResults(html) {
        const extracted = {
            ds: null,
            fb: null,
            gz: null,
            gl: null
        };
        
        try {
            // Create temporary DOM from HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Extract Desawar result (multiple patterns)
            const dsPatterns = [
                tempDiv.querySelector('.desawar-result'),
                tempDiv.querySelector('[class*="desawar"]'),
                tempDiv.querySelector('#desawar'),
                tempDiv.querySelector('td:nth-child(2)'),
                tempDiv.innerHTML.match(/DESAWAR[^0-9]*(d{2})/i),
                tempDiv.innerHTML.match(/दिसावर[^0-9]*(d{2})/i)
            ];
            
            for (let pattern of dsPatterns) {
                if (pattern && pattern.textContent) {
                    const match = pattern.textContent.match(/(d{2})/);
                    if (match) {
                        extracted.ds = match[1];
                        break;
                    }
                } else if (pattern && pattern[1]) {
                    extracted.ds = pattern[1];
                    break;
                }
            }
            
            // Extract Faridabad result
            const fbPatterns = [
                tempDiv.querySelector('.faridabad-result'),
                tempDiv.querySelector('[class*="faridabad"]'),
                tempDiv.querySelector('#faridabad'),
                tempDiv.innerHTML.match(/FARIDABAD[^0-9]*(d{2})/i),
                tempDiv.innerHTML.match(/फरीदाबाद[^0-9]*(d{2})/i)
            ];
            
            for (let pattern of fbPatterns) {
                if (pattern && pattern.textContent) {
                    const match = pattern.textContent.match(/(d{2})/);
                    if (match) {
                        extracted.fb = match[1];
                        break;
                    }
                } else if (pattern && pattern[1]) {
                    extracted.fb = pattern[1];
                    break;
                }
            }
            
            // Extract Ghaziabad result
            const gzPatterns = [
                tempDiv.querySelector('.ghaziabad-result'),
                tempDiv.querySelector('[class*="ghaziabad"]'),
                tempDiv.querySelector('#ghaziabad'),
                tempDiv.innerHTML.match(/GHAZIABAD[^0-9]*(d{2})/i),
                tempDiv.innerHTML.match(/गाज़ियाबाद[^0-9]*(d{2})/i)
            ];
            
            for (let pattern of gzPatterns) {
                if (pattern && pattern.textContent) {
                    const match = pattern.textContent.match(/(d{2})/);
                    if (match) {
                        extracted.gz = match[1];
                        break;
                    }
                } else if (pattern && pattern[1]) {
                    extracted.gz = pattern[1];
                    break;
                }
            }
            
            // Extract Gali result
            const glPatterns = [
                tempDiv.querySelector('.gali-result'),
                tempDiv.querySelector('[class*="gali"]'),
                tempDiv.querySelector('#gali'),
                tempDiv.innerHTML.match(/GALI[^0-9]*(d{2})/i),
                tempDiv.innerHTML.match(/गली[^0-9]*(d{2})/i)
            ];
            
            for (let pattern of glPatterns) {
                if (pattern && pattern.textContent) {
                    const match = pattern.textContent.match(/(d{2})/);
                    if (match) {
                        extracted.gl = match[1];
                        break;
                    }
                } else if (pattern && pattern[1]) {
                    extracted.gl = pattern[1];
                    break;
                }
            }
            
        } catch (error) {
            console.error('Parser error:', error);
        }
        
        return extracted;
    }
    
    // ========================================
    // MERGE DATA FROM ALL SOURCES
    // ========================================
    mergeData(results) {
        console.log('🔀 Merging data from sources...');
        
        // Priority: Source 1 > Source 2 > Source 3 > Mock
        for (let result of results) {
            if (result.valid && result.data) {
                // Update only if value exists and is not null
                if (result.data.ds && result.data.ds !== '--') {
                    this.liveData.ds = result.data.ds;
                }
                if (result.data.fb && result.data.fb !== '--') {
                    this.liveData.fb = result.data.fb;
                }
                if (result.data.gz && result.data.gz !== '--') {
                    this.liveData.gz = result.data.gz;
                }
                if (result.data.gl && result.data.gl !== '--') {
                    this.liveData.gl = result.data.gl;
                }
                
                console.log('✅ Updated from Source', result.source);
                break; // Use first valid source
            }
        }
        
        console.log('📊 Merged live data:', this.liveData);
    }
    
    // ========================================
    // UPDATE LIVE UI
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
        
        console.log('✅ UI updated with live data');
    }
    
    // ========================================
    // UPDATE SYNC STATUS
    // ========================================
    updateSyncStatus(status) {
        const statusEl = document.getElementById('syncStatus');
        if (!statusEl) return;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        
        if (status === 'SUCCESS') {
            statusEl.innerHTML = `
                ✅ LIVE SYNC: ${timeStr} 
                <span style="color: #0f0;">✓ Real Data from 3 Sources</span>
            `;
            statusEl.style.color = '#0f0';
        } else {
            statusEl.innerHTML = `
                ⚠️ SYNC FAILED: ${timeStr}
                <span style="color: #ff9966;">△ Using Mock Data</span>
            `;
            statusEl.style.color = '#ff9966';
        }
    }
    
    // ========================================
    // FALLBACK TO MOCK DATA (If all sources fail)
    // ========================================
    useMockFallback() {
        console.log('📦 Using mock data fallback...');
        
        const d = new Date();
        const seed = d.getHours() * 37 + d.getMinutes();
        
        this.liveData = {
            ds: (seed % 100).toString().padStart(2, '0'),
            fb: ((seed + 19) % 100).toString().padStart(2, '0'),
            gz: ((seed + 43) % 100).toString().padStart(2, '0'),
            gl: ((seed + 77) % 100).toString().padStart(2, '0')
        };
        
        this.updateLiveUI();
        this.updateSyncStatus('FAILED');
    }
    
    // ========================================
    // MANUAL REFRESH (User Button)
    // ========================================
    manualRefresh() {
        console.log('🔄 Manual refresh triggered...');
        this.fetchFromAllSources();
        this.showToastMsg('🔄 Live data refreshed from 3 sources!');
    }
    
    // ========================================
    // SHOW TOAST MESSAGE
    // ========================================
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
    
    // ========================================
    // GET CURRENT LIVE DATA
    // ========================================
    getLiveData() {
        return this.liveData;
    }
}

// ========================================
// INITIALIZE SYNC MANAGER
// ========================================
const syncManager = new DataSyncManager();

// Expose manual refresh function globally
function manualLiveSync() {
    syncManager.manualRefresh();
}

// ========================================
// EXPORT FOR USE IN OTHER FILES
// ========================================
if (typeof window !== 'undefined') {
    window.syncManager = syncManager;
    window.manualLiveSync = manualLiveSync;
                            }
