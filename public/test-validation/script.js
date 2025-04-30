let mindTriggerMaster = {};

// 分類名 → ファイル名コードの対応表（日本語表示用）
const categoryMap = {
  "観光型": "kankou",
  "離島型": "ritou",
  "中山間地域型": "chusankan",
  "都市型": "toshi",
  "高齢化重点地域型": "koureika",
  "子育て・定住型": "kosodate_teijuu",
  "移住促進重点型": "ijuu_sokushin",
  "観光×農業ハイブリッド型": "kankou_nougyou_hybrid",
  "防災・災害対策型": "bousai",
  "デジタル活用先進地域型": "digital_senjin"
};

// カテゴリ選択時に該当JSONを読み込み
async function loadCategory(japaneseName) {
  const code = categoryMap[japaneseName];
  if (!code) {
    console.error(`不明な分類名: ${japaneseName}`);
    return;
  }
  try {
    const res = await fetch(`../../mind_trigger_${code}.json`);
    mindTriggerMaster = await res.json();
    renderCards();
  } catch (error) {
    console.error("マスター読み込み失敗:", error);
  }
}

// カード描画処理
function renderCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // 一旦全消し

  for (const [key, data] of Object.entries(mindTriggerMaster)) {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = data.戦略名;

    const viewpoint = document.createElement("div");
    viewpoint.className = "viewpoint-tag " + getViewpointClass(data.視点);
    viewpoint.textContent = data.視点;

    const description = document.createElement("div");
    description.className = "viewpoint-desc";
    description.textContent = key;

    const buttonArea = document.createElement("div");

    const detailBtn = document.createElement("button");
    detailBtn.className = "detail-button";
    detailBtn.textContent = "詳細を見る";
    detailBtn.onclick = () => openModal(data.戦略名, key, data.施策名 || "");

    buttonArea.appendChild(detailBtn);

    card.appendChild(title);
    card.appendChild(viewpoint);
    card.appendChild(description);
    card.appendChild(buttonArea);

    container.appendChild(card);
  }
}

// モーダル表示
function openModal(title, content, kpiText) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-content").textContent = content;
  document.getElementById("modal-kpi").textContent = kpiText;
  document.getElementById("modal").style.display = "block";
}

// モーダル閉じる
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 視点ごとの色クラス
function getViewpointClass(viewpoint) {
  switch (viewpoint) {
    case "財務": return "viewpoint-finance";
    case "顧客": return "viewpoint-customer";
    case "業務プロセス": return "viewpoint-process";
    case "学習と成長": return "viewpoint-growth";
    default: return "";
  }
}

// 初期表示（観光型）
window.onload = () => {
  loadCategory("観光型");
};
