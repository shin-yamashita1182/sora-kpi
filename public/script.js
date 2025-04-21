
// DOM読み込み後に初期化
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded (Final SA Update)");

  const chatArea = document.getElementById("chat-area");
  const inputField = document.getElementById("gpt-input");
  const sendButton = document.getElementById("send-button");
  const regionCard = document.getElementById("region-card");
  const mapContainer = document.querySelector(".bg-white .h-48");

  if (!chatArea || !inputField || !sendButton || !regionCard || !mapContainer) {
    console.warn("⚠️ 必要な要素が1つ以上見つかりません");
    return;
  }

  // 地図初期化
  mapContainer.innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
  const map = L.map("map").setView([33.25, 130.3], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const regionData = {
    "島原市": {
      reply: "島原市は長崎県の南東部に位置し、雲仙岳の山麓に広がる自然豊かな地域です。古くから温泉地として栄え、島原城や武家屋敷跡といった歴史的資産も多く残されています。観光と農業を主要産業とする一方で、近年は少子高齢化の進行や若年層の流出が大きな課題となっています。",
      coord: [32.778, 130.371],
      infra: "最寄りIC：諫早IC（長崎自動車道）／最寄りSA：金立サービスエリア（上下線）"
    },
    "長崎市": {
      reply: "長崎市は九州西端に位置し、江戸時代の開国の舞台として出島やグラバー園など異国情緒あふれる観光地が多く存在します。平和公園や原爆資料館など世界的に重要な歴史的施設もあり、年間を通じて国内外から多くの観光客が訪れます。しかし中心部の空洞化や人口減少といった都市構造の課題も顕在化しています。",
      coord: [32.7503, 129.8777],
      infra: "最寄りIC：長崎IC（長崎自動車道）／最寄りPA：今村パーキングエリア（下り線、長崎市中心部から約20分、基本設備あり）"
    },
    "小城市": {
      reply: "小城市は佐賀県の中央部に位置し、羊羹の名産地として知られる風情ある地域です。緑豊かな環境のもとで農業や食品加工業が営まれており、地域ブランドの確立にも取り組んでいます。一方で、若年層の都市部流出や地場産業の継承問題といった構造的な課題も抱えています。",
      coord: [33.2643, 130.1947],
      infra: "最寄りIC：佐賀大和IC（長崎自動車道）／最寄りPA：小城パーキングエリア（上下線、スマートIC併設、基本設備完備）"
    }
  };

  sendButton.addEventListener("click", () => {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    const areaName = Object.keys(regionData).find(name => userInput.includes(name));
    const data = regionData[areaName];

    // ユーザー入力表示
    const userMessage = document.createElement("p");
    userMessage.className = "text-sm text-blue-700";
    userMessage.textContent = `👤 あなた: ${userInput}`;
    chatArea.appendChild(userMessage);

    // GPT風応答
    const reply = document.createElement("p");
    reply.className = "text-sm text-gray-700";
    reply.textContent = data ? `SORA: ${data.reply}` : "SORA: その地域についての情報が見つかりませんでした。";
    chatArea.appendChild(reply);

    // 地域カードと地図
    if (data) {
      regionCard.value = `${data.reply}\n${data.infra}`;
      map.setView(data.coord, 12);
      L.marker(data.coord).addTo(map).bindPopup(`${areaName}（Mock表示）`).openPopup();
    }

    inputField.value = "";
  });

  // ボタン調整
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    if (btn.textContent.includes("PDF") || btn.textContent.includes("ログ")) {
      btn.classList.remove("px-4");
      btn.classList.add("px-3", "text-sm");
    }
  });
});
