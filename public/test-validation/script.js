async function handleCheck() {
  const region = document.getElementById('regionInput').value.trim();
  const theme = document.getElementById('themeInput').value.trim();
  const additional = document.getElementById('additionalInput').value.trim();

  const combinedInput = `地域: ${region}\nテーマ: ${theme}\n補足情報: ${additional}`;

  try {
    const response = await fetch('/api/chatgpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionName: combinedInput })
    });

    if (!response.ok) {
      throw new Error('ChatGPT APIエラー');
    }

    const result = await response.json();

    // 応答を画面に表示
    document.getElementById('gptResponseCard').style.display = 'block';
    document.getElementById('resultArea').innerText = result.answer;

  } catch (error) {
    console.error('インサイト生成エラー:', error);
    alert('ChatGPTとの連携でエラーが発生しました');
  }
}

