// script_coremaster.js

// ✅ CoreMasterベースの戦略カードを描画し、モーダル詳細＆優先リスト連動まで管理

document.addEventListener("DOMContentLoaded", () => {
  fetch("coremaster_demo_20.json")
    .then((res) => res.json())
    .then((data) => {
      renderStrategyCards(data);
    });
});

function renderStrategyCards(cards) {
  const container = document.getElementById("resultsContainer");
  if (!container) return;
  container.innerHTML = "";

  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = card.strategy;

    const kpi = document.createElement("p");
    kpi.innerHTML = `<strong>KPI:</strong> ${card.kpi}`;

    const detailBtn = document.createElement("button");
    detailBtn.className = "btn btn-detail";
    detailBtn.textContent = "詳細";
    detailBtn.onclick = () => openDetailModal(card);

    div.appendChild(title);
    div.appendChild(kpi);
    div.appendChild(detailBtn);
    container.appendChild(div);
  });
}

// ✅ 詳細モーダル表示
function openDetailModal(card) {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  modalBody.innerHTML = `
    <h2>${card.strategy}</h2>
    <p><strong>施策概要:</strong> ${card.policy}</p>
    <p><strong>目標KPI:</strong> ${card.kpi}</p>
    <p><strong>分類視点:</strong> ${card.viewpoint}</p>
    <p><strong>注釈:</strong> ${card.note}</p>
    <button id="addToCompare" class="btn btn-add">比較リストに追加</button>
  `;

  modal.style.display = "block";

  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  document.getElementById("addToCompare").onclick = () => {
    addToCompareList(card);
    modal.style.display = "none";
  };
}

// ✅ 優先リストにカード追加
function addToCompareList(card) {
  const container = document.getElementById("compareListContainer");
  const div = document.createElement("div");
  div.className = "card";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = card.strategy;

  const kpi = document.createElement("p");
  kpi.innerHTML = `<strong>KPI:</strong> ${card.kpi}`;

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn-remove";
  removeBtn.textContent = "削除";
  removeBtn.onclick = () => div.remove();

  div.appendChild(title);
  div.appendChild(kpi);
  div.appendChild(removeBtn);
  container.appendChild(div);
}
