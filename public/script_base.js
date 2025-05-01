document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");

  // 読み込み先のCoreMasterファイル（仮固定）
  const JSON_PATH = "coremaster_real_20_refined.json";

  fetch(JSON_PATH)
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ JSON読み込み成功:", data);

      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        // 視点に応じた色ラベル
        const viewpointTag = document.createElement("div");
        viewpointTag.className = "viewpoint-tag";
        viewpointTag.textContent = item.viewpoint;

        // 色クラスの振り分け
        switch (item.viewpointKey) {
          case "finance":
            viewpointTag.classList.add("viewpoint-finance");
            break;
          case "customer":
            viewpointTag.classList.add("viewpoint-customer");
            break;
          case "process":
            viewpointTag.classList.add("viewpoint-process");
            break;
          case "learning":
            viewpointTag.classList.add("viewpoint-growth");
            break;
        }

        // タイトル・本文
        const title = document.createElement("h3");
        title.textContent = item.strategy;

        const policy = document.createElement("p");
        policy.textContent = item.policy;

        const kpi = document.createElement("p");
        kpi.innerHTML = `<strong>KPI:</strong> ${item.kpi}`;

        // カード内に要素追加
        card.appendChild(viewpointTag);
        card.appendChild(title);
        card.appendChild(policy);
        card.appendChild(kpi);

        resultsContainer.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("❌ JSON読み込みエラー:", err);
    });
});
