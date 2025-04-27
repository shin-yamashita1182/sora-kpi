async function generateInsight() {
  const region = document.getElementById("regionStaticInput").value;
  const theme = document.getElementById("freeInput").value;
  const type = document.getElementById("regionType").value;

  if (!region) {
    alert("地域名は必須入力です。");
    return;
  }

  const message = `
    地域名: ${region}
    地域分類: ${type}
    テーマ・自由記述: ${theme}

    上記の情報に基づいて、地域の課題や特徴を簡潔に整理してください。
  `;

  try {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        max_tokens: 2000 // ★ここだけ追加（ほかは一切いじっていない）
      }),
    });

    if (!response.ok) {
      throw new Error("ChatGPT APIエラー");
    }

    const data = await response.json();
    document.getElementById("gptResponse").innerText = data.reply || "応答がありませんでした。";
  } catch (error) {
    console.error(error);
    document.getElementById("gptResponse").innerText = "エラーが発生しました。";
  }
}
