function generateTask() {
  const task = prompt("中間目標やKPIを入力してください：");
  if (!task) return;

  // 仮の生成ロジック（Step②でGPTに置き換え予定）
  const suggestion = `✅「${task}」に基づく実行策例：
- 関係者との定期会議を開催
- KPI進捗の可視化ダッシュボードを設置
- 実行担当を明確化し週次レビュー`;

  const taskList = document.getElementById("task-list");
  const div = document.createElement("div");
  div.className = "task-card";
  div.innerText = suggestion;
  taskList.appendChild(div);
}

function loadSoraSummary() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("sora_"));
  if (keys.length === 0) return;

  const data = JSON.parse(localStorage.getItem(keys[0]));
  const el = document.getElementById("sora-summary");

  const region = data.region || "（地域名不明）";
  const summary = data.summary || "（課題サマリー未設定）";
  const kpi = data.kpi || "（KPI未設定）";
  const goal = data.goal || "（中間目標未設定）";

  el.innerHTML = `
    <h2>📋 地域課題レポート</h2>
    <p><strong>地域:</strong> ${region}</p>
    <p><strong>課題:</strong> ${summary}</p>
    <p><strong>中間目標:</strong> ${goal}</p>
    <p><strong>KPI:</strong> ${kpi}</p>
  `;
}

window.onload = function () {
  loadSoraSummary();
};
