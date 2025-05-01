document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const regionInput = document.getElementById("regionName");
  const userNoteInput = document.getElementById("userNote");
  const canvasResult = document.getElementById("canvasResult");
  const miniMap = document.getElementById("miniMap");
  const nexcoToggleBtn = document.getElementById("toggleNexcoBtn");
  const nexcoInfo = document.getElementById("nexcoInfo");

  // アラート表示エリアの自動生成
  const alertArea = document.getElementById("alertArea") || (() => {
    const div = document.createElement("div");
    div.id = "alertArea";
    div.style.color = "red";
    div.style.fontWeight = "bold";
    div.style.padding = "0.5em";
    div.style.marginBottom = "1em";
    document.body.insertBefore(div, document.body.firstChild);
    return div;
  })();

  function showAlert(msg) {
    alertArea.textContent = msg;
    setTimeout(() => {
      alertArea.textContent = "";
    }, 4000);
  }

  let hasFetched = false;

  analyzeBtn.addEventListener("click", async () => {
    const region = regionInput.value.trim();
    const note = userNoteInput.value.trim();

    if (!region && !note) {
      showAlert("地域名とテーマの両方を入力してください。");
      return;
    } else if (!region) {
      showAlert("地域名を入力してください。");
      return;
    } else if (!note) {
      showAlert("テーマや自由記述を入力してください。");
      return;
    }

    if (hasFetched) {
      showAlert("すでに課題は抽出されています。ページを更新することで再実行できます。");
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

      // 地図表示はGPT応答後にのみ行う
      miniMap.innerHTML = `<iframe width="100%" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps?q=${encodeURIComponent(region)}&output=embed" allowfullscreen></iframe>`;
    } catch (error) {
      canvasResult.textContent = "エラーが発生しました。";
      console.error("ChatGPT APIエラー:", error);
      showAlert("課題抽出中にエラーが発生しました。管理者に連絡してください。");
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

