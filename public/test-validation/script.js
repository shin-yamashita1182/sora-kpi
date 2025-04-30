// 昨日の完成版 script.js にミニ注釈のみ追加した最終版

async function loadCategory(category) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  try {
    const response = await fetch("../mind_trigger_kankou.json");
    const data = await response.json();

    let filtered = data.filter(item => item["分類カテゴリ"] === category);

    if (filtered.length === 0) {
      container.innerHTML = `<p style="text-align: center; margin-top: 50px;">データがありません</p>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      const viewpoint = item["視点"] || "";
      const tag = document.createElement("div");
      tag.className = `viewpoint-tag ${getViewpointClass(viewpoint)}`;
      tag.textContent = viewpoint;

      const note = document.createElement("span");
      note.className = "viewpoint-desc";
      note.textContent = getViewpointNote(viewpoint);

      const tagRow = document.createElement("div");
      tagRow.style.display = "flex";
      tagRow.style.alignItems = "center";
      tagRow.style.gap = "8px";
      tagRow.appendChild(tag);
      tagRow.appendChild(note);
      card.appendChild(tagRow);

      const title = document.createElement("h2");
      title.textContent = item["戦略目標"] || "";
      card.appendChild(title);

      const btnArea = document.createElement("div");
      btnArea.className = "button-area";

      const detailBtn = document.createElement("button");
      detailBtn.className = "detail-button";
      detailBtn.textContent = "詳細を見る";
      detailBtn.onclick = () => openModal(item["戦略目標"], item["施策／活動案"], item["KPI案"]);

      const priorityBtn = document.createElement("button");
      priorityBtn.className = "priority-button";
      priorityBtn.textContent = "優先リストに追加";
      priorityBtn.onclick = () => {
        console.log("優先追加:", item["戦略目標"]);
      };

      btnArea.appendChild(detailBtn);
      btnArea.appendChild(priorityBtn);
      card.appendChild(btnArea);

      container.appendChild(card);
    });
  } catch (error) {
    console.error("読み込み失敗:", error);
  }
}

function getViewpointClass(viewpoint) {
  switch (viewpoint) {
    case "財務": return "viewpoint-finance";
    case "顧客": return "viewpoint-customer";
    case "業務プロセス": return "viewpoint-process";
    case "学習と成長": return "viewpoint-growth";
    default: return "";
  }
}

function getViewpointNote(viewpoint) {
  switch (viewpoint) {
    case "財務": return "成果・収益・費用など数値的成果";
    case "顧客": return "顧客満足・信頼・関係性の強化";
    case "業務プロセス": return "内部改善・業務効率・品質管理";
    case "学習と成長": return "組織力・人材育成・知識の蓄積";
    default: return "";
  }
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
  loadCategory("観光型");
};

