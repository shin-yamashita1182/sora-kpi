let latestSoraKey = "";

function loadSoraSummary() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("sora_"));
  if (keys.length === 0) return;

  const data = JSON.parse(localStorage.getItem(keys[0]));
  latestSoraKey = keys[0];

  const el = document.getElementById("sora-summary");
  const region = data.region || "（地域名不明）";
  const summary = data.summary || "（課題サマリー未設定）";
  const goal = data.goal || "（中間目標未設定）";
  const kpi = data.kpi || "（KPI未設定）";

  el.innerHTML = `
    <h2>📋 地域課題レポート</h2>
    <p><strong>地域:</strong> ${region}</p>
    <p><strong>課題:</strong> ${summary}</p>
    <p><strong>中間目標:</strong> ${goal}</p>
    <p><strong>KPI:</strong> ${kpi}</p>
  `;
}

async function generateWithEssence() {
  const userThought = document.getElementById("userThought").value || "特になし";
  const sora = JSON.parse(localStorage.getItem(latestSoraKey) || "{}");
  const summary = sora.summary || "（未設定の課題）";

  const prompt = `
あなたは地域課題に対して中間目標とKPIを考えるAIです。
以下の課題と人の考えをもとに、提案してください。

■課題: ${summary}
■人の考え: ${userThought}

【中間目標】◯◯◯
【KPI】・◯◯◯、・◯◯◯、・◯◯◯
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY" // ← APIキー差し替え
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "あなたは戦略立案を支援するAIです。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  const goalMatch = content.match(/【中間目標】(.+?)\n/);
  const kpiMatch = content.match(/【KPI】(.+)/s);

  document.getElementById("goalOutput").value = goalMatch ? goalMatch[1].trim() : "";
  document.getElementById("kpiOutput").value = kpiMatch ? kpiMatch[1].replace(/・/g, "").trim() : "";
}

function saveToLocal() {
  const goal = document.getElementById("goalOutput").value.trim();
  const kpi = document.getElementById("kpiOutput").value.trim();
  const data = JSON.parse(localStorage.getItem(latestSoraKey) || "{}");

  data.goal = goal;
  data.kpi = kpi;

  localStorage.setItem(latestSoraKey, JSON.stringify(data));
  alert("✅ 保存しました！");
  loadSoraSummary(); // 右側も再反映
}

window.onload = loadSoraSummary;
