export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  // ✅ Base64のヘッダー部分を除去（data:image/png;base64,... → ...）
  const base64Raw = image.split(',')[1];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `以下の商品画像をもとに、各言語でシンプルな商品説明を80文字以内で生成してください。

🟩 日本語:
🟦 英語:
🟥 中国語（簡体字）:
🟨 韓国語:

※商品の特徴・魅力・使い方などを簡潔に紹介してください。`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Raw}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "[応答なし]";

    res.status(200).json({ result: raw });

  } catch (error) {
    console.error("Vision API error:", error);
    res.status(500).json({ error: "OpenAI Vision API error" });
  }
}
