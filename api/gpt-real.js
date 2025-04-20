const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { inputText, classifyMode } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set." });
  }

  const prompt = classifyMode
    ? `以下はある地域に関する自由記述です。内容を読み取り、地域課題として分類し、適切なカテゴリをつけて日本語で出力してください：\n\n${inputText}`
    : `あなたは日本全国の地域経営に精通したAIアドバイザーです。入力された郵便番号から対応する地域を仮定し、以下の12項目に分けて、実在しうる地域情報として日本語で簡潔に出力してください。\n\n地域名：\n人口：\n高齢化率：\n世帯数：\n主な産業：\n地場産品：\n観光資源：\n小学校数：\n保育園数：\n災害リスク：\n過疎度分類：\n経済圏分類：\n最寄IC・SA：\n\n対象：${inputText}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "あなたは地域経営の専門家です。" },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "OpenAI API error", detail: data.error.message });
    }

    res.status(200).json({
      result: data.choices[0].message.content,
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
