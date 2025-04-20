
// 郵便番号から地域情報を補完
async function completeRegionFromZip() {
    const zip = document.getElementById('zipcode');
    const region = document.getElementById('region');

    if (!zip || !region) {
        console.error('要素が見つかりません（zipcode または region）');
        return;
    }

    const zipValue = zip.value.trim();
    if (!zipValue) {
        alert('郵便番号を入力してください');
        return;
    }

    try {
        const response = await fetch('zipcode.json');
        const zipData = await response.json();

        if (zipData[zipValue]) {
            region.value = zipData[zipValue];
        } else {
            alert('該当する地域が見つかりません');
        }
    } catch (error) {
        console.error('郵便番号補完エラー:', error);
        alert('郵便番号データの読み込みに失敗しました');
    }
}

// 地図初期化（高原町をデフォルト表示）
function initializeMap() {
    if (document.getElementById('map') === null) return;

    const map = L.map('map').setView([31.9333, 131.0667], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([31.9333, 131.0667]).addTo(map)
        .bindPopup('宮崎県西諸県郡高原町')
        .openPopup();
}

window.onload = () => {
    initializeMap();
};
