// 仮地域マスター
const regionMaster = [
    "佐賀県鳥栖市",
    "佐賀県小城市",
    "長崎県長崎市",
    "長崎県五島市",
    "長崎県新上五島町",
    "福岡県福岡市",
];

// 地域名のバリデーション関数（部分一致＋複数マッチ制御版）
function validateRegionForTrigger(inputText) {
    inputText = inputText.trim().toLowerCase();

    const matchedRegions = regionMaster.filter(region =>
        region.toLowerCase().includes(inputText)
    );

    if (matchedRegions.length === 1) {
        console.log("✅ バリデーション成功:", matchedRegions[0]);
        return { status: "success", region: matchedRegions[0] };
    } else if (matchedRegions.length === 0) {
        console.log("❌ 地域が見つかりません。");
        return { status: "error", message: "地域が見つかりません。もう一度入力してください。" };
    } else {
        console.log("⚠️ 複数地域にマッチ。絞り込んでください。", matchedRegions);
        return { status: "multiple", message: "複数の地域が見つかりました。より具体的に入力してください。", candidates: matchedRegions };
    }
}

// ChatGPT API連携用関数
async function callChatGPT(prompt) {
    const apiKey = 'YOUR_API_KEY_HERE'; // ← ここにシンさんのOpenAI APIキーを入れてください！

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4', // 必要に応じて 'gpt-3.5-turbo' に変更可能
            messages: [
                { role: "system", content: "あなたは地域施策の専門家です。" },
                { role: "user", content: prompt }
            ],
            max_tokens: 300
        })
    });

    const data = await response.json();
    console.log('ChatGPT応答:', data);

    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else {
        throw new Error('GPT応答エラー');
    }
}

// バリデーション＋ChatGPT施策取得＋結果表示
async function handleValidationAndTrigger() {
    const inputText = document.getElementById('regionInput').value;
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = ''; // 初期化

    const validationResult = validateRegionForTrigger(inputText);

    if (validationResult.status === "success") {
        const region = validationResult.region;
        
        resultArea.innerHTML = `<div><strong>地域：</strong>${region}</div><div><em>ChatGPTに問い合わせ中...</em></div>`;

        try {
            const prompt = `${region}における最適な地域施策案を簡潔に提案してください。`;
            const gptResponse = await callChatGPT(prompt);

            resultArea.innerHTML = `<div><strong>地域：</strong>${region}</div><div><strong>施策：</strong>${gptResponse}</div>`;
        } catch (error) {
            console.error(error);
            resultArea.innerHTML = `<div style="color:red;">施策の取得に失敗しました。</div>`;
        }
    } else {
        resultArea.innerHTML = `<div style="color:red;">${validationResult.message}</div>`;
        if (validationResult.status === "multiple") {
            resultArea.innerHTML += `<div><strong>候補地域:</strong> ${validationResult.candidates.join(", ")}</div>`;
        }
    }
}
