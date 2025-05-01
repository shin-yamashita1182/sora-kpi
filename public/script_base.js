document.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("resultsContainer");
  const compareContainer = document.getElementById("compareListContainer");
  const detailModal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const generateBtn = document.getElementById("generateBtn");
  const regionInput = document.getElementById("regionName");
  const miniMap = document.getElementById("miniMap");

  closeModal.addEventListener("click", () => {
    detailModal.style.display = "none";
  });

  function validateRegionName() {
    const region = regionInput.value.trim();
    if (!region) {
      alert("地域名を入力してください。Google Mapの表示に必要です。");
      return false;
    }
    return true;
  }

  analyzeBtn.addEventListener("click", () => {
    if (!validateRegionName()) return;
    const region = regionInput.value.trim();
    miniMap.innerHTML = `<iframe width="100%" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps?q=${encodeURIComponent(region)}&output=embed" allowfullscreen></iframe>`;
  });

  generateBtn.addEventListener("click", () => {
    if (!validateRegionName()) return;
    alert("分析対策ボタンが押されました（API連携は別途）");
  });

  // --- CoreMasterカード表示処理 ---
  fetch("coremaster_real_401cards.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.className = `card viewpoint-${card.viewpointKey}`;

        const tag = document.createElement("div");
        tag.className = "viewpoint-tag";
        tag.textContent = card.viewpoint;
        cardEl.appendChild(tag);

        const title = document.createElement("h3");
        title.textContent = card.strategy;
        cardEl.appendChild(title);

        if (card.note) {
          const note = document.createElement("div");
          note.className = "card-note";
          note.textContent = card.note;
          cardEl.appendChild(note);
        }

        const btnWrapper = document.createElement("div");
        btnWrapper.className = "card-buttons";

        const detailBtn = document.createElement("button");
        detailBtn.className = "detail-button";
        detailBtn.textContent = "詳細を見る";
        detailBtn.onclick = () => {
          modalBody.innerHTML = `
            <h3>${card.strategy}</h3>
            <p>${card.policy}</p>
            <div><strong>KPI:</strong> ${card.kpi}</div>
          `;
          detailModal.style.display = "block";
        };

        const addBtn = document.createElement("button");
        addBtn.className = "add-priority-button";
        addBtn.textContent = "優先リストに追加";
        addBtn.onclick = () => {
          const clone = cardEl.cloneNode(true);
          compareContainer.appendChild(clone);
        };

        btnWrapper.appendChild(detailBtn);
        btnWrapper.appendChild(addBtn);
        cardEl.appendChild(btnWrapper);

        resultContainer.appendChild(cardEl);
      });
    });
});
