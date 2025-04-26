// DOM が描画されたら実行
window.addEventListener('DOMContentLoaded', () => {
  // ファイル選択表示
  const fileInput = document.getElementById('fileInput');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  fileInput.addEventListener('change', () => {
    fileNameDisplay.textContent = fileInput.files[0]?.name || 'ファイルを選択してください';
  });

  // モーダル関連
  const detailModal  = document.getElementById('detailModal');
  const closeModal   = document.getElementById('closeModal');
  const mapModal     = document.getElementById('mapModal');
  const closeMap     = document.getElementById('closeMapModal');
  closeModal .onclick = () => detailModal.style.display = 'none';
  closeMap   .onclick = () => mapModal  .style.display = 'none';
  window.onclick = e => {
    if (e.target === detailModal) detailModal.style.display = 'none';
    if (e.target === mapModal)   mapModal  .style.display = 'none';
  };

  // クリックで拡大地図（いまは簡易プレースホルダ）
  document.getElementById('miniMap').addEventListener('click', () => {
    mapModal.style.display = 'block';
  });
});

/* ========== 共通描画関数 ========== */
export function createCard(item, withCompare = false) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.overview}</p>
    <p><strong>KPI:</strong> ${item.kpi}</p>
    <p><strong>主体:</strong> ${item.actor}</p>
    <button class="detail-btn">詳細</button>
    ${withCompare ? '<button class="remove-btn">削除</button>' : '<button class="compare-btn">比較へ追加</button>'}
  `;

  return card;
}
