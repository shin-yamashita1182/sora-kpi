export default async function handler(req, res) {
  const { inputText } = await req.json();

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `以下の郵便番号または地域名から、地域名、人口、主要産業、緯度経度を日本語＋数値形式のJSONで返してください。形式は以下：
{
  "地域名": "◯◯市◯◯区",
  "人口": "約12万人",
  "主要産業": "製造業と観光業",
  "latitude": 33.606,
  "longitude": 130.418
}
入力: ${inputText}`
      }]
    })
  });

  const json = await completion.json();
  const result = json.choices?.[0]?.message?.content;
  res.status(200).send(result);
}
