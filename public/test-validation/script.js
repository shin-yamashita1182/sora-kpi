// ✅ 地域自由入力版 (onclick対応版) script.js

async function handleValidationAndTrigger() {
    const regionInput = document.getElementById('regionInput').value.trim();
    const resultArea = document.getElementById('resultArea');

    if (!regionInput) {
        resultArea.innerHTML = '<span style="color:red;">地域名を入力してください。</span>';
        return;
    }

    resultArea.innerHTML = "<p>施策生成中...</p>";

    try {
        const response = await fetch('/api/chatgpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `${regionInput}に関連する地域施策を出力してください。`
            })
        });

        if (!response.ok) {
            throw new Error('施策の取得に失敗しました。');
        }

        const data = await response.json();
        resultArea.innerHTML = `<p><strong>提案施策：</strong><br>${data.result}</p>`;

    } catch (error) {
        console.error('Error:', error);
        resultArea.innerHTML = '<span style="color:red;">施策の取得に失敗しました。</span>';
    }
}
