
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
