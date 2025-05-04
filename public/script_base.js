// ✅ SORA Dashboard Script Base - 完全復旧版（NEXCO連動 + 課題抽出 + マインドマップ + 再抽出防止）

document.addEventListener("DOMContentLoaded", () => {
  // 🌐 ChatGPT 課題抽出ボタン
  const analyzeBtn = document.getElementById("analyzeBtn");
  const gptResponse = document.getElementById("gptResponse");
  let analysisDone = false;

  analyzeBtn.addEventListener("click", async () => {
    if (analysisDone) {
      alert("すでに課題抽出が完了しています。ページを更新するか、条件を変更してください。");
      return;
    }

    const region = document.getElementById("regionName").value.trim();
    const category = document.getElementById("category").value;
    const note = document.getElementById("userNote").value.trim();

    if (!note) {
      alert("自由記述欄が空です。入力してください。");
      return;
    }

    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, category, note })
      });

      if (!response.ok) {
        gptResponse.innerText = "ChatGPT連携に失敗しました。";
        return;
      }

      const result = await response.json();
      gptResponse.innerText = result.message || "応答がありませんでした。";
      analysisDone = true;
    } catch (error) {
      console.error("課題抽出中にエラー:", error);
      gptResponse.innerText = "エラーが発生しました。";
    }
  });

  // 🚧 NEXCO情報表示切替
  const toggleNexcoBtn = document.getElementById("toggleNexcoBtn");
  const nexcoInfoBox = document.getElementById("nexcoInfoBox");
  const nexcoInfoList = document.getElementById("nexcoInfoList");
  const nexcoStatus = document.getElementById("nexcoStatus");

  toggleNexcoBtn.addEventListener("click", () => {
    if (nexcoInfoBox.style.display === "none" || nexcoInfoBox.style.display === "") {
      nexcoInfoBox.style.display = "block";
      nexcoStatus.innerText = "表示中";
      loadNexcoInfo();
    } else {
      nexcoInfoBox.style.display = "none";
      nexcoStatus.innerText = "非表示中";
    }
  });

  function loadNexcoInfo() {
    nexcoInfoList.innerHTML = "";
    const sampleData = [
      "◉ サービスエリア：〇〇SA（上り）",
      "◉ 高速道路：〇〇自動車道（上下線）",
      "◉ 渋滞ポイント：〇〇IC ～ △△IC"
    ];
    sampleData.forEach(info => {
      const li = document.createElement("li");
      li.textContent = info;
      nexcoInfoList.appendChild(li);
    });
  }

  // 🧠 ThinkingZone 展開・初期化
  const generateBtn = document.getElementById("generateBtn");
  const thinkingContainer = document.getElementById("thinkingContainer");
  const allMindMapResult = document.getElementById("allMindMapResult");
  let isThinkingVisible = false;

  generateBtn.addEventListener("click", () => {
    if (isThinkingVisible) {
      thinkingContainer.innerHTML = "";
      allMindMapResult.innerHTML = "";
      isThinkingVisible = false;
      return;
    }

    const sampleTasks = [
      "観光客の減少が著しい",
      "老朽インフラの更新が進まない",
      "若手職員の離職が多い",
      "移住促進制度が浸透しない",
      "避難所の整備計画が遅れている"
    ];

    sampleTasks.forEach((task, index) => {
      const block = document.createElement("div");
      block.className = "thinking-block";

      block.innerHTML = `
        <p><strong>課題${index + 1}:</strong> ${task}</p>
        <textarea placeholder="この課題について、考えていることや背景を入力してください…" rows="4"></textarea>
      `;

      thinkingContainer.appendChild(block);
    });

    isThinkingVisible = true;
  });

  // 🧠 一括マインドマップ出力（ThinkingZone下に表示）
  const generateAllBtn = document.getElementById("generateAllBtn");

  generateAllBtn.addEventListener("click", () => {
    const blocks = document.querySelectorAll(".thinking-block");
    const resultArea = document.getElementById("allMindMapResult");
    let output = "<strong>🧠 一括マインドマップ出力（仮）</strong><ul>";
    blocks.forEach((block, index) => {
      const task = block.querySelector("p").innerText;
      const opinion = block.querySelector("textarea").value.trim();
      output += `<li><strong>${task}</strong><br>考察: ${opinion || "（未記入）"}</li>`;
    });
    output += "</ul><p>※ChatGPT連携により対策提案予定</p>";
    resultArea.innerHTML = output;
  });

  // 🧠 マインドマップモーダルを閉じる
  const closeMapModal = document.getElementById("closeMapModal");
  const mapModal = document.getElementById("mapModal");

  closeMapModal.addEventListener("click", () => {
    mapModal.classList.add("hidden");
  });
});
