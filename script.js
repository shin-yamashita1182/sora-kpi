
document.getElementById("zipSearchBtn").addEventListener("click", completeRegionFromZip);

async function completeRegionFromZip() {
    const zip = document.getElementById("zipInput").value;
    try {
        const response = await fetch("zipcode.json");
        const data = await response.json();
        const region = data[zip];

        if (region) {
            document.getElementById("regionInput").value = region;
            updateMap(region);
        } else {
            alert("該当する地域が見つかりません");
        }
    } catch (error) {
        console.error("郵便番号検索中にエラーが発生しました:", error);
    }
}

function updateMap(regionName) {
    if (window.map && window.map.remove) {
        window.map.remove();  // 既存マップ削除
    }

    window.map = L.map("map").setView([31.9333, 131.0667], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(window.map);
    L.marker([31.9333, 131.0667]).addTo(window.map)
        .bindPopup(regionName)
        .openPopup();
}
