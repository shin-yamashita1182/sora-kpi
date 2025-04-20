export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { inputText, classifyMode } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set." });
  }

  // ✅ テスト入力に対しては手動で模擬データを返す
  if (!classifyMode && inputText === "テスト") {
    return res.status(200).json({
      result: `地域名：宮崎県高原町
人口：9000人
高齢化率：35%
世帯数：4000
主な産業：農業、畜産業
地場産品：高原にんじん、高原みそ
観光資源：霧島連山、温泉郷
小学校数：3校
保育園数：2園
災害リスク：火山活動、土砂災害
過疎度分類：準過疎地域
経済圏分類：地方中核都市圏
最寄IC・SA：高原IC、えびのPA`,
      lat: 31.933,
      lng: 130.983,
      region: "宮崎県高原町"
    });
  }

  const prompt = classifyMode
    ? `以下はある地域に関する自由記述です。内容を読み取り、地域課題として分類し、適切なカテゴリをつけて日本語で出力してください：\n\n${inputText}`
    : `以下の郵便番号または地域名に関する情報を、以下の12項目に分けて日本語で簡潔に出力してください。\n地域名：\n人口：\n高齢化率：\n世帯数：\n主な産業：\n地場産品：\n観光資源：\n小学校数：\n保育園数：\n災害リスク：\n過疎度分類：\n経済圏分類：\n最寄IC・SA：\n\n対象：${inputText}`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "あなたは地域経営の専門家です。" },
          { role: "user", content: prompt }
        ]
      })
    });

    const json = await openaiRes.json();

    if (json.error) {
      return res.status(500).json({ error: "OpenAI API error", detail: json.error.message });
    }

    res.status(200).json({
      result: json.choices[0].message.content,
      lat: 31.933,
      lng: 130.983,
      region: inputText
    });
  } catch (err) {
    res.status(500).json({
      error: "Request failed",
      detail: err.message || "Unknown error"
    });
  }
}
