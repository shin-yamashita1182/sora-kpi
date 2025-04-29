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
  const generateBtn = document.getElementById('generateBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const categorySelect = document.getElementById('category');

  let currentMasterData = [];
  let currentDetailIndex = null;

  // 地域入力＋分類選択からマスターを読み込む
  async function loadMasterData() {
    const category = categorySelect.value;
    console.log("Category selected:", category);

    if (category === "観光型") {
      try {
        const response = await fetch('kankou_master.json');
        if (!response.ok) {
          console.error('Failed to load kankou_master.json:', response.status);
          return;
        }
        currentMasterData = await response.json();
        console.log('Data loaded:', currentMasterData);
      } catch (error) {
        console.error('Error loading JSON:', error);
      }
    } else {
      currentMasterData = []; // 他分類は今は空
    }
  }

  // 分析対策ボタンのクリック時（従来マスター読み込み処理）
  generateBtn.addEventListener('click', async () => {
    console.log('Generate button clicked');

    await loadMasterData();

    resultsContainer.innerHTML = "";

    if (currentMasterData.length === 0) {
      console.log('No data to display!');
      return;
    }

    console.log("Displaying data...");
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

    console.log('Results Container HTML:', resultsContainer.innerHTML);
  });

  // 詳細ボタンのクリック時
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      const index = parentCard.getAttribute('data-index');
      const item = currentMasterData[index];
      currentDetailIndex = parseInt(index);

      console.log("Opening detail modal for:", item.title);

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
        console.log("Added to compare list:", item.title);
      }

      modal.style.display = "none";
    }
  });

  // 比較リストから削除ボタン
  compareListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const card = event.target.closest('.card');
      if (card) card.remove();
      console.log("Card removed from compare list");
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

  // analyzeBtn（課題抽出ボタン）クリック時（ChatGPT連携）
  analyzeBtn.addEventListener("click", async () => {
    const regionName = document.getElementById("regionName").value.trim();
    const userNote = document.getElementById("userNote").value.trim();

    if (!regionName || !userNote) {
      alert("地域名とテーマは両方入力してください。");
      return;
    }

    const prompt = `${area}について、テーマ「${theme}」に基づく地域課題を抽出してください。\n以下の内容について、最大トークン数500以内で、最大5つまでの地域課題を簡潔に挙げてください。各課題は1〜2文で記述し、原因や背景が簡潔に分かるようにしてください。`;


    await fetchChatGPTResponse(prompt);
  });
});

// fetchChatGPTResponse関数（ChatGPT連携）
async function fetchChatGPTResponse(prompt) {
  try {
    console.log("送信するPrompt:", prompt);

    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("ChatGPT APIエラー");
    }

    const data = await response.json();

    const canvasResult = document.getElementById("canvasResult");
canvasResult.innerText = data.result || "結果が取得できませんでした。";


  } catch (error) {
    console.error("課題抽出中にエラー発生:", error);
    alert("課題抽出に失敗しました。");
  }
}
