
// DOM読み込み後に初期化
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded (Mock mode)");

  const chatArea = document.getElementById("chat-area");
  const inputField = document.getElementById("gpt-input");
  const sendButton = document.getElementById("send-button");
  const regionCard = document.getElementById("region-card");

  if (!chatArea || !inputField || !sendButton || !regionCard) {
    console.warn("⚠️ 必要な要素が1つ以上見つかりません");
    return;
  }

  sendButton.addEventListener("click", () => {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    // ユーザー入力表示
    const userMessage = document.createElement("p");
    userMessage.className = "text-sm text-blue-700";
    userMessage.textContent = `👤 あなた: ${userInput}`;
    chatArea.appendChild(userMessage);

    // Mock応答生成（地域名を抽出して簡易応答を生成）
    const areaName = userInput.replace("について教えて", "").trim();
    const replyText = `${areaName}は、自然に恵まれた地域で、観光資源や温泉が魅力です。現在は高齢化と人口減少が課題とされています。`;

    // 応答表示
    const reply = document.createElement("p");
    reply.className = "text-sm text-gray-700";
    reply.textContent = `SORA: ${replyText}`;
    chatArea.appendChild(reply);

    // 地域情報カードに反映
    regionCard.value = `${areaName}：人口約3万人、高齢化率35%、主要産業は観光と農業`;

    // 地図エリアがあればモックピンも可能（後で統合）
  });
});
