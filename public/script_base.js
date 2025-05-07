// ✅ グローバル定義（script_base.js 最上部などに追加）
window.mindMapGenerated = false;
// ✅ 最上部（DOMContentLoadedの外）に追記
window.latestExtractedTasks = [];
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
それぞれ住民や行政関係者が読んでも理解しやすいよう、説明や注釈文は一切書かず1文または2文程度で簡潔に表現してください。

参考資料が空欄の場合は、地域名やテーマから合理的に推定して課題を出してください。
ただし、その場合でも説明や注釈文は一切書かず、課題【1】〜【10】のみを出力してください。

【地域名】：${region}
【テーマ】：${theme}
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
const matches = [...canvasText.matchAll(/課題[【\(]?\d+[】\)]?[：:]\s*(.+)/g)];
window.latestExtractedTasks = matches.map(m => m[1].trim()); // ← 修正ポイント
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
    return;
  }

  if (isThinkingVisible) {
    // 一度展開されたら非表示にせずにスキップするだけ
    return;
  }

  thinkingContainer.innerHTML = "";
  const tasks = [
    "観光需要回復のための収益戦略を検討する",
    "インフラ更新計画と優先順位づけの仕組みを構築する",
    "職員定着を促すキャリア形成支援策を考える",
    "移住制度の周知・利用促進に向けた改善策を検討",
    "避難所整備の加速化と計画再構築の方法を考える"
  ];

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
    if (window.mindMapGenerated) {
      alert("すでにマインドマップは生成されています。ページを更新するか、内容を変更してください。");
      return;
    }

    const region = regionInput.value.trim();
    const theme = noteInput.value.trim();

    console.log("region:", region);
    console.log("theme:", theme);
    console.log("latestExtractedTasks:", latestExtractedTasks);
    console.log("length:", latestExtractedTasks.length);

    if (!region || !theme || window.latestExtractedTasks.length !== 10) {
      alert("地域名・テーマ・課題が不足しています。課題抽出を先に行ってください。");
      return;
    }

    const hasAnyOpinion = [...document.querySelectorAll(".thinking-block textarea")]
      .some(textarea => textarea.value.trim().length > 0);
    if (!hasAnyOpinion) {
      alert("少なくとも1つの考察を入力してください。");
      return;
    }

    generateMindMapGPTBtn.disabled = true;
    generateMindMapGPTBtn.textContent = "マインドマップ生成中…";

    try {
      let combinedText = `【地域名】：${region}\n【テーマ】：${theme}\n\n以下は抽出された課題です。\n`;
      latestExtractedTasks.forEach((task, i) => {
        combinedText += `【${i + 1}】${task}\n`;
      });

      combinedText += `\n以下は住民・関係者からの考察です（任意）：\n`;
      document.querySelectorAll(".thinking-block textarea").forEach((textarea) => {
        const opinion = textarea.value.trim();
        if (opinion) combinedText += `・${opinion}\n`;
      });

      const prompt = `
以下は、地域課題と住民の考察です。
中心テーマを「${region}：${theme}」として、MindElixir.js形式（topic, children）で放射状マインドマップ構造を作成してください。

▼条件（厳守）：
- 出力はJSONオブジェクトのみ（構文エラーなし）
- コードブロック（\`\`\` や \`\`\`json）は一切禁止
- 文字列はクオーテーションで正しく囲む
- topic / children 構造、最大3階層
- 各childrenは2つ以内
- 出力は **2000文字以内**
- 最後の } または ] を**必ず閉じる**

【課題】:
${window.latestExtractedTasks.map((task, i) => `【${i + 1}】${task}`).join("\n")}

【住民の考察】:
${[...document.querySelectorAll(".thinking-block textarea")]
  .map(t => "・" + t.value.trim())
  .filter(line => line.length > 1)
  .join("\n")}
`;

      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      const jsonText = data.result?.trim();
      console.log("=== ChatGPT生の出力 ===");
      console.log(jsonText);

      const cleanedJson = jsonText.replace(/^```json\s*|\s*```$/g, "").trim();

// ✅ JSON末尾の検査と try-catch を構文的に完全に分離
if (!cleanedJson.endsWith("}") && !cleanedJson.endsWith("}]")) {
  alert("ChatGPTからのJSON出力が不完全です（閉じカッコが欠落しています）。再試行してください。");
  console.error("不完全なJSON:", cleanedJson);
  generateMindMapGPTBtn.disabled = false;
  generateMindMapGPTBtn.textContent = "マインドマップの生成";
  return; // ← これが絶対に必要！
}

// ✅ JSON構文チェックと保存・ウィンドウオープン
  console.log("🧠 ChatGPT返答（cleanedJson）:", cleanedJson); // ←これを追加！
      
  const cleanedText = cleanedJson
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();
  const parsed = JSON.parse(cleanedText); // ← 🔥 こっちを使う！絶対！
  localStorage.setItem("latestMindMapData", JSON.stringify(parsed));
  window.open("mindmap_viewer.html", "_blank");
  window.mindMapGenerated = true;
} catch (err) {
  console.error("⚠️ マインドマップ生成中にエラー:", err);
  alert("マインドマップ生成に失敗しました。");
} finally {
  generateMindMapGPTBtn.disabled = false;
  generateMindMapGPTBtn.textContent = "マインドマップの生成";
}
});
} // ✅ ←これが抜けていた！（if 文の閉じ）
}); // ✅ DOMContentLoaded の終了
