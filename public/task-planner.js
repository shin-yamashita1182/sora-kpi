let latestSoraKey = "";
let plans = [];

function loadSoraSummary() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("sora_"));
  if (keys.length === 0) return;

  latestSoraKey = keys[0];
  const data = JSON.parse(localStorage.getItem(latestSoraKey));
  plans = data.plans || [];

  const el = document.getElementById("sora-summary");

  const region = data.region || "（不明）";
  const comments = data.comments || "（考察コメント未設定）";
  const issues = data.issues || [];

  const issueListHTML = issues.length
    ? "<ul>" + issues.map(i => `<li>${i}</li>`).join("") + "</ul>"
    : "（課題リスト未設定）";

  el.innerHTML = `
    <h2>📋 総合レポート（要約）</h2>
    <p><strong>地域:</strong> ${region}</p>

    <div>
      <strong>🧠 考察コメント（GPT）:</strong>
      <p>${comments}</p>
    </div>

    <div>
      <strong>📌 抽出された課題10選:</strong>
      ${issueListHTML}
    </div>
  `;

  renderPlans();
}

function renderPlans() {
  const container = document.getElementById("plan-container");
  container.innerHTML = "";
  plans.forEach((plan, index) => {
    const div = document.createElement("div");
    div.className = "plan-card";
    div.innerHTML = `
      <div><strong>📝 考え</strong><br/>
        <textarea rows="2" oninput="plans[${index}].userThought = this.value">${plan.userThought || ""}</textarea>
      </div>
      <div><strong>🎯 中間目標</strong><br/>
        <textarea rows="2" oninput="plans[${index}].goal = this.value">${plan.goal || ""}</textarea>
      </div>
      <div><strong>📈 KPI（カンマ区切り）</strong><br/>
        <textarea rows="2" oninput="plans[${index}].kpi = this.value">${plan.kpi || ""}</textarea>
      </div>
      <button class="btn" onclick="generateGPT(${index})">GPT補完</button>
      <button class="btn" onclick="savePlans()">保存</button>
      <button class="btn-delete" onclick="deletePlan(${index})">削除</button>
    `;
    container.appendChild(div);
  });
}

function addPlan() {
  plans.push({ userThought: "", goal: "", kpi: "" });
  renderPlans();
}

function deletePlan(index) {
  if (confirm("この実行策を削除しますか？")) {
    plans.splice(index, 1);
    renderPlans();
  }
}

function savePlans() {
  const data = JSON.parse(localStorage.getItem(latestSoraKey) || "{}");
  data.plans = plans;
  localStorage.setItem(latestSoraKey, JSON.stringify(data));
  alert("✅ 保存しました！");
}

async function generateGPT(index) {
  const summary = JSON.parse(localStorage.getItem(latestSoraKey)).summary || "";
  const thought = plans[index].userThought || "特になし";

  const prompt = `
あなたは地域課題に対して中間目標とKPIを提案するAIです。

■課題: ${summary}
■人の考え: ${thought}

【中間目標】◯◯◯
【KPI】・◯◯◯、・◯◯◯
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
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

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";

  const goalMatch = text.match(/【中間目標】(.+?)\n/);
  const kpiMatch = text.match(/【KPI】(.+)/s);

  plans[index].goal = goalMatch ? goalMatch[1].trim() : "";
  plans[index].kpi = kpiMatch ? kpiMatch[1].replace(/・/g, "").trim() : "";

  renderPlans();
}

window.onload = loadSoraSummary;
