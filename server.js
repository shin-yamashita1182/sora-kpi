// server.js（GPT-4 テストAPI専用・軽量構成）
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 🔹 GPT-4 テスト用ルート
app.post('/api/testGPT', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: '入力が必要です。' });

  try {
    console.log('📤 GPT送信内容:', message);
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      max_tokens: 256,
      temperature: 0.7,
    });

    const result = completion.data.choices[0].message.content;
    console.log('📥 GPT応答:', result);
    res.json({ result });
  } catch (error) {
    console.error('❌ GPTエラー:', error.response?.data || error.message);
    res.status(500).json({ error: 'GPTとの接続に失敗しました。' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
