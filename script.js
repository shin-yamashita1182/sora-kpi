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

    const data = await res.json();

    const mapping = {
      地域名: "region",
      人口: "population",
      高齢化率: "aging",
      世帯数: "households",
      主な産業: "industry",
      地場産品: "products",
      観光資源: "tourism",
      小学校数: "schools",
      保育園数: "nurseries",
      災害リスク: "disaster",
      過疎度分類: "depopulation",
      経済圏分類: "economy",
      最寄IC・SA: "icinfo"
    };

    if (data.result) {
      const lines = data.result.split("\n");
      lines.forEach(line => {
        const [label, value] = line.split("：");
        const id = mapping[label?.trim()];
        if (id && value) {
          document.getElementById(id).textContent = value.trim();
        }
      });

      if (data.lat && data.lng) {
        showMap(data.lat, data.lng, data.region || input);
      } else {
        document.getElementById("map").innerHTML = "<p>座標情報が取得できませんでした。</p>";
      }
    } else {
      alert("補完に失敗しました。");
    }
  } catch (err) {
    console.error("autoComplete error:", err);
    alert("ChatGPT通信エラー");
  } finally {
    btn.disabled = false;
    btn.textContent = "⛅ 自動補完（GPT）";
  }
}

// ← ここが今回追加された関数
function completeRegionFromZip() {
  autoComplete();
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

    const data = await res.json();
    alert("分析結果:\n" + (data.result || "なし"));
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