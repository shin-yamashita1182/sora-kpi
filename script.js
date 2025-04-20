function completeRegionFromZip() { autoComplete(); }

async function autoComplete() {
  const input = document.getElementById("zipcode").value || document.getElementById("region").value;
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

    const raw = await res.text(); // ← 生のレスポンスをそのまま取得
    alert("ChatGPT 応答（生データ）:\n" + raw);

  } catch (err) {
    console.error("autoComplete error:", err);
    alert("ChatGPT通信エラー");
  } finally {
    btn.disabled = false;
    btn.textContent = "⛅ 自動補完（GPT）";
  }
}

async function classifyKPI() {
  const text = document.getElementById("freeText").value;
  if (!text.trim()) return alert("自由入力欄が空です");

  const btn = document.getElementById("classifyBtn");
  btn.disabled = true;
  btn.textContent = "🧠 分析中…";

  try {
    const res = await fetch("/api/gpt-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText: text, classifyMode: true })
    });

    const raw = await res.text();
    alert("GPT課題分析 応答（生データ）:\n" + raw);
  } catch (err) {
    console.error("classifyKPI error:", err);
    alert("GPT通信エラー（課題分析）");
  } finally {
    btn.disabled = false;
    btn.textContent = "🧠 地域課題の分析";
  }
}

function showMap(lat, lng, label) {
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "";
  const map = L.map("map").setView([lat, lng], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup();
}