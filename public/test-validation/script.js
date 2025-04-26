// --------------------
// 地域情報保存処理
// --------------------
function saveRegionInfo() {
    const regionName = document.getElementById('regionNameInput').value.trim();
    const regionType = document.getElementById('regionTypeSelect').value;
    const regionFile = document.getElementById('regionFileUpload').files[0];

    if (!regionName) {
        alert('地域名を入力してください。');
        return;
    }

    console.log("地域情報を保存:", { regionName, regionType, regionFile });

    alert("地域情報を保存しました！");
}

// --------------------
// 地域インサイト生成処理（最終動作版合わせ）
// --------------------
async function generateInsight() {
    const freeInput = document.getElementById('freeInput').value.trim();

    if (!freeInput) {
        alert("自由記述欄に地域への想いや課題を書いてください。");
        return;
    }

    try {
        const response = await fetch('/api/chatgpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                regionName: freeInput  // ✅ regionNameキーだけで送信（動作版と完全一致）
            })
        });

        if (!response.ok) {
            throw new Error('ChatGPT APIエラー');
        }

        const data = await response.json();
        console.log("ChatGPT応答:", data);

        // 第1トリガー応答表示
        document.getElementById('firstTriggerOutput').innerText = data.text || "応答がありませんでした。";

        // フィルタリング処理を呼び出す
        filterWithMasterData(data.text);

    } catch (error) {
        console.error('インサイト生成エラー:', error);
        alert('インサイト生成中にエラーが発生しました。');
    }
}

// --------------------
// フィルタリング＋第2トリガー生成処理
// --------------------
function filterWithMasterData(gptResponseText) {
    if (!gptResponseText) {
        document.getElementById('secondTriggerOutput').innerText = "フィルタリング対象がありません。";
        return;
    }

    // 仮マスターデータ（後で拡張）
    const masterData = [
        { keyword: '観光資源', title: '観光資源活用プロジェクト' },
        { keyword: '地域交流', title: '地域交流拠点整備' },
        { keyword: 'デジタル化', title: '地域デジタル化推進' },
        { keyword: '移住促進', title: '移住促進キャンペーン' }
    ];

    let matched = [];

    masterData.forEach(item => {
        if (gptResponseText.includes(item.keyword)) {
            matched.push(item.title);
        }
    });

    if (matched.length > 0) {
        document.getElementById('secondTriggerOutput').innerHTML = matched.map(title => `<li>${title}</li>`).join('');
    } else {
        document.getElementById('secondTriggerOutput').innerText = "関連施策が見つかりませんでした。";
    }
}
