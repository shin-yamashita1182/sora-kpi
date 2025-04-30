// 最終版 script.js（観光型マスター表示 + ミニ注釈追加 + ボタン修正）

let mindTriggerMaster = [];

// ノートン＆キャプランに基づく注釈
function getViewpointNote(viewpoint) {
  switch (viewpoint) {
    case "財務": return "成果・収益・費用など数値的成果";
    case "顧客": return "顧客満足・信頼・関係性の強化";
    case "業務プロセス": return "内部改善・業務効率・品質管理";
    case "学習と成長": return "組織力・人材育成・知識の蓄積";
    default: return "";
  }
}

// 視点に応じた色クラス
function getViewpointClass(viewpoint) {
  switch (viewpoint) {
    case "財務": return "viewpoint-finance";
    case "顧客": return "viewpoint-customer";
    case "業務プロセス": return "viewpoint-process";
    case "学習と成長": return "viewpoint-growth";
    default: return "";
  }
}

async function loadCategory() {
  try {
    const response = await fetch("../mind_trigger_kankou.json");
    const data = await response.json();
    mindTriggerMaster = data;
    renderCards();
  } catch (error) {
    console.error("データの読み込みに失敗しました", error);
  }
}

function renderCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  mindTriggerMaster.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const viewpoint = item["視点"];
    const viewpointTag = document.createElement("div");
    viewpointTag.className = `viewpoint-tag ${getViewpointClass(viewpoint)}`;
    viewpointTag.textContent = viewpoint;

    const viewpointNote = document.createElement("span");
    viewpointNote.className = "viewpoint-desc";
    viewpointNote.textContent = getViewpointNote(viewpoint);

    const tagRow = document.createElement("div");
    tagRow.style.display = "flex";
    tagRow.style.alignItems = "center";
    tagRow.style.gap = "8px";
    tagRow.appendChild(viewpointTag);
    tagRow.appendChild(viewpointNote);
    card.appendChild(tagRow);

    const overview = document.createElement("div");
    overview.className = "overview";
    overview.textContent = item["戦略目標"];
    card.appendChild(overview);

    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.gap = "10px";

    const detailButton = document.createElement("button");
    detailButton.className = "detail-button";
    detailButton.textContent = "詳細を見る";
    detailButton.onclick = () => openModal(item["戦略目標"], item["施策／活動案"], item["KPI案"]);

    const priorityButton = document.createElement("button");
    priorityButton.className = "priority-button";
    priorityButton.textContent = "優先リストに追加";
    priorityButton.onclick = () => {
      console.log("優先追加:", item["戦略目標"]);
      // TODO: 優先リスト保存処理
    };

    buttonRow.appendChild(detailButton);
    buttonRow.appendChild(priorityButton);
    card.appendChild(buttonRow);

    container.appendChild(card);
  });
}

function openModal(title, content, kpi) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-content").textContent = content;
  document.getElementById("modal-kpi").textContent = kpi;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

window.onload = () => {
  loadCategory();
};
