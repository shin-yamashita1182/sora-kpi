function generateTask() {
  const task = prompt("中間目標やKPIを入力してください：");

  if (!task) return;

  // 🧠 仮のGPT風メッセージ（ここはStep②でAPI化）
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
