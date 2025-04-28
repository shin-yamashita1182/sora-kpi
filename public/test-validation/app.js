// --- Future Version: 仮戦略カード生成ゾーン --- //

const generatedTaskList = [
  "観光情報発信力の強化",
  "地域文化体験資源の開発",
  "交通アクセス改善",
  "エコツーリズム推進"
];

const colorMap = {
  "財務": "blue",
  "社会": "green",
  "文化": "red",
  "環境": "yellowgreen"
};

const targetViewMap = {
  "観光情報発信力の強化": "財務",
  "地域文化体験資源の開発": "文化",
  "交通アクセス改善": "社会",
  "エコツーリズム推進": "環境"
};

function generateStrategyCards() {
  const container = document.getElementById('generatedTasks');
  container.innerHTML = '';

  generatedTaskList.forEach(task => {
    const card = document.createElement('div');
    const viewpoint = targetViewMap[task] || "社会";
    const color = colorMap[viewpoint] || "gray";

    card.className = `strategy-card strategy-${color}`;
    card.innerHTML = `
      <div class="card-header">
        <h3>${task}</h3>
        <button class="delete-btn">×</button>
      </div>
      <p class="card-description">ここに戦略説明が入ります。</p>
      <small class="viewpoint-tag">視点: ${viewpoint}</small>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.strategy-card').remove();
    });
  });
}

// 仮テスト用：ページロード時にカード生成
window.addEventListener('DOMContentLoaded', generateStrategyCards);

// 仮戦略リスト生成ボタン押下時に仮戦略カード生成を実行
document.getElementById('generateStrategyBtn').addEventListener('click', generateStrategyCards);
