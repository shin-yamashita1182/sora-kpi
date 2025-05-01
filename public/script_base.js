
let chatInProgress = false;
let mapLoaded = false;

function loadMap(region) {
  if (mapLoaded) return;
  const mapElement = document.getElementById("miniMap");
  mapElement.innerHTML = `「${region}」の地図を表示中...`;
  mapLoaded = true;
}

async function fetchChatGPTResponse(prompt) {
  if (chatInProgress) return;
  chatInProgress = true;

  const canvas = document.getElementById("canvasResult");
  canvas.innerHTML = "ChatGPTからの応答を取得中...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    canvas.innerText = data.reply || "応答なし";
  } catch (err) {
    canvas.innerText = "エラーが発生しました";
  } finally {
    chatInProgress = false;
  }
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const region = document.getElementById("regionName").value.trim();
  const note = document.getElementById("userNote").value.trim();

  if (!region) {
    alert("地域名を入力してください");
    return;
  }

  alert("ChatGPTが課題を抽出します");

  const prompt = `地域名: ${region}\nテーマや自由記述: ${note}\nこの情報に基づき、地域課題を抽出してください。`;
  
  loadMap(region);
  fetchChatGPTResponse(prompt);
  // === 追加: 多重呼び出し制御用フラグ ===
let chatInProgress = false;
let mapLoaded = false;

// === 地図表示を初回のみ許可する関数 ===
function loadMap(region) {
  if (mapLoaded) return;
  const mapElement = document.getElementById("miniMap");
  mapElement.innerHTML = `「${region}」の地図を表示中...`;
  mapLoaded = true;
}

// === ChatGPTへ1回だけ送信（多重防止付き） ===
async function fetchChatGPTResponse(prompt) {
  if (chatInProgress) return;
  chatInProgress = true;

  const canvas = document.getElementById("canvasResult");
  canvas.innerHTML = "ChatGPTからの応答を取得中...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    canvas.innerText = data.reply || "応答なし";
  } catch (err) {
    canvas.innerText = "エラーが発生しました";
  } finally {
    chatInProgress = false;
  }
}

// === イベント接続（課題抽出ボタン） ===
document.getElementById("analyzeBtn").addEventListener("click", () => {
  const region = document.getElementById("regionName").value.trim();
  const note = document.getElementById("userNote").value.trim();

  if (!region) {
    alert("地域名を入力してください");
    return;
  }

  alert("ChatGPTが課題を抽出します");

  const prompt = `地域名: ${region}\\nテーマや自由記述: ${note}\\nこの情報に基づき、地域課題を抽出してください。`;

  loadMap(region);
  fetchChatGPTResponse(prompt);
});
});
