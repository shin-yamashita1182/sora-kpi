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
      tag.className = "viewpoint-tag viewpoint-" + viewpointClass(item.視点);
      tag.innerText = item.視点;

      const desc = document.createElement("span");
      desc.className = "viewpoint-desc";
      desc.innerText = viewpointDefinitions[item.視点] || "";

      header.appendChild(tag);
      header.appendChild(desc);

      const title = document.createElement("h2");
      title.innerText = item.戦略名 || "戦略名なし";

      const detailButton = document.createElement("button");
      detailButton.className = "detail-button";
      detailButton.innerText = "詳細を見る";
      detailButton.onclick = () => {
        openModal(item.戦略名, item.施策名, item.KPI);
      };

      const priorityButton = document.createElement("button");
      priorityButton.className = "add-priority-button";
      priorityButton.innerText = "優先リストへ追加";
      priorityButton.onclick = () => {
        addToPriorityList(item);
      };

      card.appendChild(header);
      card.appendChild(title);
      card.appendChild(detailButton);
      card.appendChild(priorityButton);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("データの読み込みエラー:", error);
  }
}

function viewpointClass(viewpoint) {
  switch (viewpoint) {
    case "財務":
      return "finance";
    case "顧客":
      return "customer";
    case "業務プロセス":
      return "process";
    case "学習と成長":
      return "growth";
    default:
      return "";
  }
}
