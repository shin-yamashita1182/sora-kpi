export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "メッセージが空です" });
  }

  try {
    // ※ここは仮想応答。実際にはOpenAI APIを使うことが可能
    const reply = `ChatGPTの仮応答：あなたの入力「${message}」について考えました。地域課題とは、地域社会における〜…などが該当します。`;

    res.status(200).json({ result: reply });
  } catch (err) {
    res.status(500).json({ error: "サーバーエラー：" + err.message });
  }
}
