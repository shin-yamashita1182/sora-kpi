import { OpenAI } from "openai";
import fetch from "node-fetch";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { inputText, classifyMode } = req.body;

    const messages = classifyMode
      ? [{ role: "user", content: `以下の地域課題をBSC分類してください: ${inputText}` }]
      : [{ role: "user", content: `${inputText} に関する地域情報を教えてください。人口、産業、観光、緯度経度を含めてJSON形式で返してください。` }];

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages
    });

    const result = chatCompletion.choices[0]?.message?.content;
    res.status(200).send(result || "No response");
  } catch (err) {
    console.error("GPT通信エラー:", err);
    res.status(500).json({ error: "Request failed", detail: err.message });
  }
};
