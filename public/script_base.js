
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const generateBtn = document.getElementById('generateBtn');
  const regionNameInput = document.getElementById('regionName');
  const userNoteInput = document.getElementById('userNote');
  const canvasResult = document.getElementById('canvasResult');
  const coreMasterContainer = document.getElementById('coreMasterContainer');
  const resultsContainer = document.getElementById('resultsContainer');
  const compareListContainer = document.getElementById("compareListContainer");

  const mindMapModal = document.getElementById("mindMapModal");
  const mindMapContent = document.getElementById("mindMapContent");
  const closeMindMapBtn = document.getElementById("closeMindMapModal");

  const nexcoBtn = document.getElementById("toggleNexcoBtn");
  const infoBox = document.getElementById("nexcoInfoBox");
  const infoList = document.getElementById("nexcoInfoList");
  const statusBox = document.getElementById("nexcoStatus");

  let currentMasterData = [];

  analyzeBtn.addEventListener('click', async () => {
    const regionName = regionNameInput.value.trim();
    const userNote = userNoteInput.value.trim();
    if (!regionName || !userNote) {
      alert("地域名とテーマを入力してください。");
      return;
    }

    const prompt = `${regionName}について、テーマ「${userNote}」に基づく地域課題を抽出してください。`;

    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      canvasResult.innerText = data.result || "（応答が空でした）";
    } catch (error) {
      console.error("❌ ChatGPT fetch error:", error);
      alert("ChatGPT連携に失敗しました。");
    }
  });

  generateBtn.addEventListener('click', async () => {
    resultsContainer.style.display = "block";

    try {
      const response = await fetch("/coremaster_demo_20.json");
      const data = await response.json();
      currentMasterData = data;
      coreMasterContainer.innerHTML = "";

      currentMasterData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-index", index);

        let labelClass = "";
        if (item.viewpoint.includes("財務")) labelClass = "finance";
        else if (item.viewpoint.includes("顧客")) labelClass = "customer";
        else if (item.viewpoint.includes("内部")) labelClass = "process";
        else if (item.viewpoint.includes("学習")) labelClass = "learning";

        card.innerHTML = `
          <div class="viewpoint-tag ${labelClass}">${item.viewpoint}</div>
          <div class="viewpoint-note">${item.note}</div>
          <h3>${item.strategy}</h3>
          <div class="button-area">
            <button class="detail-button">詳細</button>
            <button class="add-to-priority">優先リストに追加</button>
          </div>
        `;
        coreMasterContainer.appendChild(card);
      });
    } catch (e) {
      console.error("❌ JSON読み込み失敗", e);
      alert("戦略カードの読み込みに失敗しました。");
    }
  });

  coreMasterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-priority")) {
      const originalCard = event.target.closest(".card");
      const title = originalCard.querySelector("h3")?.textContent.trim();
      const note = originalCard.querySelector(".viewpoint-note")?.textContent.trim();
      const perspective = originalCard.querySelector(".viewpoint-tag")?.textContent.trim();

      const priorityCard = document.createElement("div");
      priorityCard.className = "card";
      priorityCard.innerHTML = `
        <div class="viewpoint-tag">${perspective}</div>
        <div class="viewpoint-note">${note}</div>
        <h3>${title}</h3>
        <div class="button-area">
          <button class="add-priority-button">マインドマップ</button>
        </div>
      `;
      compareListContainer.appendChild(priorityCard);
    }
  });

  compareListContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-priority-button")) {
      const titles = [...compareListContainer.querySelectorAll("h3")].map(el => el.textContent.trim());
      mindMapContent.innerHTML = `
        <ul style="list-style: none; padding-left: 0;">
          ${titles.map(title => `<li style="margin-bottom: 10px;">🟢 ${title}</li>`).join("")}
        </ul>
      `;
      mindMapModal.style.display = "block";
    }
  });

  closeMindMapBtn?.addEventListener("click", () => {
    mindMapModal.style.display = "none";
  });

  nexcoBtn?.addEventListener("click", () => {
    const region = regionNameInput.value.trim();
    if (!region) {
      alert("地域名を入力してください！");
      return;
    }

    if (!infoBox.classList.contains("open")) {
      nexcoBtn.textContent = "NEXCO情報 取得中…";
      const prompt = `${region}周辺の高速道路に関する、主なインターチェンジ、サービスエリア、パーキングエリアを最大5〜7件程度、リスト形式で簡潔にまとめてください。`;

      fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
      .then(response => response.json())
      .then(data => {
        const items = (data.result || "").split(/\n|・|。/).filter(line => line.trim().length > 4);
        infoList.innerHTML = "";
        items.forEach(text => {
          const li = document.createElement("li");
          li.textContent = text.trim();
          infoList.appendChild(li);
        });
        infoBox.classList.add("open");
        nexcoBtn.textContent = "NEXCO情報を閉じる";
        statusBox.textContent = "NEXCO情報を表示中";
      })
      .catch(err => {
        console.error("NEXCO取得失敗", err);
        infoList.innerHTML = "<li>取得に失敗しました。</li>";
        nexcoBtn.textContent = "NEXCO情報を表示";
      });
    } else {
      infoBox.classList.remove("open");
      nexcoBtn.textContent = "NEXCO情報を表示";
      statusBox.textContent = "NEXCO情報を非表示にしました";
    }
  });
});
