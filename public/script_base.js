// ✅ SORA Dashboard Script Base - 安定動作ベース + ThinkingZone追加

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
  const mapModal = document.getElementById("mapModal");
  const mapModalBody = document.getElementById("mindmapContainer");
  const closeMapBtn = document.getElementById("closeMapModal");

  let infoFetched = false;
  let isAccordionOpen = false;
  let isFetching = false;
  let isThinkingVisible = false;

  fileInput.addEventListener("change", () => {
    fileNameDisplay.textContent = fileInput.files.length > 0
      ? fileInput.files[0].name
      : "ファイルを選択してください";
  });

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

  analyzeBtn.addEventListener("click", async () => {
    const region = regionInput.value.trim();
    const theme = noteInput.value.trim();
    if (!region || !theme) return alert("地域名とテーマを入力してください。");

    const prompt = `${region}について、テーマ「${theme}」に基づく地域課題を抽出してください。最大5つ、1〜2文で簡潔に。`;
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
    } catch (err) {
      console.error("課題抽出エラー:", err);
      canvasResult.innerText = "エラーが発生しました。";
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "課題抽出";
    }
  });

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

  generateAllBtn.addEventListener("click", () => {
    const blocks = document.querySelectorAll(".thinking-block");
    let output = "<ul style='list-style:none;padding-left:0;'>";
    blocks.forEach((block) => {
      const task = block.querySelector("p").innerText;
      const opinion = block.querySelector("textarea").value.trim();
      output += `<li style='margin-bottom:10px;'>🟢 <strong>${task}</strong><br>考察: ${opinion || "（未記入）"}</li>`;
    });
    output += "</ul><p style='margin-top:1em;'>※ChatGPT連携による対策提案予定</p>";
    mapModalBody.innerHTML = output;
    mapModal.classList.remove("hidden");
  });

  closeMapBtn.addEventListener("click", () => {
    mapModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === mapModal) mapModal.classList.add("hidden");
  });
});
