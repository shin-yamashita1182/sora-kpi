// script.js - ChatGPTと連携するクライアントサイドスクリプト（Vercel用）
document.addEventListener("DOMContentLoaded", () => {
  const chatArea = document.querySelector(".bg-gray-50");
  const pointsList = document.querySelector(".bg-gray-100 ul");
  const inputArea = document.querySelector("#gpt-input");

  inputArea.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const userMessage = inputArea.value.trim();
      if (!userMessage) return;

      // 表示にユーザーメッセージ追加
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

          // 会話の要点を仮抽出（簡易）
          const summary = data.reply.split("。").slice(0, 3); // 最初の3文だけ抽出
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
    }
  });
});
