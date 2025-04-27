export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4-1106-preview', // ←ここ重要！！
                messages: [
                    { role: "system", content: "あなたは地域施策の専門家です。" },
                    { role: "user", content: prompt }
                ],
               max_tokens: req.body.max_tokens || 1000,
            }),
        });

        const data = await response.json();
        res.status(200).json({ result: data.choices[0].message.content.trim() });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OpenAI API error' });
    }
}
