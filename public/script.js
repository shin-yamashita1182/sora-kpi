document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  // 詳細ボタンに対応
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      modalBody.innerHTML = parentCard.innerHTML;
      modal.style.display = "block";
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // 🌟 課題抽出ボタン押下時の処理
  const generateBtn = document.getElementById('generateBtn');
  const resultsContainer = document.getElementById('resultsContainer');

  generateBtn.addEventListener('click', () => {
    // 仮のデモデータ作成（今は固定で5件）
    const demoData = [
      "観光資源活用の促進",
      "地域特産品ブランド化",
      "移住促進プロジェクト",
      "高齢者向けサービス拡充",
      "地域交通インフラ改善"
    ];

    // 既存データをリセット
    resultsContainer.innerHTML = "";

    // デモデータからカードを作成
    demoData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${item}</h3>
        <button class="detail-btn">詳細</button>
      `;
      resultsContainer.appendChild(card);
    });
  });
});
