// 🔹 セクション表示切り替え関数（メニュー切り替え用）
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

// 🔹 郵便番号から地域名補完（ダミー呼出し → GPT連携化予定）
function completeRegionFromZip() {
  autoComplete();
}

// 🔹 地域名の自動補完（GPT）
async function autoComplete() {
  const input = document.getElementById("zipcode")?.value || document.getElementById("region")?.value;
  if (!input) return alert("郵便番号または地域名を入力してください");

  const btn = document.getElementById("autoCompleteBtn");
  btn.disabled = true;
  btn.textContent = "⏳ 補完中...";

  try {
    const res = await fetch("/api/gpt-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText: input }),
    });

    const raw = await res.text(); // プレーンテキスト形式で受信
    alert("ChatGPT 応答（生データ）:\n" + raw);
  } catch (err) {
    console.error("AutoComplete error:", err);
    alert("ChatGPT通信エラー");
  } finally {
    btn.disabled = false;
    btn.textContent = "🧠 自動補完（GPT）";
  }
}

// 🔹 地域課題分類（BSCなど）
async function classifyKPI() {
  const text = document.getElementById("freeText")?.value;
  if (!text?.trim()) return alert("自由入力が空です");

  const btn = document.getElementById("classifyBtn");
  btn.disabled = true;
  btn.textContent = "⏳ 分析中...";

  try {
    const res = await fetch("/api/gpt-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText: text, classifyMode: true }),
    });

    const raw = await res.text();
    alert("GPT課題分類 応答（生データ）:\n" + raw);
  } catch (err) {
    console.error("classifyKPI error:", err);
    alert("GPT課題分類エラー（通信失敗）");
  } finally {
    btn.disabled = false;
    btn.textContent = "📌 地域課題の分析";
  }
}

// 🔹 地図表示用（中心座標とラベル付き）
function showMap(lat, lng, label) {
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "<div id='mapInner'></div>";

  const map = L.map("mapInner").setView([lat, lng], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup();
}

// ✅ 関数をグローバル公開（HTMLから呼び出せるようにする）
window.showSection = showSection;
window.runGPTTest = runGPTTest;
window.completeRegionFromZip = completeRegionFromZip;
window.autoComplete = autoComplete;
window.classifyKPI = classifyKPI;
window.showMap = showMap;
