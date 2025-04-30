// script_coremaster.js（デバッグ完全版）

console.log("✅ script_coremaster.js 読み込まれた！");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded 発火！");

  fetch("coremaster_demo_20.json")
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

  console.log("🎨 戦略カードを描画中... 件数:", cards.length);

  container.innerHTML = "";
  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = card.strategy || "戦略タイトル不明";

    const kpi = document.createElement("p");
    kpi.innerHTML = `<strong>KPI:</strong> ${card.kpi || "未設定"}`;

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

function openDetailModal(card) {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  if (!modal || !modalBody) {
    console.warn("⚠️ モーダル要素が見つかりません");
    return;
  }

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

function addToCompareList(card) {
  const container = document.getElementById("compareListContainer");
  if (!container) return;

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
