// --- 分類タグ（識別子） ---
const categoryButtons = [
  "観光型", "離島型", "中山間地域型", "デジタル活用先進地域型",
  "観光×農業ハイブリッド型", "移住促進重点型", "子育て・定住型",
  "高齢化重点地域型", "都市型", "防災・災害対策型",
  "CoreMaster" // ✅ 新タグ
];

// --- 表示用ラベル（識別子 → 日本語ラベル） ---
const categoryDisplayNames = {
  "観光型": "観光型",
  "離島型": "離島型",
  "中山間地域型": "中山間型",
  "デジタル活用先進地域型": "デジタル型",
  "観光×農業ハイブリッド型": "ハイブリッド型",
  "移住促進重点型": "移住型",
  "子育て・定住型": "子育て型",
  "高齢化重点地域型": "高齢化型",
  "都市型": "都市型",
  "防災・災害対策型": "防災型",
  "CoreMaster": "コアマスター" // ✅ 表示名変換
};

// --- タグボタン生成 ---
categoryButtons.forEach(category => {
  const button = document.createElement("button");
  button.innerText = categoryDisplayNames[category] || category;
  button.classList.add("category-button");
  button.onclick = () => loadCategory(category);
  document.getElementById("categoryContainer").appendChild(button);
});

// --- カテゴリごとのJSON読み込み処理 ---
function loadCategory(category) {
  let jsonFile;

  switch (category) {
    case "観光型": jsonFile = "mind_trigger_kankou.json"; break;
    case "離島型": jsonFile = "mind_trigger_ritou.json"; break;
    case "中山間地域型": jsonFile = "mind_trigger_chusankan.json"; break;
    case "デジタル活用先進地域型": jsonFile = "mind_trigger_digital.json"; break;
    case "観光×農業ハイブリッド型": jsonFile = "mind_trigger_hybrid.json"; break;
    case "移住促進重点型": jsonFile = "mind_trigger_iju.json"; break;
    case "子育て・定住型": jsonFile = "mind_trigger_kosodate.json"; break;
    case "高齢化重点地域型": jsonFile = "mind_trigger_koureika.json"; break;
    case "都市型": jsonFile = "mind_trigger_toshi.json"; break;
    case "防災・災害対策型": jsonFile = "mind_trigger_bousai.json"; break;
    case "CoreMaster": jsonFile = "mind_trigger_core_master.json"; break; // ✅ コアマスター
    default: return;
  }

  fetch(`./json/${jsonFile}`)
    .then(res => res.json())
    .then(data => {
      renderCards(data);
    })
    .catch(err => console.error("JSON読み込みエラー", err));
}

// --- カード描画ロジック ---
function renderCards(data) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = ""; // 表示クリア

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("trigger-card");

    const category = document.createElement("div");
    category.classList.add("card-category");
    category.innerText = item.分類カテゴリ || "";

    const view = document.createElement("div");
    view.classList.add("card-view");
    view.innerText = item.視点 || "";

    const strategy = document.createElement("div");
    strategy.classList.add("card-strategy");
    strategy.innerText = item.戦略目標 || "";

    const action = document.createElement("div");
    action.classList.add("card-action");
    action.innerText = item["施策／活動案"] || "";

    const kpi = document.createElement("div");
    kpi.classList.add("card-kpi");
    kpi.innerText = item.KPI案 || "";

    card.appendChild(category);
    card.appendChild(view);
    card.appendChild(strategy);
    card.appendChild(action);
    card.appendChild(kpi);
    container.appendChild(card);
  });
}
