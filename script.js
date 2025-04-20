// 👇 この関数を完全に置き換えてください！
async function autoComplete() {
  const region = document.getElementById("region").value;
  if (!region) return alert("地域名を入力してください");

  const prompt = `「${region}」という地域について、以下の情報を2文ずつで簡潔に出力してください：\n- 人口\n- 高齢化率\n- 地場産業\n- 観光資源`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const text = data.choices[0].message.content;
      const lines = text.split("\n").filter(line => line.trim() !== "");

      document.getElementById("population").textContent = lines[0] || "―";
      document.getElementById("aging").textContent = lines[1] || "―";
      document.getElementById("industry").textContent = lines[2] || "―";
      document.getElementById("tourism").textContent = lines[3] || "―";
    } else {
      alert("GPTの応答がありません。");
    }
  } catch (error) {
    console.error("GPT連携エラー:", error);
    alert("GPTとの通信に失敗しました。APIキーやネットワークを確認してください。");
  }
}
