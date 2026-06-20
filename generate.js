// In generate.js, replace generateMockLiveData() with:

generateMockLiveData() {
    // Check if syncManager exists (real data)
    if (typeof syncManager !== 'undefined') {
        const liveData = syncManager.getLiveData();
        
        document.getElementById('dsLive').innerText = liveData.ds;
        document.getElementById('fbLive').innerText = liveData.fb;
        document.getElementById('gzLive').innerText = liveData.gz;
        document.getElementById('glLive').innerText = liveData.gl;
        
        console.log('✅ Using REAL live data from sync');
    } else {
        // Fallback to mock data
        const d = new Date();
        const seed = d.getHours() * 37 + d.getMinutes();
        
        const mockData = {
            ds: (seed % 100).toString().padStart(2, '0'),
            fb: ((seed + 19) % 100).toString().padStart(2, '0'),
            gz: ((seed + 43) % 100).toString().padStart(2, '0'),
            gl: ((seed + 77) % 100).toString().padStart(2, '0')
        };
        
        document.getElementById('dsLive').innerText = mockData.ds;
        document.getElementById('fbLive').innerText = mockData.fb;
        document.getElementById('gzLive').innerText = mockData.gz;
        document.getElementById('glLive').innerText = mockData.gl;
    }
}
