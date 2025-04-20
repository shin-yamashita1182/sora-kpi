
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function autoComplete() {
  document.getElementById("population").innerText = "24,000人（2020年）";
  document.getElementById("aging").innerText = "29.7%（2020年）";
  document.getElementById("households").innerText = "10,000世帯";
  document.getElementById("industry").innerText = "観光、農業、漁業";
  document.getElementById("products").innerText = "かぼちゃ、みかん、真珠";
  document.getElementById("tourism").innerText = "温泉、古城、自然公園";
  document.getElementById("schools").innerText = "8校";
  document.getElementById("nurseries").innerText = "6園";
  document.getElementById("disaster").innerText = "地震リスク中、津波リスク低";
  document.getElementById("depopulation").innerText = "人口減少率中位";
  document.getElementById("economy").innerText = "地方圏分類B";
  document.getElementById("icinfo").innerText = "高原ICより10km、えびのPA近接";
}

document.getElementById("dropZone").addEventListener("dragover", function(e) {
  e.preventDefault();
  this.style.borderColor = "#007acc";
});
document.getElementById("dropZone").addEventListener("dragleave", function(e) {
  e.preventDefault();
  this.style.borderColor = "#aaa";
});
document.getElementById("dropZone").addEventListener("drop", function(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  alert("📄 ドロップされたファイル：" + files[0].name);
});


// 郵便番号 → 地域名自動補完処理
async function completeRegionFromZip() {
  const zip = document.getElementById("zipcode").value.replace('-', '');
  const res = await fetch("zipcode.json");
  const data = await res.json();
  const match = data.find(entry => entry.zipcode === zip);
  if (match) {
    const regionField = document.getElementById("region");
    regionField.value = `${match.pref}${match.city}${match.town}`;
  } else {
    alert("該当する地域が見つかりません。");
  }
}

async function classifyKPI() {
  const btn = document.getElementById("classifyBtn");
  const freeText = document.getElementById("freeText").value;
  if (!freeText.trim()) {
    alert("自由入力欄にテキストを入力してください。");
    return;
  }
  btn.disabled = true;
  const originalText = btn.innerText;
  btn.innerText = "⏳ 分析中...";

  try {
    const response = await fetch("/classify-kpi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: freeText })
    });
    const data = await response.json();

    // 分類結果の表示（仮の処理）
    alert("分類結果: " + JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("分類エラー:", error);
    alert("分類中にエラーが発生しました。");
  } finally {
    btn.disabled = false;
    btn.innerText = originalText;
  }
}