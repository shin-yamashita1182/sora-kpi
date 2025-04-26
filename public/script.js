document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const resultsContainer = document.getElementById("resultsContainer");
  const compareListContainer = document.getElementById("compareListContainer");

  const compareList = [];

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

  function renderCompareList() {
    compareListContainer.innerHTML = "";
    if (compareList.length === 0) {
      compareListContainer.innerHTML = "<p>保存された施策はまだありません。</p>";
      return;
    }

    compareList.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.policy}</p>
        <p>${item.kpi}</p>
        <p>${item.actor}</p>
      `;
      compareListContainer.appendChild(card);
    });
  }

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
        <button class="saveBtn" data-index="${index}">保存</button>
        <button class="detailBtn" data-index="${index}">詳細</button>
        <button class="compareBtn">比較</button>
      `;
      resultsContainer.appendChild(card);
    });
  });

  resultsContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && event.target.classList.contains("saveBtn")) {
      const index = event.target.dataset.index;
      const item = mockResults[index];
      const exists = compareList.some(c => c.title === item.title);
      if (!exists) {
        compareList.push(item);
        renderCompareList();
      } else {
        alert("この施策はすでに保存されています。");
      }
    }
  });

  renderCompareList();
});
