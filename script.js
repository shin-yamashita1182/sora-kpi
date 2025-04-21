// script.js（GPTテスト分析用関数追加）

// 既存関数群（autoCompleteなど）がある前提で、追記部分のみ示します。

async function runGPTTest() {
  const input = document.getElementById("testInput").value;
  const responseDiv = document.getElementById("testResult");
  responseDiv.textContent = "送信中...";

  try {
    const res = await fetch("/api/testGPT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    responseDiv.textContent = data.result || data.error || "応答なし";
  } catch (e) {
    responseDiv.textContent = "エラー: " + e.message;
  }
}

