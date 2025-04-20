import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { inputText, classifyMode } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: "Input is required." });
  }

  try {
    const prompt = classifyMode
      ? `以下はある地域の自由記述メモです。地域課題として分類し、各課題に応じた対策カテゴリを日本語で明確に提示してください。

${inputText}`
      : `あなたは地域分析の専門家です。以下の郵便番号や地域名から、その地域の基本情報を日本語で出力してください。以下の12項目でお願いします：
地域名：
人口：
高齢化率：
世帯数：
主な産業：
地場産品：
観光資源：
小学校数：
保育園数：
災害リスク：
過疎度分類：
経済圏分類：
最寄IC・SA：

対象：${inputText}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "あなたは地域経営の専門家です。" },
        { role: "user", content: prompt }
      ]
    });

    const result = response.choices[0].message.content;

    // 緯度経度をオプションとして仮設定（将来：GPTに座標も生成させる）
    const dummyLatLng = {
      lat: 31.933,
      lng: 130.983,
      region: inputText
    };

    res.status(200).json({
      result,
      ...(classifyMode ? {} : dummyLatLng)
    });
  } catch (err) {
    console.error("GPT-API Error:", err);
    res.status(500).json({ error: "OpenAI API error" });
  }
}