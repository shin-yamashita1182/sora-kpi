function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
}

// 郵便番号または地域名で自動補完
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

    if (data.人口) document.getElementById("人口").textContent = data.人口;
    if (data.主要産業) document.getElementById("主要産業").textContent = data.主要産業;
    if (data.地域名) {
      document.getElementById("地域名").textContent = data.地域名;
      document.getElementById("region").value = data.地域名;
    }

    if (data.latitude && data.longitude) {
      showMap(data.latitude, data.longitude, data.地域名 || input);
    }

  } catch (err) {
    alert("エラー発生: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "⛅ 自動補完（GPT）";
  }
}

function completeRegionFromZip() {
  autoComplete();
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
