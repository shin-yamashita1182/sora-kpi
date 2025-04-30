
const viewpointDefinitions = {
  "財務": "地域・企業が持続的に成長するための経済的成果や資源の最適化",
  "顧客": "住民・観光客・取引先など外部の満足度や信頼の向上",
  "業務プロセス": "地域や組織の中の業務やプロセスの質を高める取り組み",
  "学習と成長": "人材育成・知識共有・技術力強化など将来の成長に向けた基盤作り"
};

function loadCategory(category) {
  const fileMap = {
    "観光型": "mind_trigger_kankou.json",
    "離島型": "mind_trigger_ritou.json",
    "中山間地域型": "mind_trigger_chusankan.json",
    "都市型": "mind_trigger_toshi.json",
    "高齢化重点地域型": "mind_trigger_koureika.json",
    "子育て・定住型": "mind_trigger_kosodate.json",
    "移住促進重点型": "mind_trigger_iju.json",
    "観光×農業ハイブリッド型": "mind_trigger_hybrid.json",
    "防災・災害対策型": "mind_trigger_bousai.json",
    "デジタル活用先進地域型": "mind_trigger_digital.json"
  };

  const fileName = fileMap[category];

  if (!fileName) {
    console.error("不明なカテゴリ:", category);
    return;
  }

  fetch(fileName)
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(item => item["分類カテゴリ"] === category);
      displayCards(filtered);
    })
    .catch(error => {
      console.error("JSON読み込みエラー:", error);
    });
}

function displayCards(filtered) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

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
    const viewpointKey = item.視点.replace("の視点", "");
    desc.innerText = viewpointDefinitions[viewpointKey] || "";

    header.appendChild(tag);
    header.appendChild(desc);

    const title = document.createElement("h2");
    title.innerText = item["戦略目標"];

    const detailButton = document.createElement("button");
    detailButton.className = "detail-button";
    detailButton.innerText = "詳細を見る";
    detailButton.onclick = () => {
      openModal(item["戦略目標"], item["施策／活動案"], item["KPI案"]);
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
}

function viewpointClass(viewpoint) {
  switch (viewpoint) {
    case "財務の視点":
      return "finance";
    case "顧客の視点":
      return "customer";
    case "業務プロセスの視点":
      return "process";
    case "学習と成長の視点":
      return "growth";
    default:
      return "";
  }
}
