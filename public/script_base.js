
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const generateBtn = document.getElementById('generateBtn');
  const regionNameInput = document.getElementById('regionName');
  const userNoteInput = document.getElementById('userNote');
  const canvasResult = document.getElementById('canvasResult');
  const coreMasterContainer = document.getElementById('coreMasterContainer');
  const resultsContainer = document.getElementById('resultsContainer');
  const compareListContainer = document.getElementById("compareListContainer");

  let currentMasterData = [];

  if (!analyzeBtn || !generateBtn) {
    console.error("❌ analyzeBtn または generateBtn が見つかりません");
    return;
  }

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

      if (!response.ok) throw new Error("ChatGPT APIエラー");

      const data = await response.json();
      if (!data.result || data.result.trim() === "") {
        canvasResult.innerText = "（応答が空でした）";
        console.warn("⚠️ ChatGPTの応答が空でした");
      } else {
        canvasResult.innerText = data.result;
        console.log("✅ ChatGPT応答:", data.result);
      }
    } catch (error) {
      console.error("❌ ChatGPT fetch error:", error);
      alert("ChatGPT連携に失敗しました。応答が出ているか確認してください。");
    }
  });

  generateBtn.addEventListener('click', async () => {
    console.log("🟢 分析対策ボタンが押されました");
    resultsContainer.style.display = "block";

    try {
      const response = await fetch("/json/coremaster_demo_20.json");
      const data = await response.json();
      currentMasterData = data;
      coreMasterContainer.innerHTML = "";

      currentMasterData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-index", index);

        let labelClass = "";
        if (item.perspective.includes("財務")) labelClass = "finance";
        else if (item.perspective.includes("顧客")) labelClass = "customer";
        else if (item.perspective.includes("内部")) labelClass = "process";
        else if (item.perspective.includes("学習")) labelClass = "learning";

        card.innerHTML = `
          <div class="viewpoint-tag ${labelClass}">${item.perspective}</div>
          <div class="viewpoint-note">${item.note}</div>
          <h3>${item.title}</h3>
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
});
