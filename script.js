
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

function completeRegionFromZip() {
  autoComplete();
}

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
    const data = JSON.parse(raw);

    const idList = [
      "population", "aging", "households", "industry", "products",
      "tourism", "schools", "nurseries", "disaster", "depopulation",
      "economy", "icinfo", "region"
    ];

    idList.forEach(id => {
      if (data[id] && document.getElementById(id)) {
        document.getElementById(id).textContent = data[id];
      }
    });

    if (data.latitude && data.longitude) {
      showMap(data.latitude, data.longitude, data.region || input);
    }

  } catch (err) {
    console.error("autoComplete error:", err);
    alert("ChatGPT通信エラー");
  } finally {
    btn.disabled = false;
    btn.textContent = "⛅ 自動補完（GPT）";
  }
}

function showMap(lat, lng, label) {
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "<div id='mapInner'></div>";
  const map = L.map("mapInner").setView([lat, lng], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup();
}

window.showSection = showSection;
window.autoComplete = autoComplete;
window.completeRegionFromZip = completeRegionFromZip;
window.showMap = showMap;
