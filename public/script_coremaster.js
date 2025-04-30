// script_coremaster.js（Master Checker準拠・美麗カード描画版）

console.log("✅ script_coremaster.js 読み込まれた！");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded 発火！");

  fetch("coremaster_real_20_refined.json")
    .then((res) => {
      if (!res.ok) throw new Error("❌ JSON取得失敗: " + res.status);
      return res.json();
    })
    .then((data) => {
      console.log("📦 JSONデータ取得成功！", data);
      renderStrategyCards(data);
    })
    .catch(err => console.error("❌ JSON読み込みエラー:", err));
});

function renderStrategyCards(cards) {
  const container = document.getElementById("resultsContainer");
  if (!container) {
    console.warn("⚠️ #resultsContainer が見つかりません！HTMLに定義されていますか？");
    return;
  }

  container.innerHTML = "";

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="card-header">
        <span class="viewpoint-tag viewpoint-${card.viewpointKey || 'generic'}">${card.viewpoint || '視点不明'}</span>
        <span class="viewpoint-desc">${card.note || ''}</span>
      </div>
      <h2>${card.policy || card.strategy}</h2>
      <button class="detail-button">詳細を見る</button>
      <button class="add-priority-button">優先リストへ追加</button>
    `;

    const detailBtn = div.querySelector(".detail-button");
    detailBtn.onclick = () => openDetailModal(card);

    const addBtn = div.querySelector(".add-priority-button");
    addBtn.onclick = () => addToCompareList(card);

    container.appendChild(div);
  });
}

function openDetailModal(card) {
  const modal = document.getElementById("detailModal") || document.getElementById("detail-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const modalKpi = document.getElementById("modal-kpi");

  if (!modal || !modalTitle || !modalContent || !modalKpi) return;

  modalTitle.textContent = card.viewpoint || "視点";
  modalContent.textContent = card.policy || card.strategy;
  modalKpi.textContent = "KPI: " + (card.kpi || "未設定");
  modal.style.display = "block";

  const closeBtn = modal.querySelector(".close-button");
  if (closeBtn) closeBtn.onclick = () => (modal.style.display = "none");

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

function addToCompareList(card) {
  const container = document.getElementById("compareListContainer");
  if (!container) return;

  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <h3>${card.strategy}</h3>
    <p><strong>KPI:</strong> ${card.kpi || "未設定"}</p>
    <button class="btn-remove">削除</button>
  `;

  div.querySelector(".btn-remove").onclick = () => div.remove();
  container.appendChild(div);
}
