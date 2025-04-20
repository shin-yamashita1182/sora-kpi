// script.js

document.getElementById("regionName").addEventListener("change", autoComplete);

async function autoComplete() {
  const region = document.getElementById("regionName").value;
  if (!region) return;

  const resultDiv = document.getElementById("gptResult");
  resultDiv.innerText = "ChatGPTによる分析中...";

  try {
    const response = await fetch("/api/gpt-analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ regionName: region }),
    });

    if (!response.ok) throw new Error("GPT通信失敗");

    const data = await response.json();

    if (data.result) {
      resultDiv.innerText = data.result;
    } else {
      resultDiv.innerText = "GPTの応答が正しく取得できませんでした。";
    }
  } catch (err) {
    console.error("GPT連携エラー:", err);
    resultDiv.innerText = "ChatGPT連携に失敗しました。";
  }
}