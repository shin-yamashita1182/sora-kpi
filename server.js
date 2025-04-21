
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
    const prompt = `${region}の基本情報と地域課題について、簡潔に2～3点だけ箇条書きで示してください。`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = completion.data.choices[0].message.content;
    return res.json({ summary });
  } catch (error) {
    console.error('GPT Error:', error.message);
    return res.status(500).json({ error: 'GPTとの連携に失敗しました。' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
