// 🔹 セクション表示切り替え関数
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  } else {
    console.warn("セクションが見つかりません:", sectionId);
  }
}

// 🔹 GPTテスト送信関数（テスト分析欄）
async function runGPTTest() {
  const input = document.getElementById("testInput").value;
  const responseDiv = document.getElementById("testResult");
  responseDiv.textContent = "送信中...";

  try {
    const res = await fetch("/api/testGPT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    responseDiv.textContent = data.result || data.error || "応答なし";
  } catch (e) {
    responseDiv.textContent = "エラー: " + e.message;
  }
}

// 🔹 郵便番号から地域名補完（GPTへ中継）
function completeRegionFromZip() {
  autoComplete();
}

// 🔹 地域名の自動補完（GPT）
async function autoComplete() {
  const input = document.getElementById("zipcode")?.value || document.getElementById("region")?.value;
  if (!input) return alert("郵便番号または地域名を入力してください");

  const btn = document.getElementById("autoCompleteBtn");
  btn.disabled = true;
  btn.textContent = "⛅ 補完中…";

  try {
    const res = await fetch("/api/gpt-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText: input })
    });

    const raw = await res.text();
    alert("ChatGPT 応答（生データ）:\n" + raw);

  } catch (err) {
    console.error("autoComplete error:", err);
    alert("ChatGPT通信エラー");
  } finally {
    btn.disabled = false;
    btn.textContent = "⛅ 自動補完（GPT）";
  }
}

// ✅ グローバル公開
window.showSection = showSection;
window.runGPTTest = runGPTTest;
window.completeRegionFromZip = completeRegionFromZip;
window.autoComplete = autoComplete;
