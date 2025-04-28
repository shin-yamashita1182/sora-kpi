document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');  // 【課題抽出】ボタン
  const analyzeBtn = document.getElementById('analyzeBtn');    // 【分析対策】ボタン
  const categorySelect = document.getElementById('category');
  const resultsContainer = document.getElementById('resultsContainer');
  const canvasResult = document.querySelector('.canvas-placeholder');

  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  const compareListContainer = document.getElementById("compareListContainer");

  let currentMasterData = [];
  let currentDetailIndex = null;

  // マスターデータロード
  async function loadMasterData() {
    const category = categorySelect.value;
    if (category === "観光型") {
      try {
        const response = await fetch('kankou_master.json');
        if (!response.ok) {
          console.error('Failed to load master data:', response.status);
          return [];
        }
        return await response.json();
      } catch (error) {
        console.error('Error loading master JSON:', error);
        return [];
      }
    } else {
      return [];
    }
  }

  // 【課題抽出】ボタンクリック（ChatGPT API呼び出し）
  generateBtn.addEventListener('click', async () => {
    console.log('課題抽出ボタンが押されました');
    
    const regionName = document.getElementById('regionName').value.trim();
    const userNote = document.getElementById('userNote').value.trim();

    if (!regionName || !userNote) {
      alert('地域名とテーマを入力してください');
      return;
    }

    try {
      canvasResult.innerHTML = '課題抽出中です...';

      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regionName, userNote }),
      });

      const data = await response.text();

      try {
        const jsonResponse = JSON.parse(data);
        console.log('ChatGPT応答:', jsonResponse);
        canvasResult.innerHTML = `<pre>${jsonResponse.result}</pre>`;
      } catch (parseError) {
        console.error('JSONパース失敗:', parseError);
        canvasResult.innerHTML = 'JSON解析に失敗しました。';
      }

    } catch (apiError) {
      console.error('API呼び出し失敗:', apiError);
      canvasResult.innerHTML = '課題抽出に失敗しました。';
    }
  });

  // 【分析対策】ボタンクリック（施策リスト表示）
  analyzeBtn.addEventListener('click', async () => {
    console.log('分析対策ボタンが押されました');

    resultsContainer.innerHTML = ''; // 一旦クリア

    currentMasterData = await loadMasterData();

    if (currentMasterData.length === 0) {
      console.log('表示できるマスターデータがありません');
      resultsContainer.innerHTML = '<p>施策データがありません</p>';
      return;
    }

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

    console.log('施策リストが表示されました');
  });

  // 【詳細ボタン】クリックでモーダル表示
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      const index = parentCard.getAttribute('data-index');
      const item = currentMasterData[index];
      currentDetailIndex = parseInt(index);

      console.log("モーダルを開きます:", item.title);

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p><strong>施策概要:</strong> ${item.overview}</p>
        <p><strong>目標KPI:</strong> ${item.kpi}</p>
        <p><strong>想定主体:</strong> ${item.actor}</p>
        <div style="margin-top: 20px; text-align: right;">
          <button id="addToCompareBtn">比較リストに追加</button>
        </div>
      `;
      modal.style.display = "block";
    }
  });

  // 【モーダル内・比較リストに追加】
  modalBody.addEventListener('click', (event) => {
    if (event.target.id === 'addToCompareBtn' && currentDetailIndex !== null) {
      const item = currentMasterData[currentDetailIndex];

      const exists = [...compareListContainer.querySelectorAll('.card')]
        .some(card => card.querySelector('h3')?.textContent === item.title);

      if (!exists) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${item.title}</h3>
          <p><strong>KPI:</strong> ${item.kpi}</p>
          <div style="text-align: right;">
            <button class="remove-btn">削除</button>
          </div>
        `;
        compareListContainer.appendChild(card);
        console.log("比較リストに追加:", item.title);
      }

      modal.style.display = "none";
    }
  });

  // 【比較リスト】から削除
  compareListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const card = event.target.closest('.card');
      if (card) card.remove();
      console.log("比較リストから削除しました");
    }
  });

  // モーダルを閉じる
  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  // モーダル外クリックで閉じる
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

});
