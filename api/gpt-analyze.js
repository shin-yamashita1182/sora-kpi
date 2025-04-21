import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { inputText, classifyMode } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: '入力テキストがありません' });
  }

  const prompt = classifyMode
    ? `以下の内容をもとに、地域課題を4つのカテゴリ（①地域経済、②教育・人材、③福祉・医療、④環境・防災）で分類してください。\n\n${inputText}`
    : `以下の地域名に関する基本情報（人口、主要産業、観光名所など）をJSON形式で簡潔に出力してください。\n\n地域名: ${inputText}`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    const output = data.choices?.[0]?.message?.content || '[応答なし]';
    res.status(200).send(output);

  } catch (err) {
    console.error('GPT通信エラー:', err);
    res.status(500).json({ error: 'GPT呼び出しに失敗しました', detail: err.message });
  }
}
