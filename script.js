function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
  } else {
    console.warn("セクションが見つかりません:", sectionId);
  }
}

function completeRegionFromZip() {
  autoComplete();
}

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
    const raw = await res.text();
    alert("ChatGPT 応答（生データ）:\n" + raw);

    const data = parseGPTData(raw);
    document.getElementById("人口").textContent = data.人口 || "";
    document.getElementById("主要産業").textContent = data.主要産業 || "";
    document.getElementById("地域名").textContent = data.地域名 || "";

    if (data.緯度 && data.経度) {
      showMap(data.緯度, data.経度, data.地域名 || "地域");
    }
  } catch (err) {
    console.error("autoComplete error:", err);
    alert("ChatGPT通信エラー");
  } finally {
    btn.disabled = false;
    btn.textContent = "⛅ 自動補完（GPT）";
  }
}

function parseGPTData(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function showMap(lat, lng, label) {
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "<div id='mapInner' style='height: 300px;'></div>";
  const map = L.map("mapInner").setView([lat, lng], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup();
}
