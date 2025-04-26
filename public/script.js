// script.js - SORA課題抽出→施策マッチング連携（Mock動作）
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const resultsContainer = document.getElementById("resultsContainer");

  generateBtn.addEventListener("click", () => {
    const region = document.getElementById("regionName").value;
    const category = document.getElementById("category").value;
    const note = document.getElementById("userNote").value;

    // 仮課題を元に生成する施策マッチング結果（モック）
    const mockResults = [
      {
        title: "【戦略目標】観光資源活用",
        policy: "【施策案】観光アクセス改善プロジェクト",
        kpi: "【KPI】観光客数20%UP",
        actor: "【実行体】自治体＋地元企業"
      },
      {
        title: "【戦略目標】人口減少対策",
        policy: "【施策案】IT技術学習プログラム",
        kpi: "【KPI】20代移住者増加5%",
        actor: "【実行体】地域企業連携協議会"
      }
    ];

    resultsContainer.innerHTML = ""; // 一旦初期化
    mockResults.forEach(result => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${result.title}</h3>
        <p>${result.policy}</p>
        <p>${result.kpi}</p>
        <p>${result.actor}</p>
        <button>保存</button>
        <button>詳細</button>
        <button>比較</button>
      `;
      resultsContainer.appendChild(card);
    });
  });
});
