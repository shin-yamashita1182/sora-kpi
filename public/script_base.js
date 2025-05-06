  let latestExtractedTasks = []; // 🆕 抽出課題を保存
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
  let latestMindMapData = null; // スクリプトの上の方に追加しておく


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
// 🆕 課題10件を latestExtractedTasks に保存
const canvasText = canvasResult.innerText;
const matches = [...canvasText.matchAll(/【\d+】(.*?)\n?/g)];
latestExtractedTasks = matches.map(m => m[1].trim());
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
    if (!analysisDone) {
      alert("先に課題抽出を行ってください。");
      return; // ← ここで止めることで下が開かなくなる！
    }

    if (isThinkingVisible) {
      thinkingContainer.innerHTML = "";
      isThinkingVisible = false;
      return;
    }

    const tasks = [
      "観光需要回復のための収益戦略を検討する",
      "インフラ更新計画と優先順位づけの仕組みを構築する",
      "職員定着を促すキャリア形成支援策を考える",
      "移住制度の周知・利用促進に向けた改善策を検討",
      "避難所整備の加速化と計画再構築の方法を考える"
    ];

    thinkingContainer.innerHTML = "";
    tasks.forEach((task, i) => {
      const block = document.createElement("div");
      block.className = "thinking-block";
      block.innerHTML = `<p><strong>対策${i + 1}:</strong> ${task}</p><textarea rows="3" placeholder="考えや背景を入力してください"></textarea>`;
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

let mindMapGenerated = false; // ← 追加するグローバル変数

if (generateMindMapGPTBtn) {
  generateMindMapGPTBtn.addEventListener("click", async () => {
    if (mindMapGenerated) {
      alert("すでにマインドマップは生成されています。ページを更新するか、条件を変更してください。");
      return;
    }

    if (!regionInput.value.trim() || !noteInput.value.trim() || latestExtractedTasks.length !== 10) {
      alert("先に課題抽出を行ってください。");
      return;
    }

    generateMindMapGPTBtn.disabled = true;
    generateMindMapGPTBtn.textContent = "マインドマップ生成中…";

    try {
      await generateMindMapFromGPT();
      mindMapGenerated = true;
      // 🎯 成功してもテキストは変更しない（表示そのまま）
    } catch (err) {
      console.error("⚠️ マインドマップ生成中にエラー:", err);
      alert("マインドマップ生成に失敗しました。");
      generateMindMapGPTBtn.disabled = false;
      generateMindMapGPTBtn.textContent = "マインドマップの生成";
    }
  });
}




  if (closeMindMapBtn) {
    closeMindMapBtn.addEventListener("click", () => {
      mindMapModal.classList.add("hidden");
    });
  }


// ✅ 🆕 全画面トグル機能（現在は一時無効化中）
// const toggleFullscreenBtn = document.getElementById("toggleFullscreenMap");
// const mapModalContent = document.querySelector("#mapModal .modal-content");

// if (toggleFullscreenBtn && mapModalContent) {
//   let isFullscreen = false;

//   toggleFullscreenBtn.addEventListener("click", () => {
//     isFullscreen = !isFullscreen;
//     mapModalContent.classList.toggle("fullscreen-modal", isFullscreen);
//     toggleFullscreenBtn.textContent = isFullscreen ? "🗗" : "🔳";
//     toggleFullscreenBtn.title = isFullscreen ? "元に戻す" : "全画面化";
//   });
// }

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

// Safe deep copy（循環参照が入る前に保存）
latestMindMapData = JSON.parse(JSON.stringify(parsed));

const mind = new MindElixir({
  el: '#mindmapContainer',
  direction: MindElixir.RIGHT,
  data: parsed,  // ← GPTが返す形式に合わせる
  draggable: true,
  contextMenu: true,
  toolBar: true,
  nodeMenu: true,
  keypress: true
});


  mind.init();
}

async function generateMindMapFromGPT() {
  console.log("🧠 generateMindMapFromGPTが呼び出されました");

  const blocks = document.querySelectorAll(".thinking-block");
  const region = document.getElementById("regionName").value.trim();
  const theme = document.getElementById("userNote").value.trim();

  if (!region || !theme || latestExtractedTasks.length !== 10) {
    alert("課題またはテーマ情報が不足しています。先に課題抽出を行ってください。");
    return;
  }

  let combinedText = `【地域名】：${region}\n【テーマ】：${theme}\n\n以下は抽出された課題です。\n`;
  latestExtractedTasks.forEach((task, i) => {
    combinedText += `【${i + 1}】${task}\n`;
  });

  combinedText += `\n以下は住民・関係者からの考察です（任意）：\n`;
  blocks.forEach((block) => {
    const opinion = block.querySelector("textarea").value.trim();
    if (opinion) combinedText += `・${opinion}\n`;
  });

  // ✅ ここで finalPrompt を構築
  const finalPrompt = `
以下は、地域課題とそれに対する住民の考察です。これをもとに、中心テーマを「${region}：${theme}」とした放射状マインドマップ構造を構築してください。

MindElixir.jsで描画可能な構造（topic, children）にしてください。
日本語を使い、重要な項目は深掘りし、3階層以上になるように構成してください。
出力は必ずJSONオブジェクトのみで返してください。コードブロック（\`\`\`）や説明文は一切含めないでください。

${combinedText}
`;

  try {
    const res = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt })
    });

    const data = await res.json();
    let cleaned = data.result.trim().replace(/^```json|^```|^json|```$/g, "");
    const endIndex = cleaned.lastIndexOf("}");
    if (endIndex !== -1) cleaned = cleaned.slice(0, endIndex + 1);

    const parsed = JSON.parse(cleaned);
    // ⬇⬇⬇ これを追加
    latestMindMapData = parsed;

    // 🧼 children: [] を除去
    function sanitize(node) {
      if (Array.isArray(node.children)) {
        if (node.children.length === 0) {
          delete node.children;
        } else {
          node.children.forEach(sanitize);
        }
      }
    }
    sanitize(parsed);

    if (!parsed || typeof parsed !== "object" || !parsed.topic) {
      alert("マインドマップの構造が不正です。");
      return;
    }

    document.getElementById("mapModal").classList.remove("hidden");

    const mind = new MindElixir({
      el: "#mindmapContainer",
      direction: MindElixir.RIGHT,
      data: { nodeData: parsed },
      draggable: true,
      contextMenu: true,
      toolBar: true,
      nodeMenu: true,
      keypress: true
    });

    mind.init();
    mind.scale(0.75);

// 💾 保存ボタン：存在確認してバインド or 新規作成
const existingSaveBtn = document.getElementById("saveMindMapBtn");

const handleSave = () => {
  console.log("🖱️ 保存ボタンクリックされた");
  try {
    const cleanCopy = JSON.parse(JSON.stringify(latestMindMapData, (key, value) => {
      if (key === "parent") return undefined;
      return value;
    }));

    const blob = new Blob([JSON.stringify(cleanCopy, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindmap_${region}_${theme}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("✅ 保存完了");
  } catch (err) {
    console.error("保存失敗:", err);
    alert("マインドマップ保存に失敗しました。");
  }
};

if (existingSaveBtn) {
  existingSaveBtn.onclick = handleSave;  // ← onclick で上書きしてもOK
} else {
  const saveBtn = document.createElement("button");
  saveBtn.id = "saveMindMapBtn";
  saveBtn.className = "modal-save-btn";
  saveBtn.textContent = "マップを保存";
  saveBtn.addEventListener("click", handleSave);
  document.querySelector("#mapModal .modal-content").appendChild(saveBtn);
}

    const rootNode = document.querySelector("#mindmapContainer .root-node");
    if (rootNode) {
      rootNode.style.fontSize = "14px";
      rootNode.style.maxWidth = "260px";
      rootNode.style.whiteSpace = "normal";
      rootNode.style.padding = "6px 10px";
      rootNode.style.lineHeight = "1.4";
    }
  } catch (err) {
    console.error("🧠 マインドマップ生成エラー:", err);
    alert("ChatGPTによるマインドマップ生成に失敗しました。");
  }
}
