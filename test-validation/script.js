// script.js

// 仮地域マスター
const regionMaster = [
    "佐賀県鳥栖市",
    "佐賀県小城市",
    "長崎県長崎市",
    "長崎県五島市",
    "長崎県新上五島町",
    "福岡県福岡市",
];

// 仮トリガーデータ
const triggerMaster = {
    "佐賀県鳥栖市": "交通インフラ強化プロジェクト",
    "佐賀県小城市": "観光資源開発プロジェクト",
    "長崎県長崎市": "都市活性化プロジェクト",
    "長崎県五島市": "離島振興プロジェクト",
    "長崎県新上五島町": "地域医療充実プロジェクト",
    "福岡県福岡市": "スタートアップ支援プロジェクト",
};

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

// バリデーション＋トリガー生成＋結果表示
function handleValidationAndTrigger() {
    const inputText = document.getElementById('regionInput').value;
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = ''; // 初期化

    const validationResult = validateRegionForTrigger(inputText);

    if (validationResult.status === "success") {
        const region = validationResult.region;
        const trigger = triggerMaster[region] || "（仮）施策情報なし";
        resultArea.innerHTML = `<div><strong>地域：</strong>${region}</div><div><strong>施策：</strong>${trigger}</div>`;
    } else {
        resultArea.innerHTML = `<div style="color:red;">${validationResult.message}</div>`;
        if (validationResult.status === "multiple") {
            resultArea.innerHTML += `<div><strong>候補地域:</strong> ${validationResult.candidates.join(", ")}</div>`;
        }
    }
}
