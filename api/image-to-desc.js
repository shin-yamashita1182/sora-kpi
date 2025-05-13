export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  // ✅ Base64画像のデータ部分だけを抽出（先頭の "data:image/png;base64," を除く）
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
                text: `この商品画像をもとに以下の形式で説明を作ってください：

🟩 日本語: （80文字以内の商品紹介）
🟦 英語: （英語での同様の商品紹介）
🟥 中国語（簡体字）: （同様）
🟨 韓国語: （同様）

※シンプルで実用的な説明にしてください。`
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
    const resultText = data.choices?.[0]?.message?.content?.trim() || "[応答なし]";
    res.status(200).json({ result: resultText });

  } catch (error) {
    console.error("Vision API error:", error);
    res.status(500).json({ error: "OpenAI Vision API error" });
  }
}
