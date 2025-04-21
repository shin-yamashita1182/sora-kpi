// 🔹 セクション表示切り替え関数（必須）
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

// ✅ 関数をグローバル公開（HTMLから呼べるようにする）
window.showSection = showSection;
window.runGPTTest = runGPTTest;

// ⬇️ 今後ここに autoComplete や completeRegionFromZip など追加可能
