// ✅ GPT連携で地域課題を抽出する関数を含んだ script.js

// 地域名を使ってGPTへ課題抽出を依頼する関数
async function completeRegionFromName() {
  const regionNameInput = document.getElementById('region-name');
  const outputArea = document.getElementById('region-analysis');

  if (!regionNameInput || !outputArea) {
    console.error("必要な要素が見つかりません");
    return;
  }

  const regionName = regionNameInput.value.trim();
  if (!regionName) {
    alert("地域名を入力してください。");
    return;
  }

  outputArea.value = "ChatGPTが分析中です...";

  try {
    const response = await fetch('/api/completeRegion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ region: regionName })
    });

    if (!response.ok) throw new Error("GPTからの応答に失敗しました");

    const data = await response.json();
    outputArea.value = data.summary || "地域課題の取得に失敗しました。";
  } catch (error) {
    console.error(error);
    outputArea.value = "エラーが発生しました。詳細はコンソールをご確認ください。";
  }
}

// ページ内にボタンがあるなら、それにイベント追加（必要に応じて）
const completeButton = document.getElementById('complete-region-button');
if (completeButton) {
  completeButton.addEventListener('click', completeRegionFromName);
}
