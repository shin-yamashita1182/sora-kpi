document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  const mapModal = document.getElementById("mapModal");
  const mapModalBody = document.getElementById("mapModalBody");
  const closeMapBtn = document.getElementById("closeMapModal");

  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");

  const compareListContainer = document.getElementById("compareListContainer");
  const resultsContainer = document.getElementById('resultsContainer');
  const generateBtn = document.getElementById('generateBtn');  // 課題抽出ボタン
  const analyzeBtn = document.getElementById('analyzeBtn');    // 分析対策ボタン
  const categorySelect = document.getElementById('category');

  let currentMasterData = [];
  let currentDetailIndex = null;

  // 地域入力＋分類選択からマスターを読み込む
  async function loadMasterData() {
    const category = categorySelect.value;
    console.log("Category selected:", category);  // カテゴリ選択の確認

    if (category === "観光型") {
      try {
        const response = await fetch('kankou_master.json');
        if (!response.ok) {
          console.error('Failed to load kankou_master.json:', response.status);
          return;
        }
        currentMasterData = await response.json();
        console.log('Data loaded:', currentMasterData);  // データが正しく読み込まれたか確認
      } catch (error) {
        console.error('Error loading JSON:', error);  // エラー詳細表示
      }
    } else {
      currentMasterData = []; // 他分類は今は空
    }
  }

  // 課題抽出ボタンのクリック時（ChatGPTを呼び出す）
  generateBtn.addEventListener('click', async () => {
    console.log('Generate button clicked');  // ボタンがクリックされたことの確認

    await loadMasterData();

    resultsContainer.innerHTML = "";  // 前回の結果をリセット

    if (currentMasterData.length === 0) {
      console.log('No data to display!');  // データがない場合
      return;
    }

    console.log("Displaying data...");  // データを表示することを確認
    currentMasterData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-index', index);
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p><strong>KPI:</strong> ${item.kpi}</p>
        <button class="detail-btn">詳細</button>
      `;
      resultsContainer.appendChild(card);  // カードを追加
    });

    console.log('Results Container HTML:', resultsContainer.innerHTML);  // 結果を確認
  });

  // 詳細ボタンのクリック時
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      const index = parentCard.getAttribute('data-index');
      const item = currentMasterData[index];
      currentDetailIndex = parseInt(index);

      console.log("Opening detail modal for:", item.title);  // モーダルを開く際に内容を表示

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

  // モーダル内の「比較リストに追加」ボタン
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
        console.log("Added to compare list:", item.title);  // 比較リストに追加したことを確認
      }

      modal.style.display = "none";
    }
  });

  // 比較リストから削除ボタン
  compareListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const card = event.target.closest('.card');
      if (card) card.remove();
      console.log("Card removed from compare list");  // 削除されたことを確認
    }
  });

  // モーダル閉じるボタン
  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  closeMapBtn.addEventListener('click', () => {
    mapModal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
    if (event.target === mapModal) {
      mapModal.style.display = "none";
    }
  });

  // ミニマップクリック時
  const miniMap = document.getElementById('miniMap');
  miniMap.addEventListener('click', () => {
    mapModalBody.innerHTML = "<div style='width: 100%; height: 400px; background-color: #cce5ff; display: flex; align-items: center; justify-content: center;'>拡大地図エリア</div>";
    mapModal.style.display = "block";
  });

  // ファイル選択時
  fileInput.addEventListener('change', (event) => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
      fileNameDisplay.textContent = "ファイルを選択してください";
    }
  });

  // ChatGPT API経由で課題抽出（新しく追加する処理）
  generateBtn.addEventListener('click', async () => {
    const regionName = document.getElementById('regionName').value.trim();
    const userNote = document.getElementById('userNote').value.trim();

    if (!regionName || !userNote) {
      alert('地域名とテーマを入力してください');
      return;
    }

    // 課題抽出（ChatGPT API経由）
    try {
      document.getElementById('canvasResult').innerHTML = '課題抽出中です...';

      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regionName, userNote }),
      });

      // レスポンスをまずテキスト形式で受け取る
      const data = await response.text(); // .text()を使って生のレスポンスを取得

      console.log('Raw response:', data); // 生のレスポンスをコンソールに表示

      // レスポンスがJSONかどうかを確認し、解析する
      try {
        const jsonResponse = JSON.parse(data); // JSONとして解析
        console.log('Parsed JSON response:', jsonResponse); // 正しくJSONが返ってきたか確認
        document.getElementById('canvasResult').innerHTML = `<pre>${jsonResponse.result}</pre>`;
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        document.getElementById('canvasResult').innerHTML = 'JSON解析に失敗しました。';
      }

    } catch (error) {
      console.error('API呼び出しに失敗:', error);
      document.getElementById('canvasResult').innerHTML = '課題抽出に失敗しました。';
    }
  });

  // 分析対策ボタン（従来の施策マッチング処理）
  analyzeBtn.addEventListener('click', () => {
    // ここで施策・KPIマッチング処理を呼び出す
    console.log('分析対策ボタンがクリックされました');
    // ここに施策・KPIマッチング処理を追加してください
  });
});
