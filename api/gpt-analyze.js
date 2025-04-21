export default async function handler(req, res) {
  try {
    const { inputText } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: `以下の郵便番号または地域名から、次の形式で返答してください：
{
  "region": "福岡市東区",
  "population": "約12万人",
  "industry": "製造業と観光業",
  "latitude": 33.606,
  "longitude": 130.418
}
入力: ${inputText}`
        }]
      })
    });

    const json = await response.json();
    const result = json.choices?.[0]?.message?.content;

    res.status(200).send(result);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}