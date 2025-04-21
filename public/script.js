// script.js - ログ付き診断版（最終確認用）
console.log("✅ script.js loaded!");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded!");

  const chatArea = document.querySelector("#chat-area");
  const pointsList = document.querySelector("#points-list");
  const inputArea = document.querySelector("#gpt-input");
  const micButton = document.querySelector("#mic-button");
  const sendButton = document.querySelector("#send-button");

  if (!chatArea || !pointsList || !inputArea || !micButton || !sendButton) {
    console.warn("⚠️ 必要な要素が1つ以上見つかりません");
    return;
  }

  console.log("🎤 マイク・送信・入力欄 検出OK");

  // ChatGPT連携
  const sendMessage = async () => {
    const userMessage = inputArea.value.trim();
    if (!userMessage) return;
    console.log("📤 送信内容:", userMessage);

    const userBubble = document.createElement("p");
    userBubble.className = "text-sm text-gray-900 mb-1";
    userBubble.textContent = `🧑‍💻 あなた: ${userMessage}`;
    chatArea.appendChild(userBubble);
    inputArea.value = "";

    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();

      if (data.reply) {
        const gptBubble = document.createElement("p");
        gptBubble.className = "text-sm text-gray-700 mb-2";
        gptBubble.textContent = `SORA: ${data.reply}`;
        chatArea.appendChild(gptBubble);

        const summary = data.reply.split("。").slice(0, 3);
        pointsList.innerHTML = "";
        summary.forEach((line) => {
          if (line.trim()) {
            const li = document.createElement("li");
            li.className = "text-gray-600 text-sm";
            li.textContent = line.trim();
            pointsList.appendChild(li);
          }
        });
      } else {
        throw new Error("No reply from API");
      }
    } catch (err) {
      const errMsg = document.createElement("p");
      errMsg.className = "text-sm text-red-500";
      errMsg.textContent = "SORA: GPT応答に失敗しました。";
      chatArea.appendChild(errMsg);
      console.error("ChatGPT Error:", err);
    }
  };

  inputArea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  sendButton.addEventListener("click", () => {
    console.log("📤 送信ボタンがクリックされました");
    sendMessage();
  });

  micButton.addEventListener("click", () => {
    console.log("🎤 マイクボタンがクリックされました");
  });

  // 出力ボタン動作確認
  document.querySelector(".bg-green-500")?.addEventListener("click", () => {
    alert("📄 PDF出力機能は今後追加予定です");
    console.log("📄 PDF出力ボタン押下");
  });
  document.querySelector(".bg-gray-500")?.addEventListener("click", () => {
    alert("💾 ログ保存機能は今後追加予定です");
    console.log("💾 ログ保存ボタン押下");
  });
});
