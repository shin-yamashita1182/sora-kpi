// script.js - 完全版（ChatGPT + 音声 + 出力ボタン対応）
document.addEventListener("DOMContentLoaded", () => {
  const chatArea = document.querySelector("#chat-area");
  const pointsList = document.querySelector("#points-list");
  const inputArea = document.querySelector("#gpt-input");
  const micButton = document.querySelector("#mic-button");
  const sendButton = document.querySelector("#send-button");

  // ChatGPT 送信処理
  const sendMessage = async () => {
    const userMessage = inputArea.value.trim();
    if (!userMessage) return;

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
  sendButton.addEventListener("click", sendMessage);

  // 音声認識対応
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputArea.value += transcript;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  } else {
    micButton.disabled = true;
    micButton.textContent = "🎤（非対応）";
  }

  // 出力ボタン（プレースホルダ）
  document.querySelector(".bg-green-500")?.addEventListener("click", () => {
    alert("📄 PDF出力機能は今後追加予定です");
  });
  document.querySelector(".bg-gray-500")?.addEventListener("click", () => {
    alert("💾 ログ保存機能は今後追加予定です");
  });
});
