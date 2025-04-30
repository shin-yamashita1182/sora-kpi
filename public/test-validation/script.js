let mindTriggerMaster = [];

const viewpointOrder = ["財務", "顧客", "業務プロセス", "学習と成長"];

// actor → 視点
function getViewpoint(actor) {
  switch (actor) {
    case "自治体":
    case "地域商社":
      return "財務";
    case "観光協会":
    case "宿泊業者":
    case "観光案内所":
      return "顧客";
    case "DMO":
    case "観光施設運営者":
      return "業務プロセス";
    case "商工会":
    case "教育機関":
    case "NPO":
    case "地域団体":
      return "学習と成長";
    default:
      return "財務";
  }
}

// 視点 → 注釈
function getViewpointNote(viewpoint) {
  switch (viewpoint) {
    case "財務": return "成果・収益・費用など数値的成果";
    case "顧客": return "顧客満足・信頼・関係性の強化";
    case "業務プロセス": return "内部改善・業務効率・品質管理";
    case "学習と成長": return "組織力・人材育成・知識の蓄積";
    default: return "";
  }
}

// 視点 → CSS色
function getViewpointClass(viewpoint) {
  switch (viewpoint) {
    case "財務": return "viewpoint-finance";
    case "顧客": return "viewpoint-customer";
    case "業務プロセス": return "viewpoint-process";
    case "学習と成長": return "viewpoint-growth";
    default: return "";
  }
}

// JSONロード（観光型）
async function loadCategory() {
  try {
    const res = await fetch("../../kankou_master.json");
    mindTriggerMaster = await res.json();
    renderCards();
  } catch (error) {
    console.error("読み込み失敗:", error);
  }
}

// カード描画（視点でソート済み）
function renderCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  const sorted = [...mindTriggerMaster].sort((a, b) => {
    const va = viewpointOrder.indexOf(getViewpoint(a.actor));
    const vb = viewpointOrder.indexOf(getViewpoint(b.actor));
    return va - vb;
  });

  sorted.forEach((item) => {
    const viewpoint = getViewpoint(item.actor);
    const note = getViewpointNote(viewpoint);
    const cls = getViewpointClass(viewpoint);

    const card = document.createElement("div");
    card.className = "card";

    // 視点タグ＋注釈
    const tagLine = document.createElement("div");
    tagLine.style.display = "flex";
    tagLine.style.alignItems = "center";
    tagLine.style.gap = "8px";

    const tag = document.createElement("div");
    tag.className = `viewpoint-tag ${cls}`;
    tag.textContent = viewpoint;

    const noteEl = document.createElement("div");
    noteEl.className = "viewpoint-desc";
    noteEl.textContent = note;

    tagLine.appendChild(tag);
    tagLine.appendChild(noteEl);
    card.appendChild(tagLine);

    // 戦略テーマ（概要）
    const overview = document.createElement("div");
    overview.className = "overview";
    overview.style.margin = "1rem 0";
    overview.style.fontWeight = "bold";
    overview.style.fontSize = "1rem";
    overview.textContent = item.overview;
    card.appendChild(overview);

    // ボタンエリア
    const btnArea = document.createElement("div");
    btnArea.style.display = "flex";
    btnArea.style.gap = "10px";

    // 詳細ボタン
    const detailBtn = document.createElement("button");
    detailBtn.className = "detail-button";
    detailBtn.textContent = "詳細を見る";
    detailBtn.onclick = () => openModal(item.title, item.overview, item.kpi);

    // 優先リストボタン
    const priorityBtn = document.createElement("button");
    priorityBtn.className = "priority-button";
    priorityBtn.textContent = "優先リストに追加";
    priorityBtn.onclick = () => {
      console.log("優先リスト追加:", item.overview);
      // TODO: 本番では localStorage か SORA連携
    };

    btnArea.appendChild(detailBtn);
    btnArea.appendChild(priorityBtn);
    card.appendChild(btnArea);

    container.appendChild(card);
  });
}

// モーダル
function openModal(title, overview, kpi) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-content").textContent = overview;
  document.getElementById("modal-kpi").textContent = kpi;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 初期読み込み
window.onload = () => {
  loadCategory();
};
