// script.js - SORA課題抽出→施策マッチング連携（モーダル詳細情報拡張版）
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const resultsContainer = document.getElementById("resultsContainer");
  const modal = document.getElementById("detailModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalPolicy = document.getElementById("modalPolicy");
  const modalKPI = document.getElementById("modalKPI");
  const modalActor = document.getElementById("modalActor");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");

  const mockResults = [
    {
      title: "【戦略目標】観光資源活用",
      policy: "【施策案】観光アクセス改善プロジェクト",
      kpi: "【KPI】観光客数20%UP",
      actor: "【実行体】自治体＋地元企業",
      detail: "この施策は観光地へのアクセス手段（バス・船・車）の改善により、観光客の流入を増やすことを目的としています。"
    },
    {
      title: "【戦略目標】人口減少対策",
      policy: "【施策案】IT技術学習プログラム",
      kpi: "【KPI】20代移住者増加5%",
      actor: "【実行体】地域企業連携協議会",
      detail: "この施策は、若年層にIT教育機会を提供し、就労支援と移住促進をセットで展開します。"
    }
  ];

  generateBtn.addEventListener("click", () => {
    resultsContainer.innerHTML = "";
    mockResults.forEach((result, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${result.title}</h3>
        <p>${result.policy}</p>
        <p>${result.kpi}</p>
        <p>${result.actor}</p>
        <button class="saveBtn">保存</button>
        <button class="detailBtn" data-index="${index}">詳細</button>
        <button class="compareBtn">比較</button>
      `;
      resultsContainer.appendChild(card);
    });
  });

  resultsContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const text = event.target.textContent;
      if (text === "保存") {
        alert("施策が保存されました！");
      } else if (text === "詳細") {
        const index = event.target.dataset.index;
        const result = mockResults[index];
        modalTitle.textContent = result.title;
        modalPolicy.textContent = result.policy;
        modalKPI.textContent = result.kpi;
        modalActor.textContent = result.actor;
        modalBody.textContent = result.detail;
        modal.style.display = "block";
      } else if (text === "比較") {
        alert("比較リストに追加しました！（仮）");
      }
    }
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
