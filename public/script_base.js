
// ✅ SORA Dashboard Script Base - 統合版（NEXCO連動 + ChatGPT課題抽出 + ThinkingZoneマインドマップ／安定運用構成）
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const regionInput = document.getElementById("regionName");
  const noteInput = document.getElementById("userNote");
  const canvasResult = document.getElementById("canvasResult");

  const toggleNexcoBtn = document.getElementById("toggleNexcoBtn");
  const nexcoInfoBox = document.getElementById("nexcoInfoBox");
  const nexcoInfoList = document.getElementById("nexcoInfoList");
  const nexcoStatus = document.getElementById("nexcoStatus");

  const thinkingContainer = document.getElementById("thinkingContainer");
  const generateBtn = document.getElementById("generateBtn");
  const generateAllBtn = document.getElementById("generateAllBtn");
  const mindMapModal = document.getElementById("mapModal");
  const mindMapContent = document.getElementById("mindmapContainer");
  const closeMindMapBtn = document.getElementById("closeMapModal");

  let isThinkingVisible = false;
  let infoFetched = false;
  let isAccordionOpen = false;
  let isFetching = false;
  let analysisDone = false;
  let isAnalyzing = false;

  // 📁 ファイル選択表示
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      fileNameDisplay.textContent = fileInput.files.length > 0
        ? fileInput.files[0].name
        : "ファイルを選択してください";
    });
  }

  // 🚗 NEXCO情報表示/取得
  if (toggleNexcoBtn) {
    toggleNexcoBtn.addEventListener("click", () => {
      const region = regionInput.value.trim();
      if (!region) return alert("地域名を入力してください！");

      if (!infoFetched && !isFetching) {
        isFetching = true;
        toggleNexcoBtn.textContent = "NEXCO情報 取得中…";

       const prompt = `あなたは日本の高速道路インフラに詳しい専門家です。地域「${region}」周辺に存在する高速道路の主要施設（サービスエリア、パーキングエリア、インターチェンジ）を、以下の条件に従って最大5件まで厳選し、リスト形式で出力してください。

【条件】
- 特に大規模・重要な施設（例：別府湾SA、金立SAなど）を優先して含めてください
- 各施設の名称、種別（SA/PA/IC）、特徴（例：トイレ、飲食、ガソリンスタンド有無など）を簡潔に記載してください
- 出力形式：「1. 施設名（種別）：特徴」のように、番号付き箇条書きでお願いします
- 内容は簡潔かつ要点を押さえ、余分な解説や背景情報は不要です
`;

        fetch("/api/chatgpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        })
          .then(res => res.json())
          .then(data => {
            const items = (data.result || "").split(/\n|・|。|！|？/).filter(line => line.trim().length > 4);
            nexcoInfoList.innerHTML = "";
            items.forEach(text => {
              const li = document.createElement("li");
              li.textContent = text.trim();
              nexcoInfoList.appendChild(li);
            });
            infoFetched = true;
            nexcoInfoBox.classList.add("open");
            isAccordionOpen = true;
            updateNexcoButtonLabel();
          })
          .catch(err => {
            console.error("NEXCO取得失敗:", err);
            nexcoInfoList.innerHTML = "<li>情報取得に失敗しました。</li>";
          })
          .finally(() => {
            toggleNexcoBtn.textContent = "NEXCO情報を表示";
            isFetching = false;
          });
      } else {
        isAccordionOpen = !isAccordionOpen;
        nexcoInfoBox.classList.toggle("open", isAccordionOpen);
        updateNexcoButtonLabel();
      }
    });
  }

  function updateNexcoButtonLabel() {
    toggleNexcoBtn.textContent = isAccordionOpen ? "NEXCO情報を閉じる" : "NEXCO情報を表示";
    nexcoStatus.textContent = isAccordionOpen ? "NEXCO情報を表示中" : "NEXCO情報を非表示にしました";
  }

  // 💬 ChatGPT連携：課題抽出
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async () => {
      const region = regionInput.value.trim();
      const theme = noteInput.value.trim();

      if (!region || !theme) {
        alert("地域名とテーマを入力してください。");
        return;
      }

      if (isAnalyzing) {
        alert("課題抽出処理中です。しばらくお待ちください。");
        return;
      }

      if (analysisDone) {
        alert("すでに課題が抽出されています。ページを更新するか内容を変更してください。");
        return;
      }

const prompt = `あなたは地域課題に精通した専門家です。地域名「${region}」、テーマ「${theme}」に基づいて、現在想定される地域課題を日本語で5件、簡潔に抽出してください。各課題は1～2文で背景や原因がわかるよう記述し、箇条書き（番号付き）で出力してください。トークン数は最大800以内でお願いします。`;

      isAnalyzing = true;
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "抽出中…";

      try {
        const res = await fetch("/api/chatgpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        });
const data = await res.json();
const canvasResult = document.getElementById("canvasResult");
canvasResult.innerText = data.result || "課題が取得できませんでした。";
canvasResult.style.maxWidth = "100%"; // または必要なら "95%" 程度に調整可
canvasResult.style.margin = "20px 0"; // auto を削除し左右寄せ防止
canvasResult.style.textAlign = "left"; // このままでOK

analysisDone = true;

      } catch (err) {
        console.error("課題抽出エラー:", err);
        alert("課題抽出に失敗しました。");
      } finally {
        isAnalyzing = false;
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "課題抽出";
      }
    });
  }

  // 🧠 ThinkingZone展開切替
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      if (isThinkingVisible) {
        thinkingContainer.innerHTML = "";
        isThinkingVisible = false;
        return;
      }

      const tasks = [
        "観光客の減少が著しい",
        "老朽インフラの更新が進まない",
        "若手職員の離職が多い",
        "移住促進制度が浸透しない",
        "避難所の整備計画が遅れている"
      ];

      tasks.forEach((task, i) => {
        const block = document.createElement("div");
        block.className = "thinking-block";
        block.innerHTML = `<p><strong>課題${i + 1}:</strong> ${task}</p><textarea rows="3" placeholder="考えや背景を入力してください"></textarea>`;
        thinkingContainer.appendChild(block);
      });
      isThinkingVisible = true;
    });
  }

  // 🧠 一括マインドマップモーダル出力
  if (generateAllBtn) {
    generateAllBtn.addEventListener("click", () => {
      const blocks = document.querySelectorAll(".thinking-block");
      let output = "<ul style='list-style:none;padding-left:0;'>";
      blocks.forEach((block) => {
        const task = block.querySelector("p").innerText;
        const opinion = block.querySelector("textarea").value.trim();
        output += `<li style='margin-bottom:10px;'>🟢 <strong>${task}</strong><br>考察: ${opinion || "（未記入）"}</li>`;
      });
      output += "</ul><p style='margin-top:1em;'>※ChatGPT連携による対策提案予定</p>";
      mindMapContent.innerHTML = output;
      mindMapModal.classList.remove("hidden");
    });
  }

  if (closeMindMapBtn) {
    closeMindMapBtn.addEventListener("click", () => {
      mindMapModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === mindMapModal) mindMapModal.classList.add("hidden");
  });
});
