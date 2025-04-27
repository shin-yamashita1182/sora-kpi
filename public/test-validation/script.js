// 未来版 script.js 応答検証優先版

// DOM読み込み後にイベントを設定
document.addEventListener("DOMContentLoaded", () => {
  const extractButton = document.getElementById("extractButton");

  extractButton.addEventListener("click", () => {
    const region = document.getElementById("regionStaticInput").value.trim();
    const freeInput = document.getElementById("freeInput").value.trim();

    if (!region) {
      alert("地域名（市・区・町・村など）を必ず入力してください。");
      return;
    }

    const prompt = `対象地域: ${region}\nテーマ・課題: ${freeInput}`;

    generateInsight(prompt);
    triggerMap(region);
  });
});

// ChatGPTへのリクエスト送信関数
async function generateInsight(prompt) {
  try {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("ChatGPT APIエラー");
    }

    const data = await response.json();
    document.getElementById("gptResponse").innerText = data.result;
  } catch (error) {
    console.error("インサイト生成エラー:", error);
    document.getElementById("gptResponse").innerText = "インサイト生成中にエラーが発生しました。";
  }
}

// 地図表示用トリガー関数（仮実装）
function triggerMap(region) {
  console.log(`地図トリガー: ${region} の地図を表示します（仮）`);
  // ここに実際の地図描画処理を後で追加します
}
