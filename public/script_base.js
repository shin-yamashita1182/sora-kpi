// ✅ 正式統合版 script_base.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 各種要素取得
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");
  const mapModal = document.getElementById("mapModal");
  const mapModalBody = document.getElementById("mapModalBody");
  const closeMapBtn = document.getElementById("closeMapModal");
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const compareListContainer = document.getElementById("compareListContainer");

  // --- ファイル選択
  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
      } else {
        fileNameDisplay.textContent = "ファイルを選択してください";
      }
    });
  }

  // --- モーダル閉じる
  if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = "none"; });
  if (closeMapBtn) closeMapBtn.addEventListener('click', () => { mapModal.style.display = "none"; });
  window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = "none";
    if (event.target === mapModal) mapModal.style.display = "none";
  });

  // --- ミニマップクリックで地図拡大
  const miniMap = document.getElementById('miniMap');
  if (miniMap) {
    miniMap.addEventListener('click', () => {
      mapModalBody.innerHTML = "<div style='width: 100%; height: 400px; background-color: #cce5ff; display: flex; align-items: center; justify-content: center;'>拡大地図エリア</div>";
      mapModal.style.display = "block";
    });
  }
});

// ✅ 正式版 handleValidationAndTrigger 関数
async function handleValidationAndTrigger() {
    const regionInput = document.getElementById('regionInput').value.trim();
    const freeInput = document.getElementById('freeInput').value.trim();
    const regionType = document.getElementById('regionType').value.trim();
    const resultArea = document.getElementById('resultArea');
    const cardArea = document.getElementById('cardArea');

    if (!regionInput || !regionType) {
        resultArea.innerHTML = '<span style="color:red;">地域名と地域分類は必須です。</span>';
        return;
    }

    const promptText = `
あなたは地域経営に精通した専門家です。
以下の地域情報に基づき、施策を導き出すための適切な「トリガーワード」を1つ生成してください。

【地域名】：${regionInput}
【自由記述】：${freeInput || '特になし'}
【地域分類】：${regionType}

※出力形式は「トリガーワード：●●●」のみとしてください。
    `;

    resultArea.innerHTML = "<p>ChatGPTに問い合わせ中...</p>";
    cardArea.innerHTML = "";

    try {
        const response = await fetch('/api/chatgpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
            throw new Error('ChatGPT連携に失敗しました。');
        }

        const data = await response.json();
        const triggerMatch = data.result.match(/トリガーワード：(.+)/);
        const triggerWord = triggerMatch ? triggerMatch[1].trim() : null;

        if (!triggerWord) {
            resultArea.innerHTML = "<span style='color:red;'>トリガーワードが取得できませんでした。</span>";
            return;
        }

        resultArea.innerHTML = `<p><strong>生成されたトリガー：</strong>${triggerWord}</p>`;

        // バリデーションルール・マスター読み込み
        await loadMasterData(regionType);

        // 読み込んだ静的マスターからカード生成
        displayMasterData();

    } catch (error) {
        console.error('Error:', error);
        resultArea.innerHTML = "<span style='color:red;'>施策抽出に失敗しました。</span>";
    }
}
