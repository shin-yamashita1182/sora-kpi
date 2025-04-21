
let map = null;
let markers = [];

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded");

  const chatArea = document.getElementById("chat-area");
  const inputField = document.getElementById("gpt-input");
  const sendButton = document.getElementById("send-button");
  const regionCard = document.getElementById("region-card");
  const mapContainer = document.querySelector(".bg-white .h-48");

  // ユーザーモックのドロップダウン開閉
  const userIcon = document.getElementById("user-icon");
  const dropdown = document.getElementById("user-dropdown");
  if (userIcon && dropdown) {
    userIcon.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });
  }

  const regionData = {
    "島原市": {
      reply: `島原市は長崎県南東部に位置し、雲仙岳の山麓に広がる自然と温泉の宝庫です。島原城や武家屋敷跡といった歴史遺産が多く残されており、観光資源としてのポテンシャルが非常に高い地域です。農業も盛んで、特に野菜や果物の生産が地域経済を支えています。一方で、少子高齢化や地域内交通の課題が顕在化しており、若年層の定住促進や二次交通整備が求められています。`,
      coord: [32.778, 130.371],
      infra: "最寄りIC：諫早IC／最寄りSA：金立SA、山浦PA"
    },
    "長崎市": {
      reply: `長崎市は国際色豊かな歴史を持ち、出島・グラバー園・平和公園など国内外の観光客を惹きつける拠点です。また、港湾都市としての機能や産業も根付いており、近年はMICE誘致やデジタル田園都市構想との連携も模索されています。一方で中心市街地の空洞化や高齢化、公共交通の再編といった都市構造的な課題にも直面しており、民間との協業による再構築が期待されています。`,
      coord: [32.7503, 129.8777],
      infra: "最寄りIC：長崎IC／最寄りPA：今村PA"
    },
    "小城市": {
      reply: `小城市は佐賀県の中央部に位置し、歴史と自然、そして地場産業が調和する地域です。特に小城羊羹は地域ブランドとして広く知られ、観光と物産の融合によるまちづくりが進められています。農業の基盤も強く、地域資源を活かした6次産業化への取り組みも始まっています。一方で、担い手不足や後継者問題など地域内の人材循環の課題があり、若者定住のための住宅・雇用政策が求められています。`,
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

    if (map !== null) {
      map.remove();
      map = null;
      markers = [];
    }
    mapContainer.innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    regionCard.value = "";

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
