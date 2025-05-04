// ✅ SORA Dashboard Script Base - 最小構成版（NEXCO連動 + ChatGPT課題抽出 + ThinkingZoneマインドマップ）
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

  fileInput.addEventListener("change", () => {
    fileNameDisplay.textContent = fileInput.files.length > 0
      ? fileInput.files[0].name
      : "ファイルを選択してください";
  });

  // 🚗 NEXCO情報表示/取得
  toggleNexcoBtn.addEventListener("click", () => {
    const region = regionInput.value.trim();
    if (!region) return alert("地域名を入力してください！");

    if (!infoFetched && !isFetching) {
      isFetching = true;
      toggleNexcoBtn.textContent = "NEXCO情報 取得中…";

      const prompt = `${region}周辺の高速道路に関する、主なインターチェンジ、サービスエリア、パーキングエリアを最大5〜7件程度、リスト形式で簡潔にまとめてください。各施設名と簡単な特徴（例：トイレ、飲食、ガソリン有無など）だけを記載してください。それ以外の情報は不要です。`;

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

  function updateNexcoButtonLabel() {
    toggleNexcoBtn.textContent = isAccordionOpen ? "NEXCO情報を閉じる" : "NEXCO情報を表示";
    nexcoStatus.textContent = isAccordionOpen ? "NEXCO情報を表示中" : "NEXCO情報を非表示にしました";
  }

  // 💬 ChatGPT連携：課題抽出
  analyzeBtn.addEventListener("click", async () => {
    if (analysisDone) {
      alert("すでに課題抽出が完了しています。ページを更新するか、条件を変更してください。");
      return;
    }
    const region = regionInput.value.trim();
    const theme = noteInput.value.trim();
    if (!region || !theme) return alert("地域名とテーマを入力してください。 ※どちらかが未記入です");

    const prompt = `${region}について、テーマ「${theme}」に基づく地域課題を抽出してください。\n以下の内容について、最大トークン数500以内で、最大5つまでの地域課題を簡潔に挙げてください。各課題は1〜2文で記述し、原因や背景が簡潔に分かるようにしてください。`;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "抽出中…";

    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      canvasResult.innerText = data.result || "課題が取得できませんでした。";
      analysisDone = true;
    } catch (err) {
      console.error("課題抽出エラー:", err);
      alert("ChatGPTへの接続に失敗しました。もう一度お試しください。");
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "課題抽出";
    }
  });

  // 🧠 ThinkingZone展開切替
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

  // 🧠 一括マインドマップモーダル出力
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

  closeMindMapBtn.addEventListener("click", () => {
    mindMapModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === mindMapModal) mindMapModal.classList.add("hidden");
  });
});
