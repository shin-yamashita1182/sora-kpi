// api/chatgpt.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { regionName, userNote } = req.body;

    if (!regionName || !userNote) {
      return res.status(400).json({ error: '地域名とテーマは必須です。' });
    }

    const prompt = `地域名「${regionName}」、テーマ「${userNote}」に関連する地域課題を、3〜5個のリスト形式で具体的に教えてください。`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'あなたは地域課題を整理するアシスタントです。' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const gptResponse = data.choices[0].message.content.trim();

      return res.status(200).json({ result: gptResponse });
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      return res.status(500).json({ error: 'エラーが発生しました。' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
