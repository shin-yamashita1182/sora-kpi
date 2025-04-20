// api/gpt-analyze.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { regionName } = req.body;

  if (!regionName) {
    return res.status(400).json({ error: "Region name is required" });
  }

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたは地域経営の専門家です。地域名から、その地域の特性・観光資源・課題を簡潔に3点程度出力してください。",
        },
        {
          role: "user",
          content: `地域名：${regionName}`,
        },
      ],
    });

    const result = gptResponse.choices[0].message.content;
    return res.status(200).json({ result });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "GPT処理中にエラーが発生しました。" });
  }
}