// カードデータ（今は観光型のみ）
const data = [
  {
    id: 1,
    overview: "地域文化体験の充実",
    kpi: "体験ツアー参加者数",
    title: "地域文化体験を拡充し、訪問客の滞在時間を伸ばす施策を展開する。",
    category: "顧客視点",
    color: "#00AEEF",
    classification: "観光型"
  },
  {
    id: 2,
    overview: "地元資源を活用した観光商品開発",
    kpi: "新商品開発数",
    title: "地域資源を活かした体験型観光商品の開発を促進し、観光収益を高める。",
    category: "財務視点",
    color: "#FFD700",
    classification: "観光型"
  }
];

// カードの描画処理
function renderCards(filtered) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  filtered.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.borderLeft = `8px solid ${card.color}`;
    div.innerHTML = `
      <h3>${card.overview}</h3>
      <p><strong>KPI:</strong> ${card.kpi}</p>
      <details>
        <summary>詳細を見る</summary>
        <p>${card.title}</p>
      </details>
    `;
    container.appendChild(div);
  });
}

// 分類ボタンでの絞り込み処理
function loadCategory(type) {
  const filtered = data.filter(item => item.classification === type);
  renderCards(filtered);
}

// 初期表示（観光型）
window.onload = () => loadCategory("観光型");
