// ✅ 地域自由入力版 script.js（テスト用）

document.addEventListener('DOMContentLoaded', () => {
  const validateButton = document.getElementById('validateButton');
  const regionInput = document.getElementById('regionInput');
  const validationResult = document.getElementById('validationResult');

  validateButton.addEventListener('click', async () => {
    const userInput = regionInput.value.trim();

    if (!userInput) {
      validationResult.innerHTML = "<p style='color:red;'>地域名を入力してください。</p>";
      return;
    }

    validationResult.innerHTML = "<p>施策生成中...</p>";

    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${userInput}に関する地域施策を出力してください。` })
      });

      if (!response.ok) {
        throw new Error('施策の取得に失敗しました。');
      }

      const data = await response.json();
      validationResult.innerHTML = `<p><strong>提案施策：</strong><br>${data.result}</p>`;
    } catch (error) {
      console.error(error);
      validationResult.innerHTML = "<p style='color:red;'>施策の取得に失敗しました。</p>";
    }
  });
});
