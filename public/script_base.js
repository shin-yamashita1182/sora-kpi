document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.querySelector(".close-button");

  const JSON_PATH = "coremaster_real_20_refined.json";

  fetch(JSON_PATH)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        const viewpointTag = document.createElement("div");
        viewpointTag.className = "viewpoint-tag";
        viewpointTag.textContent = item.viewpoint;

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

        const title = document.createElement("h3");
        title.textContent = item.strategy;

        const policy = document.createElement("p");
        policy.textContent = item.policy;

        const kpi = document.createElement("p");
        kpi.innerHTML = `<strong>KPI:</strong> ${item.kpi}`;

        // 「詳細を見る」ボタン
        const detailBtn = document.createElement("button");
        detailBtn.className = "detail-button";
        detailBtn.textContent = "詳細を見る";
        detailBtn.addEventListener("click", () => showDetailModal(item));

        card.appendChild(viewpointTag);
        card.appendChild(title);
        card.appendChild(policy);
        card.appendChild(kpi);
        card.appendChild(detailBtn);

        resultsContainer.appendChild(card);
      });
    })
    .catch((err) => console.error("❌ JSON読み込みエラー:", err));

  // モーダル表示処理
  function showDetailModal(item) {
    modalBody.innerHTML = `
  <h2>${item.strategy}</h2>
  <p><strong>施策:</strong> ${item.policy}</p>
  <p><strong>KPI:</strong> ${item.kpi}</p>
  <p><strong>注釈:</strong> ${item.note}</p>
`;
    modal.style.display = "block";
  }

  // モーダルを閉じる処理
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
