// ✅ SORA Dashboard Script Base - 完全版（NEXCO連動 + 課題抽出 + KPI分析 + 比較）
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
  const coreMasterContainer = document.getElementById("coreMasterContainer");

  let currentMasterData = [];
  let currentDetailIndex = null;
  let analysisDone = false;

  async function loadMasterData() {
    const category = categorySelect.value;
    if (category === "観光型") {
      try {
        const response = await fetch('coremaster_demo_20.json');
        if (!response.ok) return;
        currentMasterData = await response.json();
      } catch (error) {
        console.error('Error loading JSON:', error);
      }
    } else {
      currentMasterData = []; 
    }
  }

  generateBtn.addEventListener('click', async () => {
    await loadMasterData();
    resultsContainer.innerHTML = "";
    if (currentMasterData.length === 0) return;
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
      }
      modal.style.display = "none";
    }
  });

  compareListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const card = event.target.closest('.card');
      if (card) card.remove();
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  closeMapBtn.addEventListener('click', () => {
    mapModal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = "none";
    if (event.target === mapModal) mapModal.style.display = "none";
  });

  const miniMap = document.getElementById('miniMap');
  miniMap.addEventListener('click', () => {
    mapModalBody.innerHTML = "<div style='width: 100%; height: 400px; background-color: #cce5ff; display: flex; align-items: center; justify-content: center;'>拡大地図エリア</div>";
    mapModal.style.display = "block";
  });

  fileInput.addEventListener('change', (event) => {
    fileNameDisplay.textContent = fileInput.files.length > 0
      ? fileInput.files[0].name
      : "ファイルを選択してください";
  });

  analyzeBtn.addEventListener("click", async () => {
    if (analysisDone) {
      alert("すでに課題抽出が完了しています。ページを更新するか、条件を変更してください。");
      return;
    }

    const regionName = document.getElementById("regionName").value.trim();
    const userNote = document.getElementById("userNote").value.trim();

    if (!regionName) {
      alert("地域名を入力してください。");
      return;
    }

    if (!userNote) {
      alert("テーマや自由記述を入力してください。");
      return;
    }

    updateGoogleMap(regionName);

    const originalBtnText = analyzeBtn.innerText;
    analyzeBtn.innerText = "課題抽出中…";
    analyzeBtn.disabled = true;

    const prompt = `${regionName}について、テーマ「${userNote}」に基づく地域課題を抽出してください。\n以下の内容について、最大トークン数500以内で、最大5つまでの地域課題を簡潔に挙げてください。各課題は1〜2文で記述し、原因や背景が簡潔に分かるようにしてください。`;

    try {
      await fetchChatGPTResponse(prompt);
      analysisDone = true;

      const response = await fetch("/json/coremaster_demo_20.json");
      const data = await response.json();
      coreMasterContainer.innerHTML = "";

      data.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-index", index);

        let color = "#ccc";
        if (item.perspective.includes("財務")) color = "#cce5ff";
        else if (item.perspective.includes("顧客")) color = "#d4edda";
        else if (item.perspective.includes("内部")) color = "#fff3cd";
        else if (item.perspective.includes("学習")) color = "#f8d7da";

        card.innerHTML = `
          <div style="padding: 10px; border-left: 6px solid ${color}; margin-bottom: 10px;">
            <h3>${item.title}</h3>
            <p><strong>KPI:</strong> ${item.kpi}</p>
            <p style="font-size: 12px; color: #666;"><strong>${item.perspective}</strong> - ${item.note}</p>
            <div style="text-align: center; margin-top: 10px;">
              <button class="add-to-priority">優先に追加</button>
            </div>
          </div>
        `;

        coreMasterContainer.appendChild(card);
      });
    } catch (error) {
      console.error("抽出中に問題が発生しました:", error);
      alert("課題抽出に失敗しました。");
    } finally {
      analyzeBtn.innerText = originalBtnText;
      analyzeBtn.disabled = false;
    }
  });

  async function fetchChatGPTResponse(prompt) {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error("ChatGPT APIエラー");
    const data = await response.json();
    const canvasResult = document.getElementById("canvasResult");
    canvasResult.innerText = data.result || "結果が取得できませんでした。";
  }

  const nexcoBtn = document.getElementById("toggleNexcoBtn");
  const infoBox = document.getElementById("nexcoInfoBox");
  const infoList = document.getElementById("nexcoInfoList");
  const statusBox = document.getElementById("nexcoStatus");

  let infoFetched = false;
  let isAccordionOpen = false;
  let isFetching = false;

  nexcoBtn.addEventListener("click", () => {
    const region = document.getElementById("regionName").value.trim();
    if (!region) {
      alert("地域名を入力してください！");
      return;
    }

    if (!infoFetched && !isFetching) {
      isFetching = true;
      nexcoBtn.textContent = "NEXCO情報 取得中…";

      const prompt = `${region}周辺の高速道路に関する、主なインターチェンジ、サービスエリア、パーキングエリアを最大5〜7件程度、リスト形式で簡潔にまとめてください。各施設名と簡単な特徴（例：トイレ、飲食、ガソリン有無など）だけを記載してください。それ以外の情報は不要です。`;

      fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
        .then(response => {
          if (!response.ok) throw new Error("取得失敗");
          return response.json();
        })
        .then(data => {
          const raw = data.result || "";
          const items = raw.split(/[\n・。！？]/).filter(line => line.trim().length > 4);
          infoList.innerHTML = "";
          items.forEach(text => {
            const li = document.createElement("li");
            li.textContent = text.trim();
            infoList.appendChild(li);
          });

          infoFetched = true;
          isFetching = false;
          infoBox.classList.add("open");
          isAccordionOpen = true;
          updateButtonLabel();
        })
        .catch(error => {
          console.error("🔥 取得エラー:", error);
          infoList.innerHTML = "<li>情報取得に失敗しました。</li>";
          nexcoBtn.textContent = "NEXCO情報を表示";
          isFetching = false;
        });
    } else {
      if (!isAccordionOpen) {
        infoBox.classList.add("open");
        isAccordionOpen = true;
      } else {
        infoBox.classList.remove("open");
        isAccordionOpen = false;
      }
      updateButtonLabel();
    }
  });

  function updateButtonLabel() {
    nexcoBtn.textContent = isAccordionOpen ? "NEXCO情報を閉じる" : "NEXCO情報を表示";
    if (statusBox) {
      statusBox.textContent = isAccordionOpen ? "NEXCO情報を表示中" : "NEXCO情報を非表示にしました";
    }
  }

  coreMasterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-priority")) {
      const cardEl = event.target.closest(".card");
      const title = cardEl.querySelector("h3")?.textContent;
      const kpi = cardEl.querySelector("p strong")?.textContent;

      const exists = [...document.querySelectorAll("#compareListContainer .card")]
        .some(card => card.querySelector("h3")?.textContent === title);

      if (!exists) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${title}</h3>
          <p><strong>KPI:</strong> ${kpi}</p>
          <div style="text-align: right;">
            <button class="remove-btn">削除</button>
          </div>
        `;
        document.getElementById("compareListContainer").appendChild(card);
      }
    }
  });
});
