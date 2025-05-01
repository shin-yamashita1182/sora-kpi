// ✅ SORA Dashboard Script Base - 完全版（NEXCO連動 + 課題抽出 + KPI分析 + 比較）
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  const mapModal = document.getElementById("mapModal");
  const mapModalBody = document.getElementById("mapModalBody");
  const closeMapBtn = document.getElementById("closeMapModal");

  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");

  const compareListContainer = document.getElementById("compareListContainer");
  const resultsContainer = document.getElementById('resultsContainer');
  const analyzeBtn = document.getElementById('analyzeBtn');

  let analysisDone = false;

  analyzeBtn.addEventListener("click", async () => {
    if (analysisDone) {
      alert("すでに課題抽出が完了しています。ページを更新するか、条件を変更してください。");
      return;
    }

    const regionName = document.getElementById("regionName").value.trim();
    const userNote = document.getElementById("userNote").value.trim();

    if (!regionName) {
      alert("地域名を入力してください。");
      return;
    }

    if (!userNote) {
      alert("テーマや自由記述を入力してください。");
      return;
    }

    updateGoogleMap(regionName);

    const originalBtnText = analyzeBtn.innerText;
    analyzeBtn.innerText = "課題抽出中…";
    analyzeBtn.disabled = true;

    const prompt = `${regionName}について、テーマ「${userNote}」に基づく地域課題を抽出してください。\n以下の内容について、最大トークン数500以内で、最大5つまでの地域課題を簡潔に挙げてください。各課題は1〜2文で記述し、原因や背景が簡潔に分かるようにしてください。`;

    try {
      await fetchChatGPTResponse(prompt);
      await insertCoreMasterCards();
      analysisDone = true;
    } catch (error) {
      console.error("抽出中に問題が発生しました:", error);
      alert("課題抽出に失敗しました。");
    } finally {
      analyzeBtn.innerText = originalBtnText;
      analyzeBtn.disabled = false;
    }
  });

  async function fetchChatGPTResponse(prompt) {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error("ChatGPT APIエラー");
    const data = await response.json();
    const canvasResult = document.getElementById("canvasResult");
    canvasResult.innerText = data.result || "結果が取得できませんでした。";
  }

  async function insertCoreMasterCards() {
    try {
      const response = await fetch("/json/coremaster_demo_20.json");
      const data = await response.json();

      const targetContainer =
        document.querySelector("#resultsContainer .accordion-content") ||
        document.querySelector("#resultsContainer .accordion-body") ||
        document.querySelector("#resultsContainer .card-container");

      if (!targetContainer) {
        console.warn("カード挿入先のアコーディオンが見つかりませんでした");
        return;
      }

      data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.marginBottom = "10px";
        card.style.border = "1px solid #ddd";
        card.style.padding = "12px";
        card.style.borderRadius = "8px";
        card.style.background = "#fff";

        let labelColor = "#ccc";
        if (item.perspective.includes("財務")) labelColor = "#cce5ff";
        else if (item.perspective.includes("顧客")) labelColor = "#d4edda";
        else if (item.perspective.includes("内部")) labelColor = "#fff3cd";
        else if (item.perspective.includes("学習")) labelColor = "#f8d7da";

        card.innerHTML = `
          <div style="font-size: 12px; background: ${labelColor}; display: inline-block; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px;">
            ${item.perspective}
          </div>
          <p style="font-size: 11px; color: #666; margin-top: 0;">${item.note}</p>
          <h3 style="margin: 8px 0;">${item.title}</h3>
          <p><strong>KPI:</strong> ${item.kpi}</p>
          <div style="text-align: center; margin-top: 10px;">
            <button class="add-to-priority">優先に追加</button>
          </div>
        `;

        targetContainer.appendChild(card);
      });

    } catch (error) {
      console.error("CoreMaster読み込みエラー:", error);
    }
  }
});
