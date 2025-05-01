
document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.querySelector(".close-button");

  const JSON_PATH = "coremaster_real_401cards.json";

  fetch(JSON_PATH)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = `card viewpoint-${item.viewpointKey}`;

        const viewpointTag = document.createElement("div");
        viewpointTag.className = "viewpoint-tag";
        viewpointTag.textContent = item.viewpoint;

        const note = document.createElement("p");
        note.className = "card-note";
        note.textContent = item.note || "";

        const title = document.createElement("h3");
        title.textContent = item.strategy;

        const policy = document.createElement("p");
        policy.textContent = item.policy;

        const kpi = document.createElement("p");
        kpi.innerHTML = `<strong>KPI:</strong> ${item.kpi}`;

        const detailBtn = document.createElement("button");
        detailBtn.className = "detail-button";
        detailBtn.textContent = "詳細を見る";
        detailBtn.addEventListener("click", () => showDetailModal(item));

        const addPriorityBtn = document.createElement("button");
        addPriorityBtn.className = "add-priority-button";
        addPriorityBtn.textContent = "優先に追加";
        addPriorityBtn.addEventListener("click", () => addToCompareList(item));

        card.appendChild(viewpointTag);
        card.appendChild(note);
        card.appendChild(title);
        card.appendChild(policy);
        card.appendChild(kpi);
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
    card.className = `card viewpoint-${item.viewpointKey}`;
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
