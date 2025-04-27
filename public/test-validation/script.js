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
    displayChatGptResponseAsList(data.result);
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
// ChatGPTから応答を受け取ったときにリスト化する関数
function displayChatGptResponseAsList(responseText) {
    const responseArea = document.getElementById('gptResponse');
    responseArea.innerHTML = '';

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    const items = responseText.trim().split('\n');

    items.forEach((itemText, index) => {
        if (itemText.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = itemText.trim();
            listItem.style.marginBottom = '10px';
            listItem.style.padding = '12px 15px';
            listItem.style.backgroundColor = '#f5f5f5';
            listItem.style.borderRadius = '8px';
            listItem.style.cursor = 'pointer';
            listItem.style.transition = 'background-color 0.3s, transform 0.2s';
            listItem.setAttribute('data-index', index);

            listItem.addEventListener('mouseover', () => {
                listItem.style.backgroundColor = '#e0e0e0';
                listItem.style.transform = 'scale(1.02)';
            });
            listItem.addEventListener('mouseout', () => {
                listItem.style.backgroundColor = '#f5f5f5';
                listItem.style.transform = 'scale(1)';
            });

            listItem.addEventListener('click', () => {
                listItem.addEventListener('click', () => {
  handleMindTrigger(itemText.trim());
});
            list.appendChild(listItem);
        }
    });

    responseArea.appendChild(list);
}
