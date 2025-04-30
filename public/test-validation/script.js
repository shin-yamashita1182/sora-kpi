
const viewpointDefinitions = {
  "財務": "地域・企業が持続的に成長するための経済的成果や資源の最適化",
  "顧客": "住民・観光客・取引先など外部の満足度や信頼の向上",
  "業務プロセス": "地域や組織の中の業務やプロセスの質を高める取り組み",
  "学習と成長": "人材育成・知識共有・技術力強化など将来の成長に向けた基盤作り"
};


async function loadCategory(category) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  try {
    const response = await fetch("../mind_trigger_kankou.json");
    const data = await response.json();

    // ✅ 修正ポイント：「分類カテゴリ」に統一
    let filtered = data.filter(item => item["分類カテゴリ"] === category);

    if (filtered.length === 0) {
      container.innerHTML = `<p style="text-align: center; margin-top: 50px;">データがありません</p>`;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const header = document.createElement("div");
      header.className = "card-header";

      const tag = document.createElement("span");
      tag.className = "viewpoint-tag " + viewpointClass(item.視点);
      tag.innerText = item.視点;

      const desc = document.createElement("span");
      desc.className = "viewpoint-desc";
      const viewpointKey = item.視点.replace("の視点", "");
  desc.innerText = viewpointDefinitions[viewpointKey] || "";
  // "";  // 視点の補足解説は省略

      header.appendChild(tag);
      header.appendChild(desc);

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h2");
      title.innerText = item["戦略目標"]; // 表に出す戦略タイトル

      const detailButton = document.createElement("button");
      detailButton.className = "detail-button";
      detailButton.innerText = "🔎 詳細を見る";
      detailButton.onclick = function() {
        openModal(item["戦略目標"], item["施策／活動案"], item["KPI案"]);
      };

      const priorityButton = document.createElement("button");
      priorityButton.className = "add-priority-button";
      priorityButton.innerText = "＋ 優先リストに追加";
      priorityButton.onclick = function() {
        addToPriorityList(item);
      };

      body.appendChild(title);
      body.appendChild(detailButton);
      body.appendChild(priorityButton);

      card.appendChild(header);
      card.appendChild(body);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("JSON読み込みエラー:", error);
    container.innerHTML = `<p style="text-align: center; margin-top: 50px;">データ読み込みに失敗しました</p>`;
  }
}

function viewpointClass(label) {
  switch (label) {
    case "財務の視点": return "viewpoint-finance";
    case "顧客の視点": return "viewpoint-customer";
    case "内部プロセスの視点": return "viewpoint-process";
    case "学習と成長の視点": return "viewpoint-growth";
    default: return "";
  }
}

function openModal(title, content, kpi) {
  document.getElementById("modal-title").innerText = "戦略テーマ：" + title;
  document.getElementById("modal-content").innerText = content;
  document.getElementById("modal-kpi").innerText = "【KPI】" + (kpi ?? "設定なし");
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function addToPriorityList(item) {
  alert(`優先リストに追加しました：${item["戦略目標"]}`);
}

window.addEventListener("DOMContentLoaded", () => {
  loadCategory("観光型");
});
