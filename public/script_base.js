document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const regionInput = document.getElementById("regionName");
  const userNoteInput = document.getElementById("userNote");
  const canvasResult = document.getElementById("canvasResult");
  const miniMap = document.getElementById("miniMap");
  const nexcoToggleBtn = document.getElementById("toggleNexcoBtn");
  const nexcoInfo = document.getElementById("nexcoInfo");

  let hasFetched = false;

  analyzeBtn.addEventListener("click", async () => {
    const region = regionInput.value.trim();
    const note = userNoteInput.value.trim();

    if (!region || !note) {
      alert("地域名とテーマを両方入力してください。");
      return;
    }

    if (hasFetched) {
      alert("すでに課題は抽出されています。ページを更新して再実行してください。");
      return;
    }

    hasFetched = true;

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

      if (!response.ok) {
        throw new Error(`ChatGPT APIエラー: ${response.status}`);
      }

      const data = await response.json();
      canvasResult.innerHTML = `<pre>${data.text}</pre>`;

      // ChatGPT応答後に初めて地図を表示
      miniMap.innerHTML = `<iframe width="100%" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps?q=${encodeURIComponent(region)}&output=embed" allowfullscreen></iframe>`;

    } catch (error) {
      canvasResult.textContent = "エラーが発生しました。";
      console.error("ChatGPT APIエラー:", error);
    }
  });

  // NEXCO連動（表示/非表示トグル）
  nexcoToggleBtn.addEventListener("click", async () => {
    if (nexcoInfo.style.display === "block") {
      nexcoInfo.style.display = "none";
      nexcoToggleBtn.textContent = "NEXCO情報を表示";
    } else {
      nexcoInfo.textContent = "NEXCO情報を取得中...";
      nexcoInfo.style.display = "block";
      nexcoToggleBtn.textContent = "NEXCO情報を閉じる";

      try {
        const region = regionInput.value.trim();
        const response = await fetch(`https://sora-kpi.vercel.app/api/nexco?region=${encodeURIComponent(region)}`);
        if (!response.ok) throw new Error("NEXCO API応答エラー");
        const data = await response.text();
        nexcoInfo.innerHTML = `<pre>${data}</pre>`;
      } catch (error) {
        nexcoInfo.textContent = "NEXCO情報の取得に失敗しました。";
        console.error("NEXCO APIエラー:", error);
      }
    }
  });
});
