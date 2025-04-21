
import OpenAI from "openai";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/region-info", async (req, res) => {
  const { zipOrRegion } = req.body;

  if (!zipOrRegion) {
    return res.status(400).json({ error: "郵便番号または地域名が必要です" });
  }

  const prompt = `
次の地域に関する基本情報を箇条書きで出力してください：
1. 地名（正式名称）
2. 人口と高齢化の傾向（推定でも可）
3. 主な産業や特産品
4. 教育・観光資源（地域の特徴）
5. 交通インフラ（IC・SA・港など）
6. 現在の課題や傾向（簡潔に）

対象地域: ${zipOrRegion}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const reply = completion.choices[0].message.content;
    res.json({ regionInfo: reply });
  } catch (error) {
    console.error("地域補完エラー:", error);
    res.status(500).json({ regionInfo: "取得中にエラーが発生しました。" });
  }
});

export default app;
