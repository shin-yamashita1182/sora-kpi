// ✅ SORA Dashboard Script Base - 復旧版（ChatGPT課題抽出 → 分析対策で戦略展開）
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
    try {
      const response = await fetch('/json/coremaster_demo_20.json');
      if (!response.ok) throw new Error('データ読み込み失敗');
      currentMasterData = await response.json();
    } catch (error) {
      console.error('Error loading master data:', error);
      currentMasterData = [];
    }
  }

  analyzeBtn.addEventListener("click", async () => {
    if (analysisDone) {
      alert("すでに課題抽出が完了しています。ページを更新するか、条件を変更してください。");
      return;
    }

    const regionName = document.getElementById("regionName").value.trim();
    const userNote = document.getElementById("userNote").value.trim();

    if (!regionName || !userNote) {
      alert("地域名とテーマを入力してください。");
      return;
    }

    updateGoogleMap(regionName);

    const prompt = `${regionName}について、テーマ「${userNote}」に基づく地域課題を抽出してください。\n以下の内容について、最大トークン数500以内で、最大5つまでの地域課題を簡潔に挙げてください。各課題は1〜2文で記述し、原因や背景が簡潔に分かるようにしてください。`;

    try {
      await fetchChatGPTResponse(prompt);
      analysisDone = true;
    } catch (error) {
      console.error('ChatGPT fetch error:', error);
    }
  });

  generateBtn.addEventListener('click', async () => {
    await loadMasterData();
    coreMasterContainer.innerHTML = "";
    if (currentMasterData.length === 0) return;

    currentMasterData.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-index", index);

      let labelClass = "";
      if (item.perspective.includes("財務")) labelClass = "finance";
      else if (item.perspective.includes("顧客")) labelClass = "customer";
      else if (item.perspective.includes("内部")) labelClass = "process";
      else if (item.perspective.includes("学習")) labelClass = "learning";

      card.innerHTML = `
        <div class="viewpoint-tag ${labelClass}">${item.perspective}</div>
        <div class="viewpoint-note">${item.note}</div>
        <h3>${item.title}</h3>
        <div class="button-area">
          <button class="detail-button">詳細</button>
          <button class="add-to-priority">優先リストに追加</button>
        </div>
      `;

      coreMasterContainer.appendChild(card);
    });
  });

  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-button')) {
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
          <button id="addToCompareBtn">優先リストに追加</button>
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
          <div class="viewpoint-tag">${item.perspective}</div>
          <div class="viewpoint-note">${item.note}</div>
          <h3>${item.title}</h3>
          <p><strong>KPI:</strong> ${item.kpi}</p>
          <div class="card-buttons">
            <button class="detail-button">詳細</button>
            <button class="add-priority-button">マインドマップ</button>
          </div>
        `;
        compareListContainer.appendChild(card);
        compareListContainer.scrollIntoView({ behavior: "smooth" });
      }
      modal.style.display = "none";
    }
  });
});


      // ✅ 正しい位置（forEachの外！）
coreMasterContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-priority")) {
    const originalCard = event.target.closest(".card");
    if (!originalCard) return;
// ✅ ←ここに入れてください！
  console.log("originalCard HTML:", originalCard.innerHTML);

    const title = originalCard.querySelector("h3")?.textContent.trim();
    if (!title) return;

    const isDuplicated = [...compareListContainer.querySelectorAll("h3")]
      .some(h3 => h3.textContent.trim() === title);
    if (isDuplicated) {
      alert("すでに優先リストに追加されています。");
      return;
    }

    // ✅ 視点ラベル再生成（classをつけ直す）
const perspectiveText = originalCard.querySelector(".viewpoint-tag")?.textContent || "";
let labelClass = "";
if (perspectiveText.includes("財務")) labelClass = "finance";
else if (perspectiveText.includes("顧客")) labelClass = "customer";
else if (perspectiveText.includes("内部")) labelClass = "process";
else if (perspectiveText.includes("学習")) labelClass = "learning";

const titleText = originalCard.querySelector("h3")?.textContent || "";
const noteText = originalCard.querySelector(".viewpoint-note")?.textContent || "";

const cloned = document.createElement("div");
cloned.className = "card";
cloned.innerHTML = `
  <span class="label viewpoint-tag ${labelClass}">${perspectiveText}</span>
  <h3>${titleText}</h3>
  <div class="note">${noteText}</div>
  <div class="button-area">
    <button class="openMindMapBtn">マインドマップ</button>
  </div>
`;

cloned.querySelector(".openMindMapBtn").addEventListener("click", () => {
  const modal = document.getElementById("mindMapModal");
  const body = document.getElementById("mindMapContent");
  body.innerHTML = `
    <h2>🧠 ${titleText}</h2>
    <p>${noteText}</p>
  `;
  modal.style.display = "block";
});


compareListContainer.appendChild(cloned);
compareListContainer.scrollIntoView({ behavior: "smooth" });
compareListContainer.classList.add("highlight");
setTimeout(() => compareListContainer.classList.remove("highlight"), 1500);
  }
});

  
      document.getElementById("resultsContainer")?.scrollIntoView({ behavior: "smooth" });
      resultsContainer.classList.add("highlight");
      setTimeout(() => resultsContainer.classList.remove("highlight"), 1500);

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
 const mindMapModal = document.getElementById("mindMapModal");
const closeMindMapBtn = document.getElementById("closeMindMapModal");
const mindMapContent = document.getElementById("mindMapContent");

compareListContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-priority-button")) {
    const titles = [...compareListContainer.querySelectorAll("h3")].map(el => el.textContent.trim());
    mindMapContent.innerHTML = `
      <ul style="list-style: none; padding-left: 0;">
        ${titles.map(title => `<li style="margin-bottom: 10px;">🟢 ${title}</li>`).join("")}
      </ul>
    `;
    mindMapModal.style.display = "block";
  }
});

closeMindMapBtn.addEventListener("click", () => {
  mindMapModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === mindMapModal) {
    mindMapModal.style.display = "none";
  }
});
  
document.getElementById("compareListContainer").addEventListener("click", (event) => {
  if (event.target.classList.contains("detail-button")) {
    alert("詳細モーダルを表示（仮動作）");
  }
});

});
