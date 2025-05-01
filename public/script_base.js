
document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.querySelector(".close-button");

  const JSON_PATH = "coremaster_real_401cards.json";

  const viewpointMap = {
    "財務の視点":  { class: "viewpoint-finance",  note: "地域・企業が持続的に成長するための経済的成果や資源の最適化" },
    "顧客の視点":  { class: "viewpoint-customer", note: "地域住民や来訪者などへの価値提供と満足度向上" },
    "内部プロセスの視点": { class: "viewpoint-process",  note: "地域サービスや事業活動の効率性・有効性の向上" },
    "学習と成長の視点":  { class: "viewpoint-growth",   note: "人材育成、情報基盤整備、文化醸成など将来への成長支援" }
  };

  fetch(JSON_PATH)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        const header = document.createElement("div");
        header.className = "card-header";

        const viewpointData = viewpointMap[item.視点名] || { class: "", note: "" };

        const viewpointTag = document.createElement("span");
        viewpointTag.className = `viewpoint-tag ${viewpointData.class}`;
        viewpointTag.textContent = item.視点名;

        const viewpointDesc = document.createElement("span");
        viewpointDesc.className = "viewpoint-desc";
        viewpointDesc.textContent = viewpointData.note;

        header.appendChild(viewpointTag);
        header.appendChild(viewpointDesc);

        const title = document.createElement("h2");
        title.textContent = item.strategy;

        const detailBtn = document.createElement("button");
        detailBtn.className = "detail-button";
        detailBtn.textContent = "詳細を見る";
        detailBtn.addEventListener("click", () => showDetailModal(item));

        const addPriorityBtn = document.createElement("button");
        addPriorityBtn.className = "add-priority-button";
        addPriorityBtn.textContent = "優先リストへ追加";
        addPriorityBtn.addEventListener("click", () => addToCompareList(item));

        card.appendChild(header);
        card.appendChild(title);
        card.appendChild(detailBtn);
        card.appendChild(addPriorityBtn);

        resultsContainer.appendChild(card);
      });
    })
    .catch((err) => console.error("❌ JSON読み込みエラー:", err));

  function showDetailModal(item) {
    modalBody.innerHTML = `
      <h2>${item.strategy}</h2>
      <p><strong>施策:</strong> ${item.policy}</p>
      <p><strong>KPI:</strong> ${item.kpi}</p>
      <p><strong>注釈:</strong> ${item.note}</p>
      <button class="add-priority-button" id="modalAddBtn">優先リストに追加</button>
    `;
    modal.style.display = "block";
    document.getElementById("modalAddBtn").addEventListener("click", () => {
      addToCompareList(item);
    });
  }

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  function addToCompareList(item) {
    const compareList = document.getElementById("compareListContainer");

    if (document.getElementById(`compare-${item.id}`)) {
      alert("この施策は既に優先リストに追加されています。");
      return;
    }

    const card = document.createElement("div");
    card.className = "card";
    card.id = `compare-${item.id}`;

    const title = document.createElement("h3");
    title.textContent = item.strategy;

    const policy = document.createElement("p");
    policy.textContent = item.policy;

    const kpi = document.createElement("p");
    kpi.innerHTML = `<strong>KPI:</strong> ${item.kpi}`;

    const note = document.createElement("p");
    note.className = "card-note";
    note.textContent = item.note || "";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "削除";
    removeBtn.addEventListener("click", () => {
      compareList.removeChild(card);
    });

    card.appendChild(title);
    card.appendChild(policy);
    card.appendChild(kpi);
    card.appendChild(note);
    card.appendChild(removeBtn);

    compareList.appendChild(card);
  }
});
