const { Configuration, OpenAIApi } = require("openai");

// OpenAI APIキー設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ChatGPT APIハンドラ
async function chatgptHandler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt, max_tokens } = req.body; // ★ここでmax_tokensも受け取る

  try {
    const openaiResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: max_tokens || 1000, // ★ここでmax_tokensをOpenAIに渡す！（なければデフォルト1000）
      temperature: 0.7,
    });

    const reply = openaiResponse.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "ChatGPT API呼び出し失敗" });
  }
}

module.exports = chatgptHandler;
