
// ✅ SORA Dashboard Script Base - 修正版（401cards対応・UI統一）

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  const compareListContainer = document.getElementById("compareListContainer");
  const resultsContainer = document.getElementById('resultsContainer');
  const generateBtn = document.getElementById('generateBtn');
  const categorySelect = document.getElementById('category');

  let currentMasterData = [];
  let currentDetailIndex = null;

  async function loadMasterData() {
    try {
      const response = await fetch('coremaster_real_401cards.json');
      if (!response.ok) throw new Error("JSON取得失敗");
      currentMasterData = await response.json();
    } catch (error) {
      console.error('Error loading JSON:', error);
    }
  }

  generateBtn.addEventListener('click', async () => {
    await loadMasterData();
    resultsContainer.innerHTML = "";
    if (currentMasterData.length === 0) return;

    currentMasterData.forEach((item, index) => {
      const card = document.createElement('div');
      const viewpointClass = item.viewpoint || ""; // 例: "viewpoint-finance"
      const noteHTML = item.note ? `<div class="card-note">${item.note}</div>` : "";
      const labelHTML = item.viewpointLabel ? `<span class="viewpoint-tag">${item.viewpointLabel}</span>` : "";

      card.className = `card ${viewpointClass}`;
      card.setAttribute("data-index", index);
      card.innerHTML = `
        ${labelHTML}
        <h3>${item.title}</h3>
        ${noteHTML}
        <div class="card-buttons">
          <button class="detail-button">詳細</button>
          <button class="add-priority-button">優先リストに追加</button>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  });

  // 詳細モーダル
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-button')) {
      const parentCard = event.target.closest('.card');
      const index = parentCard.getAttribute('data-index');
      const item = currentMasterData[index];
      currentDetailIndex = parseInt(index);

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p><strong>施策概要:</strong> ${item.overview || '未設定'}</p>
        <p><strong>目標KPI:</strong> ${item.kpi || '未設定'}</p>
        <p><strong>想定主体:</strong> ${item.actor || '未設定'}</p>
        <div style="margin-top: 20px; text-align: right;">
          <button class="add-priority-button">優先リストに追加</button>
        </div>
      `;
      modal.style.display = "block";
    }

    // 優先追加（モーダル内）
    if (event.target.classList.contains('add-priority-button') && currentDetailIndex !== null) {
      const item = currentMasterData[currentDetailIndex];
      const card = document.createElement('div');
      const viewpointClass = item.viewpoint || "";
      const noteHTML = item.note ? `<div class="card-note">${item.note}</div>` : "";
      const labelHTML = item.viewpointLabel ? `<span class="viewpoint-tag">${item.viewpointLabel}</span>` : "";

      card.className = `card ${viewpointClass}`;
      card.innerHTML = `
        ${labelHTML}
        <h3>${item.title}</h3>
        ${noteHTML}
      `;
      compareListContainer.appendChild(card);
      modal.style.display = "none";
    }
  });

  // モーダル閉じる
  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });
});
