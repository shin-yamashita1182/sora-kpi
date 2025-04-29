async function loadCategory(category) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  try {
    const response = await fetch("../mind_trigger_kankou.json");
    const data = await response.json();

    let filtered = data.filter(item => item.分類 === category);

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
      tag.className = "viewpoint-tag " + viewpointClass(item.視点ラベル);
      tag.innerText = item.視点ラベル;

      const desc = document.createElement("span");
      desc.className = "viewpoint-desc";
      desc.innerText = item.視点解説;

      header.appendChild(tag);
      header.appendChild(desc);

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h2");
      title.innerText = item.施策名;

      const detailButton = document.createElement("button");
      detailButton.className = "detail-button";
      detailButton.innerText = "🔎 詳細を見る";
      detailButton.onclick = function() {
        openModal(item.施策名, item.説明, item.KPI);
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
    case "財務視点": return "viewpoint-finance";
    case "顧客視点": return "viewpoint-customer";
    case "業務プロセス視点": return "viewpoint-process";
    case "学習・成長視点": return "viewpoint-growth";
    default: return "";
  }
}

function openModal(title, content, kpi) {
  document.getElementById("modal-title").innerText = "戦略テーマ：" + title;
  document.getElementById("modal-content").innerText = content;
  document.getElementById("modal-kpi").innerText = "【KPI】" + kpi;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 仮：優先リスト追加
function addToPriorityList(item) {
  alert(`優先リストに追加しました：${item.施策名}`);
}

window.addEventListener("DOMContentLoaded", () => {
  loadCategory("観光型");
});
