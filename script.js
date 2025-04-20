
function completeRegionFromZip() {
  const zip = document.getElementById("zipcode").value;
  fetch("zipcode.json")
    .then((response) => response.json())
    .then((data) => {
      const region = data[zip];
      if (region) {
        document.getElementById("region").value = region;
        updateMap(region);
      } else {
        alert("該当する地域が見つかりません");
      }
    });
}

// 地図初期化関数（重複初期化防止）
function updateMap(regionName) {
  const coordinates = {
    "8894412": [31.9077, 131.3889], // 高原町の中心（例）
    // 他の地域を追加可能
  };

  const zip = document.getElementById("zipcode").value;
  const center = coordinates[zip] || [35.681236, 139.767125]; // デフォルト：東京駅

  if (window.myMap) {
    window.myMap.remove(); // 既存マップをクリア
  }
  window.myMap = L.map("map").setView(center, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(window.myMap);

  L.marker(center).addTo(window.myMap).bindPopup(regionName).openPopup();
}
