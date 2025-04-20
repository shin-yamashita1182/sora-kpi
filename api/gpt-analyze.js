import { OpenAI } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("❌ OPENAI_API_KEY is not defined. Check Vercel environment variables.");
}

const openai = new OpenAI({ apiKey });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { inputText, classifyMode } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: "Input text is required." });
  }

  try {
    const prompt = classifyMode
      ? `以下はある地域に関する自由記述です。内容を読み取り、地域課題として分類し、適切なカテゴリをつけて日本語で出力してください：\\n\\n${inputText}`
      : `以下の郵便番号または地域名に関する情報を、以下の12項目に分けて日本語で簡潔に出力してください。\\n地域名：\\n人口：\\n高齢化率：\\n世帯数：\\n主な産業：\\n地場産品：\\n観光資源：\\n小学校数：\\n保育園数：\\n災害リスク：\\n過疎度分類：\\n経済圏分類：\\n最寄IC・SA：\\n\\n対象：${inputText}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "あなたは地域経営の専門家です。" },
        { role: "user", content: prompt }
      ]
    });

    const result = response.choices[0].message.content;

    res.status(200).json({
      result,
      lat: 31.933,
      lng: 130.983,
      region: inputText
    });
  } catch (err) {
    res.status(500).json({
      error: "OpenAI API error",
      detail: err?.message || "Unknown error"
    });
  }
}
