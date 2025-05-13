// /api/image-to-desc.js（Node.js + OpenAI API）

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "画像データがありません" });
  }

  try {
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
            {
              type: "text",
              text: `以下の画像に写っている商品について、多言語の説明文を生成してください。

【出力形式】
- 日本語説明：
- 英語説明：

それぞれ1〜2文程度で簡潔に書いてください。販売促進を意識した表現で。`
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const resultText = visionResponse.choices[0].message.content;
    res.status(200).json({ result: resultText });
  } catch (err) {
    console.error("Vision API error:", err);
    res.status(500).json({ error: "Vision APIとの通信に失敗しました" });
  }
}
