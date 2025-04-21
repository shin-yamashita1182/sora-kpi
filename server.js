// server.js（GPT-4 + Railway Pro用 最終版）
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

app.post('/api/completeRegion', async (req, res) => {
  const { region } = req.body;

  if (!region) {
    return res.status(400).json({ error: '地域名が必要です。' });
  }

  try {
    const prompt = `${region}の地域特性と地域課題について、簡潔に3点だけ箇条書きで示してください。`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.7,
    });

    const summary = completion.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error('GPT Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'GPTとの連携に失敗しました。' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
