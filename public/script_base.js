document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const regionInput = document.getElementById("regionName");
  const userNoteInput = document.getElementById("userNote");
  const canvasResult = document.getElementById("canvasResult");

  analyzeBtn.addEventListener("click", async () => {
    const region = regionInput.value.trim();
    const note = userNoteInput.value.trim();

    if (!region && !note) {
      alert("地域名とテーマの両方を入力してください。");
      return;
    } else if (!region) {
      alert("地域名を入力してください。");
      return;
    } else if (!note) {
      alert("テーマや自由記述を入力してください。");
      return;
    }

    const prompt = `${region}について、テーマ「${note}」に基づく地域課題を抽出してください。`;

    canvasResult.textContent = "課題抽出中...";

    try {
      const response = await fetch("https://sora-kpi.vercel.app/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("ChatGPT APIが無効な応答を返しました。");
      }

      const data = await response.json();
      canvasResult.innerHTML = `<pre>${data.text}</pre>`;
    } catch (error) {
      canvasResult.textContent = "エラーが発生しました。";
      console.error("ChatGPT APIエラー:", error);
    }
  });
});
