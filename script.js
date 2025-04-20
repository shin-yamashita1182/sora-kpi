let map;

function initializeMap(lat = 31.915, lng = 131.003, zoom = 12) {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (map !== undefined) {
    map.remove(); // 再初期化
  }

  map = L.map('map').setView([lat, lng], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
}

window.onload = () => {
  initializeMap(); // 初期地図を読み込み
};

async function completeRegionFromZip() {
  const zipcode = document.getElementById("zipcode").value.trim();
  if (!zipcode) return;

  try {
    const res = await fetch("https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + zipcode);
    const data = await res.json();
    if (data.results) {
      const address = data.results[0];
      const regionName = `${address.address1}${address.address2}${address.address3}`;
      document.getElementById("region").value = regionName;

      // 緯度経度が分からないため仮設定（宮崎県高原町）
      initializeMap(31.915, 131.003);
    } else {
      alert("該当する地域が見つかりません");
    }
  } catch (error) {
    alert("郵便番号APIの取得に失敗しました");
  }
}

async function autoComplete() {
  const region = document.getElementById("region").value.trim();
  if (!region) {
    alert("地域名を入力してください");
    return;
  }

  const btn = document.getElementById("autoCompleteBtn");
  btn.textContent = "⏳ 生成中..."; btn.disabled = true;

  try {
    const res = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region })
    });

    const result = await res.json();
    const info = result.data || result;

    document.getElementById("population").textContent = info.人口 || "―";
    document.getElementById("aging").textContent = info.高齢化率 || "―";
    document.getElementById("households").textContent = info.世帯数 || "―";
    document.getElementById("industry").textContent = info.主な産業 || "―";
    document.getElementById("products").textContent = info.地場産品 || "―";
    document.getElementById("tourism").textContent = info.観光資源 || "―";
    document.getElementById("schools").textContent = info.小学校数 || "―";
    document.getElementById("nurseries").textContent = info.保育園数 || "―";
    document.getElementById("disaster").textContent = info.災害リスク || "―";
    document.getElementById("depopulation").textContent = info.過疎度分類 || "―";
    document.getElementById("economy").textContent = info.経済圏分類 || "―";
    document.getElementById("icinfo").textContent = info["最寄IC・SA"] || "―";
  } catch (error) {
    console.error("GPT補完エラー:", error);
    alert("ChatGPTとの通信に失敗しました");
  } finally {
    btn.textContent = "⛅ 自動補完（GPT）";
    btn.disabled = false;
  }
}

function classifyKPI() {
  const freeText = document.getElementById("freeText").value.trim();
  if (!freeText) {
    alert("自由入力欄が空です");
    return;
  }

  // 後でGPT分類分析を追加するスペース
  alert("分類機能は今後追加予定です。入力内容:\n" + freeText);
}

function saveData() {
  const region = document.getElementById("region").value.trim();
  if (!region) {
    alert("地域名が空です");
    return;
  }

  const data = {
    population: document.getElementById("population").textContent,
    aging: document.getElementById("aging").textContent,
    households: document.getElementById("households").textContent,
    industry: document.getElementById("industry").textContent,
    products: document.getElementById("products").textContent,
    tourism: document.getElementById("tourism").textContent,
    schools: document.getElementById("schools").textContent,
    nurseries: document.getElementById("nurseries").textContent,
    disaster: document.getElementById("disaster").textContent,
    depopulation: document.getElementById("depopulation").textContent,
    economy: document.getElementById("economy").textContent,
    icinfo: document.getElementById("icinfo").textContent,
    freeText: document.getElementById("freeText").value
  };

  localStorage.setItem("kpi-" + region, JSON.stringify(data));
  updateSavedDataSelect();
  alert("保存しました");
}

function loadData() {
  const select = document.getElementById("savedDataSelect");
  const key = select.value;
  if (!key) return;

  const data = JSON.parse(localStorage.getItem(key));
  if (!data) return;

  document.getElementById("population").textContent = data.population;
  document.getElementById("aging").textContent = data.aging;
  document.getElementById("households").textContent = data.households;
  document.getElementById("industry").textContent = data.industry;
  document.getElementById("products").textContent = data.products;
  document.getElementById("tourism").textContent = data.tourism;
  document.getElementById("schools").textContent = data.schools;
  document.getElementById("nurseries").textContent = data.nurseries;
  document.getElementById("disaster").textContent = data.disaster;
  document.getElementById("depopulation").textContent = data.depopulation;
  document.getElementById("economy").textContent = data.economy;
  document.getElementById("icinfo").textContent = data.icinfo;
  document.getElementById("freeText").value = data.freeText || "";
}

function clearData() {
  const select = document.getElementById("savedDataSelect");
  const key = select.value;
  if (!key) return;
  localStorage.removeItem(key);
  updateSavedDataSelect();
  alert("削除しました");
}

function updateSavedDataSelect() {
  const select = document.getElementById("savedDataSelect");
  select.innerHTML = '<option value="">保存データ選択</option>';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("kpi-")) {
      select.innerHTML += `<option value="${key}">${key.replace("kpi-", "")}</option>`;
    }
  }
}

function showSection(id) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

updateSavedDataSelect(); // 初期化時に読み込み
