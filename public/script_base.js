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

  window.SORA_UI = {
    openDetailModal(contentHTML) {
      modalBody.innerHTML = contentHTML;
      modal.style.display = "block";
    },
    closeModals() {
      modal.style.display = "none";
      mapModal.style.display = "none";
    },
    openMapModal() {
      mapModalBody.innerHTML = "<div style='width: 100%; height: 400px; background-color: #cce5ff; display: flex; align-items: center; justify-content: center;'>拡大地図エリア</div>";
      mapModal.style.display = "block";
    },
    addToCompare(title, kpi) {
      const exists = [...compareListContainer.querySelectorAll('.card')]
        .some(card => card.querySelector('h3')?.textContent === title);
      if (!exists) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${title}</h3>
          <p><strong>KPI:</strong> ${kpi}</p>
          <div style="text-align: right;">
            <button class="remove-btn">削除</button>
          </div>
        `;
        compareListContainer.appendChild(card);
      }
    }
  };

  // モーダル閉じるボタン
  closeBtn.addEventListener('click', () => {
    SORA_UI.closeModals();
  });

  closeMapBtn.addEventListener('click', () => {
    SORA_UI.closeModals();
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal || event.target === mapModal) {
      SORA_UI.closeModals();
    }
  });

  // ミニマップクリック時
  const miniMap = document.getElementById('miniMap');
  miniMap.addEventListener('click', () => {
    SORA_UI.openMapModal();
  });

  // ファイル選択時
  fileInput.addEventListener('change', (event) => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
      fileNameDisplay.textContent = "ファイルを選択してください";
    }
  });

  // 比較リストから削除ボタン
  compareListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const card = event.target.closest('.card');
      if (card) card.remove();
    }
  });

});
