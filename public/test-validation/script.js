let mindTriggerMaster = {};  // MindTriggerマスターをグローバルに定義
// 未来版 script.js 応答検証優先版

// DOM読み込み後にイベントを設定
document.addEventListener("DOMContentLoaded", async () => {
  await loadMindTriggerMaster();  // ★最初にマスターを読み込む
  setupExtractButton();           // ★ボタン設定を分ける
}); // ←ここでしっかり閉じる！ (26行目)

// そして次に新しい関数定義
function setupExtractButton() {
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
}); // ★←ここ！クリックイベントの中をここで閉じる！
} // ★←そしてここ！setupExtractButton()関数自体をここで閉じる！

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
async function loadMindTriggerMaster() {
  try {
    const response = await fetch('./mind_trigger_kankou.json');  // ★必ず ./mind_trigger_kankou.json ！
    if (!response.ok) throw new Error('MindTriggerMaster読み込み失敗');
    mindTriggerMaster = await response.json();
    console.log("MindTriggerMaster読み込み完了:", mindTriggerMaster);
  } catch (error) {
    console.error('MindTriggerMaster読み込みエラー:', error);
  }
}
function handleMindTrigger(taskText) {
  const selected = mindTriggerMaster[taskText];

  if (selected) {
    showMindModal(selected.mind, selected.strategies);
  } else {
    alert("この課題に対応するマインド起点データがまだ設定されていません。");
  }
}
function showMindModal(mindText, strategyList) {
  const modal = document.createElement('div');
  modal.className = 'mind-modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = '#fff';
  modal.style.padding = '20px';
  modal.style.borderRadius = '12px';
  modal.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  modal.style.zIndex = '1000';
  modal.style.maxWidth = '500px';
  modal.style.width = '90%';
  modal.style.maxHeight = '80%';
  modal.style.overflowY = 'auto';

  let html = `<h2>🧠 マインド起点: ${mindText}</h2><ul style="padding: 0; list-style: none;">`;

  strategyList.forEach(strategy => {
    html += `<li style="margin-bottom: 15px;">
      <strong>${strategy.title}</strong><br>
      <span>${strategy.overview}</span>
    </li>`;
  });

  html += `</ul><button id="closeModal" style="margin-top: 20px;">閉じる</button>`;

  modal.innerHTML = html;
  document.body.appendChild(modal);

  document.getElementById('closeModal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
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
               handleMindTrigger(itemText.trim());
});
            list.appendChild(listItem);
        }
    });

    responseArea.appendChild(list);
}
// mind_trigger_kankou_click.jsonをロード
let clickData = [];

fetch('mind_trigger_kankou_click.json')
  .then(response => response.json())
  .then(data => {
    clickData = data;
  })
  .catch(error => console.error('クリック用データ読み込みエラー:', error));

// 課題リストのクリックイベント登録
document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('trigger-item')) {
    const clickedTitle = event.target.textContent.trim();

    const matchedData = clickData.find(item => item.title === clickedTitle);

    if (matchedData) {
      document.getElementById('modalTitle').textContent = matchedData.title;
      document.getElementById('modalDescription').textContent = matchedData.description;
      document.getElementById('modalAction').textContent = matchedData.action;
      document.getElementById('modal').style.display = 'block';
    } else {
      document.getElementById('modalTitle').textContent = clickedTitle;
      document.getElementById('modalDescription').textContent = "この課題に対応するマインド起点データがまだ設定されていません。";
      document.getElementById('modalAction').textContent = "-";
      document.getElementById('modal').style.display = 'block';
    }
  }
});

// モーダル閉じる処理
document.getElementById('closeModal').addEventListener('click', function() {
  document.getElementById('modal').style.display = 'none';
});
