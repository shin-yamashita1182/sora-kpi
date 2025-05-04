
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
  const generateMindMapGPTBtn = document.getElementById("generateMindMapGPTBtn");
  const mindMapModal = document.getElementById("mapModal");
  const mindMapContent = document.getElementById("mindmapContainer");
  const closeMindMapBtn = document.getElementById("closeMapModal");

  let isThinkingVisible = false;
  let infoFetched = false;
  let isAccordionOpen = false;
  let isFetching = false;
  let analysisDone = false;
// 📝 議事録ファイルの読み取り結果を保持
  let uploadedTextContent = "";
  let isAnalyzing = false;

  // 📁 ファイル選択表示
  if (fileInput) {
 fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (file.type === "text/plain") {
    uploadedTextContent = await file.text();
  } else if (file.type === "application/pdf") {
    uploadedTextContent = await extractTextFromPDF(file);
  } else {
    alert("対応ファイル形式は .txt または .pdf のみです。");
    uploadedTextContent = "";
  }

  fileNameDisplay.textContent = file.name ? `アップロード済み：${file.name}` : "ファイルを選択してください";
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

const prompt = `あなたは実在する施設名に基づいて正確に答える必要があります。${region}周辺に存在する実在するサービスエリア（SA）、パーキングエリア（PA）、および主なインターチェンジ（IC）を最大5件までリスト形式でまとめてください。施設名は必ず実在するもので、ChatGPTが創作した架空の名称を使わないでください。施設ごとに「名称」と「特徴（例：飲食、トイレ、ガソリン）」を1文で添えてください。例：金流サービスエリア（飲食・トイレ完備）など。`;

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

const promptTemplate = `
以下は、ある地域における重要なテーマと、それに関連する会議資料（議事録・ヒアリングメモ等）です。

この情報をもとに、その地域が現在抱えている主な課題を10個に整理してください。

課題は、住民生活、産業、教育、交通、福祉、環境、IT、地域ブランドなど多様な観点から導出し、
それぞれ住民や行政関係者が読んでも理解しやすいよう、1文または2文程度で簡潔に表現してください。

議事録などの参考資料がない場合でも、地域名やテーマから合理的に推定される課題を補完してください。
出力は【1】〜【10】の番号付きでお願いします。

---

【地域名】：{{region}}  
【テーマ】：{{theme}}  
【参考資料】：  
{{minutesText}}
`;

const prompt = promptTemplate
  .replace("{{region}}", region)
  .replace("{{theme}}", theme)
  .replace("{{minutesText}}", uploadedTextContent || "");


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

updateGoogleMap(region);
    
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

// 🧠 ThinkingZone展開切替（5件のみ・重複なし）
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

    thinkingContainer.innerHTML = "";
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
if (generateMindMapGPTBtn) {
  generateMindMapGPTBtn.addEventListener("click", async () => {
    await generateMindMapFromGPT();
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
async function extractTextFromPDF(file) {
  const pdfData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }
  return fullText;
}
// 🧠 マインドマップ描画（ThinkingZone入力 → MindElixirで可視化）
function drawMindMapFromInputs() {
  const blocks = document.querySelectorAll(".thinking-block");
  const mindmapContainer = document.getElementById("mindmapContainer");
  mindmapContainer.innerHTML = ""; // 二重描画防止

  const children = [];

  blocks.forEach((block, index) => {
    const task = block.querySelector("p").innerText || `課題${index + 1}`;
    const opinion = block.querySelector("textarea").value.trim();
    children.push({
      topic: task,
      children: opinion ? [{ topic: `考察: ${opinion}` }] : []
    });
  });

  const mind = new MindElixir({
    el: '#mindmapContainer',
    direction: MindElixir.RIGHT,
    data: {
      nodeData: {
        id: 'root',
        topic: '課題マップ',
        children: children
      }
    },
    draggable: true,
    contextMenu: true,
    toolBar: true,
    nodeMenu: true,
    keypress: true
  });

  mind.init();
}
// 🧠 ChatGPTから課題＋考察ベースのマインドマップを生成（今後拡張予定）
async function generateMindMapFromGPT() {
  console.log("🧠 generateMindMapFromGPTが呼び出されました（今後の実装箇所）");

  // ここに ChatGPT への POST 送信と、戻り値で MindElixir に渡す処理を実装予定
  // 例：
  // const prompt = `以下は課題と考察のセットです。...`;
  // const res = await fetch("/api/chatgpt", {...});
  // const data = await res.json();
  // const mindData = transformToMindElixir(data.result);
  // mind.init(mindData);
}

// 📌 モーダルを開いたときにマインドマップ描画を実行
if (generateAllBtn) {
  generateAllBtn.addEventListener("click", () => {
    drawMindMapFromInputs(); // 🧠描画呼び出し
    mindMapModal.classList.remove("hidden");
  });
}
