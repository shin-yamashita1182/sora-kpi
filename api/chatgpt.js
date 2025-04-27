const { Configuration, OpenAIApi } = require("openai");

// OpenAI APIキー設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// APIエンドポイント
async function chatgptHandler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ error: "Method not allowed" });
    return;
  }

  const { prompt, max_tokens } = req.body;

  try {
    const openaiResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: max_tokens || 1000, // ★ ここでクライアントから受け取ったmax_tokensを使う
      temperature: 0.7, // オプション：応答のクリエイティブさ
    });

    res.status(200).json({ reply: openaiResponse.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send({ error: "ChatGPT API呼び出し失敗" });
  }
}

module.exports = chatgptHandler;
