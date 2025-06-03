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

// ✅ 追加：履歴保存用のsora_キーも保存する処理をグローバル関数に定義
  window.saveSoraHistory = function(sessionData) {
    const region = sessionData?.region || "未設定地域";
    localStorage.setItem(`sora_${region}`, JSON.stringify(sessionData));
    console.log("✅ sora履歴保存完了:", `sora_${region}`);
  };

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
        toggleNexcoBtn.textContent = "📡 分析中…";

        const prompt = `
あなたは地域政策アドバイザーAIです。

以下の地域名をもとに、「地域インフラと課題の詳細分析」を行ってください。
交通・物流・生活施設・観光導線・地域間連携などの基本項目に加えて、
防災・医療・教育・ICT通信なども含めて、地域生活全体を支えるインフラ構造の観点から、
以下の形式で、課題とその背景をそれぞれ2文程度ずつで簡潔に示してください。

【出力形式（例）】
- 交通：◯◯◯。◯◯◯。
- 物流：◯◯◯。◯◯◯。
- 施設：◯◯◯。◯◯◯。
- 導線：◯◯◯。◯◯◯。
- 連携：◯◯◯。◯◯◯。
- 防災：◯◯◯。◯◯◯。
- 医療：◯◯◯。◯◯◯。
- 教育：◯◯◯。◯◯◯。

【地域名】：${region}
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
            console.error("インフラ分析取得失敗:", err);
            nexcoInfoList.innerHTML = "<li>情報取得に失敗しました。</li>";
          })
          .finally(() => {
            toggleNexcoBtn.textContent = "インフラ分析を表示";
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
    toggleNexcoBtn.textContent = isAccordionOpen ? "インフラ分析を閉じる" : "インフラ分析を表示";
    nexcoStatus.textContent = isAccordionOpen ? "インフラ分析結果を表示中" : "インフラ分析を非表示にしました";
  }

  // 💬 ChatGPT連携：課題抽出
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async () => {
      const region = regionInput.value.trim();
      const theme = noteInput.value.trim();
      const selectedCategory = document.getElementById("categorySelect")?.value || "（分類未設定）";

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

const categorySelect = document.getElementById("categorySelect");
     
const promptTemplate = `
【背景説明】：
この地域は「${selectedCategory}」に分類されており、その特性上、特有の課題が存在すると想定されます。
たとえば、交通アクセスの制限、産業基盤の脆弱性、人口構成の偏り、インフラの制約など、分類に起因する地域特性を十分に考慮してください。

分析にあたっては、以下の観点を参考に、多面的かつ実用性の高い課題抽出を行ってください：

- 課題の背後にある「構造的な要因（制度・歴史・地理など）」を意識してください  
- 課題が影響を与える「対象層（高齢者・若者・事業者・観光客など）」も明記することが望ましいです  
- 類似地域と比較して顕著な弱点・ギャップがあれば積極的に言及してください  
- 表層的ではなく、実際の行政・住民・事業者がアクション可能な「戦略的課題」として表現してください  

また、課題数が少なくなりすぎないよう、**最低でも10件以上**を目安に出力してください。  
1つの課題は**1文〜2文で簡潔に**、しかし**中身の深い戦略的表現**を意識してください。

---

【出力形式について（厳守）】

- 課題は **必ず以下のような形式で出力してください**：

課題【1】：◯◯◯  
課題【2】：◯◯◯  
課題【3】：◯◯◯  
...  
課題【10】：◯◯◯

- 「課題」「全角の【数字】」「全角のコロン（：）」を**省略せず**明示してください  
- コードブロック（\`\`\`など）や説明文は**一切出力しないでください**

---

【参考資料が空欄の場合】

- 地域名とテーマから合理的に想定し、住民や行政が抱えていそうな課題を抽出してください  
- その場合も、**形式は必ず「課題【1】：」に統一してください**

---

【地域名】：${region}  
【テーマ】：${theme}  
【分類】：${selectedCategory}（この地域は ${selectedCategory} に該当し、その特性を踏まえた課題整理が求められます）
【参考資料】：  
${uploadedTextContent || "（参考資料なし）"}
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
const matches = [...canvasText.matchAll(/(?:課題)?[【\(]?\d+[】\)]?[：:]\s*(.+)/g)];
window.latestExtractedTasks = matches.map(m => m[1].trim());
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
    "例：観光需要回復のための収益戦略を検討する",
    "例：インフラ更新計画と優先順位づけの仕組みを構築する",
    "例：職員定着を促すキャリア形成支援策を考える",
    "例：移住制度の周知・利用促進に向けた改善策を検討",
    "例：避難所整備の加速化と計画再構築の方法を考える"
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


 // 🧠 一括マインドマップモーダル出力（旧UI・現在未使用）
// if (generateAllBtn) {
//   generateAllBtn.addEventListener("click", () => {
//     const blocks = document.querySelectorAll(".thinking-block");
//     let output = "<ul style='list-style:none;padding-left:0;'>";
//     blocks.forEach((block) => {
//       const task = block.querySelector("p").innerText;
//       const opinion = block.querySelector("textarea").value.trim();
//       output += `<li style='margin-bottom:10px;'>🟢 <strong>${task}</strong><br>考察: ${opinion || "（未記入）"}</li>`;
//     });
//     output += "</ul><p style='margin-top:1em;'>※ChatGPT連携による対策提案予定</p>";
//     mindMapContent.innerHTML = output;
//     mindMapModal.classList.remove("hidden");
//   });
// }

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
      alert("分析対策ボタンを押し、少なくとも1つの考察を入力してください。");
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
  alert("⚠️ マインドマップの出力が途中で切れてしまったようです。\n通信や容量の影響でまれに発生します。\nもう一度『マインドマップの生成』を押して再試行してください。");
  console.error("不完全なJSON:", cleanedJson);
  generateMindMapGPTBtn.disabled = false;
  generateMindMapGPTBtn.textContent = "マインドマップの生成";
  return; // ← これが絶対に必要！
}

// ✅ JSON構文チェックと保存・ウィンドウオープン
  console.log("[ChatGPT返答 cleanedJson]:", cleanedJson);
      
  const cleanedText = cleanedJson
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();
const parsed = JSON.parse(cleanedText); // ← GPTから来たマインドマップJSON
localStorage.setItem("latestMindMapData", JSON.stringify(parsed));

const selectedSessionKey = localStorage.getItem("selectedSessionKey"); // ✅ セッションキー取得

window.mindMapGenerated = true;

// ✅ セッション履歴として localStorage に保存
const sessionKey = `session_${Date.now()}`;

// ✅ 1. 先に selectedSessionKey を固定！
localStorage.setItem("selectedSessionKey", sessionKey);
      
const mapDOM = document.getElementById("miniMap");

if (mapDOM) {
  try {
    const canvas = await html2canvas(mapDOM);
    const imageData = canvas.toDataURL("image/png");
    
    const nexcoText = document.getElementById("nexcoInfoList")?.innerText || "";
    const selectedCategory = document.getElementById("categorySelect")?.value || "分類未設定"; // ✅ 追加

    const sessionData = {
      region,
      theme,
      category: selectedCategory, // ✅ 地域分類を保存
      tasks: window.latestExtractedTasks || [],
      insight: [...document.querySelectorAll(".thinking-block textarea")].map(t => t.value.trim()),
      mindmapData: parsed,
      mapImageData: imageData, // ✅ ←ここで追加！！
      nexcoInfo: nexcoText, // ← NEXCO情報
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    console.log("✅ セッション保存完了:", sessionKey);

    // ✅ この下に追加
saveSoraHistory(sessionData);

    alert("✅ セッションが保存されました。\n履歴に反映するにはページを再読み込みしてください。");

    saveMindmapToSession(parsed);

    setTimeout(() => {
      window.open(`mindmap_viewer.html?sessionKey=${sessionKey}`, "_blank");
    }, 200);
    
  } catch (mapErr) {
    console.error("❌ 地図のキャプチャに失敗しました:", mapErr);
    alert("⚠️ 地図画像の保存に失敗しました（セッションには他の情報のみ保存）。");

    const sessionData = {
      region,
      theme,
      category: selectedCategory, // ✅ 地域分類を保存
      tasks: window.latestExtractedTasks || [],
      insight: [...document.querySelectorAll(".thinking-block textarea")].map(t => t.value.trim()),
      mindmapData: parsed,
      mapImageData: "",
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    console.log("✅ セッション保存完了（地図なし）:", sessionKey);

    // ✅ この下に追加
saveSoraHistory(sessionData);

    
    saveMindmapToSession(parsed);

    setTimeout(() => {
      window.open(`mindmap_viewer.html?sessionKey=${sessionKey}`, "_blank");
    }, 200);
  }
} else {
  console.warn("⚠️ 地図DOM（#miniMap）が見つかりませんでした");

  const nexcoText = document.getElementById("nexcoInfoList")?.innerText || ""; // ✅ 追加
  const selectedCategory = document.getElementById("categorySelect")?.value || "分類未設定"; // ✅ 追加

  const sessionData = {
    region,
    theme,
    category: selectedCategory, // ✅ 地域分類を保存
    tasks: window.latestExtractedTasks || [],
    insight: [...document.querySelectorAll(".thinking-block textarea")].map(t => t.value.trim()),
    mindmapData: parsed,
    mapImageData: "",
    nexcoInfo: nexcoText, // ✅ ここにも追加
    timestamp: new Date().toISOString()
  };

  
  localStorage.setItem(sessionKey, JSON.stringify(sessionData));
  console.log("✅ セッション保存完了（地図DOMなし）:", sessionKey);

  // ✅ この下に追加
saveSoraHistory(sessionData);

alert("✅ セッションが保存されました（地図画像なし）");

  saveMindmapToSession(parsed);

  setTimeout(() => {
    window.open(`mindmap_viewer.html?sessionKey=${sessionKey}`, "_blank");
  }, 200);
}

      
} catch (err) {
  console.error("⚠️ マインドマップ生成中にエラー:", err);
  alert("マインドマップ生成に失敗しました。");
} finally {
  generateMindMapGPTBtn.disabled = false;
  generateMindMapGPTBtn.textContent = "マインドマップの生成";
}
});
} // ✅ ←これが抜けていた！（if 文の閉じ）

// const savePrintBtn = document.getElementById("savePrintBtn");
// if (savePrintBtn) {
//   savePrintBtn.addEventListener("click", () => {
//     try {
//       const sessionData = {
//         region: document.getElementById("regionName").value || "未設定",
//         theme: document.getElementById("userNote").value || "未設定",
//         tasks: window.latestExtractedTasks || [],
//         insight: document.getElementById("userInsight")?.value || "未入力",
//         mindmapData: JSON.parse(localStorage.getItem("latestMindMapData")) || {},
//         timestamp: new Date().toISOString()
//       };
//       localStorage.setItem("session_001", JSON.stringify(sessionData));
//       window.open("/print_view.html", "_blank");
//     } catch (e) {
//       alert("セッション保存に失敗しました。");
//       console.error(e);
//     }
//   });
// }

// ✅ グローバル定義：セッション描画関数（ゴミ箱付き）
window.renderSessionHistory = function () {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = "";

  const sessionKeys = Object.keys(localStorage)
    .filter(k => k.startsWith("session_") && !k.startsWith("session_selected"))
    .sort((a, b) => Number(b.replace("session_", "")) - Number(a.replace("session_", "")))
    .slice(0, 20);

  sessionKeys.forEach((key) => {
    let session;
    try {
      session = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.warn("⚠️ JSON形式エラー:", key, e);
      return;
    }

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "0.5rem";

    const label = document.createElement("span");
    label.textContent = `${session.region || "（地域未設定）"} × ${session.theme || "（テーマ未設定）"}`;
    label.style.cursor = "pointer";
    label.style.flexGrow = "1";
    label.style.color = "#0077cc";
    label.style.textDecoration = "underline";

    label.onclick = () => {
      localStorage.setItem("selectedSessionKey", key);
      window.open("print_view.html", "_blank");
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑";
    delBtn.title = "この履歴を削除";
    delBtn.style.cursor = "pointer";
    delBtn.style.border = "none";
    delBtn.style.background = "transparent";
    delBtn.style.color = "#cc0000";
    delBtn.style.fontSize = "16px";

    delBtn.onclick = () => {
      if (confirm("この履歴を削除しますか？")) {
        localStorage.removeItem(key);
        renderSessionHistory();
      }
    };

    li.appendChild(label);
    li.appendChild(delBtn);
    historyList.appendChild(li);
  });
};


window.addEventListener("load", () => {
  renderSessionHistory();
});
// ✅ DOMContentLoadedの外側に貼ってください（例えば末尾近く）

function saveMindmapToSession(mindmapData) {
  const key = localStorage.getItem("selectedSessionKey");
  if (!key || !localStorage.getItem(key)) {
    alert("セッションが未確定のため保存できません。");
    return;
  }

  try {
    const session = JSON.parse(localStorage.getItem(key));

    session.mindmapData = mindmapData;

    // ✅ 考察欄を格納（通常は insight として配列で保存）
    const insights = [...document.querySelectorAll(".thinking-block textarea")]
      .map(t => t.value.trim())
      .filter(v => v);
    if (insights.length > 0) {
      session.insight = insights;
    }

    // ✅ 🔍 デバッグログ：保存直前のセッション確認
    console.log("💾 保存直前のセッション内容:", session);  // ← 追加②
    
    localStorage.setItem(key, JSON.stringify(session));
    console.log("✅ mindmapData + insight をセッションに保存:", key);
  } catch (err) {
    console.error("❌ セッション保存失敗:", err);
  }
}
// ✅ ここに追加してください！（DOMContentLoadedの外！）
function saveSoraHistory(sessionData) {
  const region = sessionData?.region || "未設定地域";
  try {
    localStorage.setItem(`sora_${region}`, JSON.stringify(sessionData));
    console.log(`📦 sora_${region} に履歴保存完了`);
  } catch (e) {
    console.error("❌ sora履歴の保存に失敗しました:", e);
  }
}
});
