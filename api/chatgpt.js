
import OpenAI from "openai";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chatgpt", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPTエラー:", error);
    res.status(500).json({ reply: "エラーが発生しました。" });
  }
});

export default app;
