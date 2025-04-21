
// script.js - ChatGPT API連携用（ID修正済み）
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded!");

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

    const userMessage = document.createElement("p");
    userMessage.className = "text-sm text-blue-700";
    userMessage.textContent = `👤 あなた: ${userInput}`;
    chatArea.appendChild(userMessage);

    fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    })
    .then(res => res.json())
    .then(data => {
      const reply = document.createElement("p");
      reply.className = "text-sm text-gray-700";
      reply.textContent = `SORA: ${data.reply}`;
      chatArea.appendChild(reply);

      regionCard.value = data.reply;
    })
    .catch(err => {
      console.error("❌ GPT APIエラー", err);
    });

    inputField.value = "";
  });
});
