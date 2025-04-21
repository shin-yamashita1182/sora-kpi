
// DOM読み込み後に初期化
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded (SA/PA ピン付き)");

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

  // 地域データとSA/PA情報
  const regionData = {
    "島原市": {
      reply: "島原市は長崎県の南東部に位置し、雲仙岳の山麓に広がる自然豊かな地域です。古くから温泉地として栄え、島原城や武家屋敷跡といった歴史的資産も多く残されています。観光と農業を主要産業とする一方で、近年は少子高齢化の進行や若年層の流出が大きな課題となっています。",
      coord: [32.778, 130.371],
      infra: "最寄りIC：諫早IC（長崎自動車道）／最寄りSA：金立SA、山浦PA",
      sapa: [
        {
          name: "金立サービスエリア（上下線）",
          coord: [33.3408, 130.3226],
          desc: "レストラン、売店、トイレ、EV充電スタンドあり（佐賀県佐賀市）"
        },
        {
          name: "山浦パーキングエリア（上り線）",
          coord: [33.1114, 129.9837],
          desc: "トイレ、自動販売機、休憩所完備（嬉野市）"
        }
      ]
    },
    "長崎市": {
      reply: "長崎市は九州西端に位置し、江戸時代の開国の舞台として出島やグラバー園など異国情緒あふれる観光地が多く存在します。平和公園や原爆資料館など世界的に重要な歴史的施設もあり、年間を通じて国内外から多くの観光客が訪れます。しかし中心部の空洞化や人口減少といった都市構造の課題も顕在化しています。",
      coord: [32.7503, 129.8777],
      infra: "最寄りIC：長崎IC／最寄りPA：今村PA（長崎市中心部から約20分）",
      sapa: [
        {
          name: "今村パーキングエリア（下り線）",
          coord: [32.8947, 129.9420],
          desc: "トイレ、自販機、基本設備完備（長崎道・長与町）"
        }
      ]
    },
    "小城市": {
      reply: "小城市は佐賀県の中央部に位置し、羊羹の名産地として知られる風情ある地域です。緑豊かな環境のもとで農業や食品加工業が営まれており、地域ブランドの確立にも取り組んでいます。一方で、若年層の都市部流出や地場産業の継承問題といった構造的な課題も抱えています。",
      coord: [33.2643, 130.1947],
      infra: "最寄りIC：佐賀大和IC／最寄りPA：小城PA（スマートIC併設）",
      sapa: [
        {
          name: "小城パーキングエリア（上下線）",
          coord: [33.2758, 130.2146],
          desc: "スマートIC併設、トイレ・休憩施設完備（長崎道）"
        }
      ]
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

    if (data) {
      regionCard.value = `${data.reply}\n${data.infra}`;
      map.setView(data.coord, 11);
      L.marker(data.coord).addTo(map).bindPopup(`${areaName}（Mock表示）`).openPopup();

      // SA/PAピン表示
      if (data.sapa) {
        data.sapa.forEach(s => {
          L.marker(s.coord, { icon: L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" }) })
            .addTo(map)
            .bindPopup(`${s.name}<br>${s.desc}`);
        });
      }
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
