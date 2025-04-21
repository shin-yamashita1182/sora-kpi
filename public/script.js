
let map = null;
let markers = [];

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded (Final Cleanup)");

  const chatArea = document.getElementById("chat-area");
  const inputField = document.getElementById("gpt-input");
  const sendButton = document.getElementById("send-button");
  const regionCard = document.getElementById("region-card");
  const mapContainer = document.querySelector(".bg-white .h-48");

  if (!chatArea || !inputField || !sendButton || !regionCard || !mapContainer) {
    console.warn("⚠️ 必要な要素が1つ以上見つかりません");
    return;
  }

  const regionData = {
    "島原市": {
      reply: "島原市は長崎県の南東部に位置し、雲仙岳の山麓に広がる自然豊かな地域です。",
      coord: [32.778, 130.371],
      infra: "最寄りIC：諫早IC／最寄りSA：金立SA、山浦PA"
    },
    "長崎市": {
      reply: "長崎市は九州西端に位置し、江戸時代の開国の舞台として知られています。",
      coord: [32.7503, 129.8777],
      infra: "最寄りIC：長崎IC／最寄りPA：今村PA"
    },
    "小城市": {
      reply: "小城市は佐賀県の中央部に位置し、羊羹の名産地として知られています。",
      coord: [33.2643, 130.1947],
      infra: "最寄りIC：佐賀大和IC／最寄りPA：小城PA"
    }
  };

  sendButton.addEventListener("click", () => {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    const areaName = Object.keys(regionData).find(name => userInput.includes(name));
    const data = regionData[areaName];

    const userMessage = document.createElement("p");
    userMessage.className = "text-sm text-blue-700";
    userMessage.textContent = `👤 あなた: ${userInput}`;
    chatArea.appendChild(userMessage);

    const reply = document.createElement("p");
    reply.className = "text-sm text-gray-700";
    reply.textContent = data ? `SORA: ${data.reply}` : "SORA: その地域についての情報が見つかりませんでした。";
    chatArea.appendChild(reply);

    // 地図と地域カードを完全リセット
    if (map !== null) {
      map.remove();
      map = null;
      markers = [];
    }
    mapContainer.innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    regionCard.value = ""; // ← 地域情報カードをクリア

    if (data) {
      regionCard.value = `${data.reply}\n${data.infra}`;
      map = L.map("map").setView(data.coord, 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker(data.coord).addTo(map).bindPopup(`${areaName}`).openPopup();
      markers.push(marker);
    }

    inputField.value = "";
  });
});
