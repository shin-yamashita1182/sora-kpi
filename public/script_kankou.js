import { createCard } from './script_base.js';

let masterData = [];   // JSON キャッシュ
let compareList = [];  // 比較リスト保持

window.addEventListener('DOMContentLoaded', () => {
  // JSON を最初に 1 回だけロード
  fetch('./kankou_master.json')
    .then(r => r.json())
    .then(data => { masterData = data; })
    .catch(err => alert('JSON 取得に失敗しました: ' + err.message));

  // ボタン押下でカード生成
  document.getElementById('generateBtn').addEventListener('click', () => {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';          // クリア

    masterData.slice(0, 12).forEach(item => { // ☆まず 12 件だけ描画（あとで絞り込み可）
      const card = createCard(item);
      // 詳細モーダル
      card.querySelector('.detail-btn').onclick = () => showDetail(item);
      // 比較リストへ
      card.querySelector('.compare-btn').onclick = () => addToCompare(item);
      resultsContainer.appendChild(card);
    });
  });
});

/* ===== 詳細表示 ===== */
function showDetail(item) {
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <h2>${item.title}</h2>
    <p>${item.overview}</p>
    <p><strong>KPI:</strong> ${item.kpi}</p>
    <p><strong>想定主体:</strong> ${item.actor}</p>
  `;
  document.getElementById('detailModal').style.display = 'block';
}

/* ===== 比較リスト操作 ===== */
function addToCompare(item) {
  // 2 重追加防止
  if (compareList.find(i => i.title === item.title)) return;

  compareList.push(item);
  renderCompare();
}

function removeFromCompare(title) {
  compareList = compareList.filter(i => i.title !== title);
  renderCompare();
}

function renderCompare() {
  const container = document.getElementById('compareListContainer');
  container.innerHTML = '';

  compareList.forEach(item => {
    const card = createCard(item, true);
    card.querySelector('.remove-btn').onclick = () => removeFromCompare(item.title);
    container.appendChild(card);
  });
}
