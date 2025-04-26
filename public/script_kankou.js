document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('resultsContainer');
  const generateBtn = document.getElementById('generateBtn');
  const categorySelect = document.getElementById('category');

  let currentMasterData = [];
  let currentDetailIndex = null;

  async function loadMasterData() {
    const category = categorySelect.value;
    if (category === "観光型") {
      const response = await fetch('kankou_master.json');
      currentMasterData = await response.json();
    } else {
      currentMasterData = []; // 他分類は今は空
    }
  }

  generateBtn.addEventListener('click', async () => {
    await loadMasterData();

    resultsContainer.innerHTML = "";

    currentMasterData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-index', index);
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p><strong>KPI:</strong> ${item.kpi}</p>
        <button class="detail-btn">詳細</button>
      `;
      resultsContainer.appendChild(card);
    });
  });

  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      const index = parentCard.getAttribute('data-index');
      const item = currentMasterData[index];
      currentDetailIndex = parseInt(index);

      SORA_UI.openDetailModal(`
        <h2>${item.title}</h2>
        <p><strong>施策概要:</strong> ${item.overview}</p>
        <p><strong>目標KPI:</strong> ${item.kpi}</p>
        <p><strong>想定主体:</strong> ${item.actor}</p>
        <div style="margin-top: 20px; text-align: right;">
          <button id="addToCompareBtn">比較リストに追加</button>
        </div>
      `);
    }
  });

  document.getElementById('modalBody').addEventListener('click', (event) => {
    if (event.target.id === 'addToCompareBtn' && currentDetailIndex !== null) {
      const item = currentMasterData[currentDetailIndex];
      SORA_UI.addToCompare(item.title, item.kpi);
      SORA_UI.closeModals();
    }
  });
});
