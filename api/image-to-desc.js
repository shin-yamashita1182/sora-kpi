export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "画像がありません" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `以下の画像を見て、日本語、英語、中国語（簡体字）、韓国語で商品説明を生成してください。形式は以下のように：
日本語: ○○
英語: ○○
中国語（簡体字）: ○○
韓国語: ○○`,
              },
              {
                type: "image_url",
                image_url: {
                  url: image, // ✅ base64形式で "data:image/png;base64,xxxx..." をそのまま渡す
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await openaiRes.json();

    if (data.error) {
      console.error("Vision API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const result = data.choices?.[0]?.message?.content || "説明を取得できませんでした。";
    res.status(200).json({ result });

  } catch (err) {
    console.error("Vision連携エラー:", err);
    res.status(500).json({ error: "Vision API通信エラー" });
  }
}
