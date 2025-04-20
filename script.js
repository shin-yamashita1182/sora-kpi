
let map;

async function completeRegionFromZip() {
    const zip = document.getElementById('zip').value;
    try {
        const response = await fetch('/zipcode.json');
        if (!response.ok) throw new Error('zipcode.json fetch failed');
        const data = await response.json();

        const matched = data.find(item => item.zipcode === zip);
        if (!matched) {
            alert('該当する地域が見つかりません');
            return;
        }

        document.getElementById('region').value = matched.region;

        updateMap(matched.lat, matched.lng, matched.region);
    } catch (error) {
        console.error('Error in completeRegionFromZip:', error);
        alert('データ取得に失敗しました');
    }
}

function updateMap(lat, lng, regionName) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Remove existing map if initialized
    if (map !== undefined) {
        map.remove();
    }

    map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup(regionName).openPopup();
}
