
function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const viewpointClass = {
    "財務の視点": "viewpoint-finance",
    "顧客の視点": "viewpoint-customer",
    "内部プロセスの視点": "viewpoint-process",
    "学習と成長の視点": "viewpoint-growth"
  }[item.viewpoint] || "viewpoint-default";

  card.innerHTML = `
    <div class="viewpoint-tag ${viewpointClass}">${item.viewpoint}</div>
    <div class="viewpoint-desc">${item.note || ""}</div>
    <h2>${item.strategy}</h2>
    <p><strong>KPI:</strong> ${item.kpi}</p>
    <div class="button-wrapper">
      <button class="detail-button">詳細</button>
      <button class="add-priority-button">優先に追加</button>
    </div>
  `;

  // ボタン機能
  card.querySelector(".detail-button").addEventListener("click", () => {
    const modal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>${item.strategy}</h2>
      <p><strong>視点:</strong> ${item.viewpoint}</p>
      <p><strong>KPI:</strong> ${item.kpi}</p>
      <p><strong>注釈:</strong> ${item.note || ""}</p>
      <p><strong>施策:</strong><br>${item.policy}</p>
    `;
    modal.style.display = "block";
  });

  card.querySelector(".add-priority-button").addEventListener("click", () => {
    const clone = card.cloneNode(true);
    document.getElementById("compareListContainer").appendChild(clone);
  });

  return card;
}
