document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  // リッチな施策データ
  const richData = [
    {
      title: "観光資源活用の促進",
      overview: "地域の観光資源を活かして交流人口を増加させる取り組み",
      kpi: "観光客数20%増加、宿泊数15%増加",
      target: "地域住民、観光業者",
      organization: "自治体、観光協会"
    },
    {
      title: "地域特産品ブランド化",
      overview: "地域特産品をブランド化し販路拡大・付加価値向上を目指す",
      kpi: "売上30%増加、認知度向上",
      target: "地元農家、事業者",
      organization: "商工会、自治体"
    },
    {
      title: "移住促進プロジェクト",
      overview: "若者世代・子育て世帯の移住定住を促進する取り組み",
      kpi: "移住者数10%増加、定住率向上",
      target: "移住希望者、地域団体",
      organization: "自治体、移住支援団体"
    },
    {
      title: "高齢者向けサービス拡充",
      overview: "高齢者の生活支援・健康増進を目的としたサービスの拡充",
      kpi: "高齢者支援サービス利用率25%増加",
      target: "高齢者、福祉施設",
      organization: "自治体、民間事業者"
    },
    {
      title: "地域交通インフラ改善",
      overview: "地域内交通の利便性を高めるためのインフラ整備",
      kpi: "バス路線利用者数15%増加",
      target: "地域住民、交通事業者",
      organization: "自治体、交通事業者"
    }
  ];

  // 詳細ボタンに対応
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const index = event.target.getAttribute('data-index');
      const data = richData[index];
      modalBody.innerHTML = `
        <h2>${data.title}</h2>
        <p><strong>【施策概要】</strong> ${data.overview}</p>
        <p><strong>【目標KPI】</strong> ${data.kpi}</p>
        <p><strong>【対象】</strong> ${data.target}</p>
        <p><strong>【想定主体】</strong> ${data.organization}</p>
      `;
      modal.style.display = "block";
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // 課題抽出ボタン押下時の処理
  const generateBtn = document.getElementById('generateBtn');
  const resultsContainer = document.getElementById('resultsContainer');

  generateBtn.addEventListener('click', () => {
    // 既存データをリセット
    resultsContainer.innerHTML = "";

    // リッチデータからカードを作成
    richData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${item.title}</h3>
        <button class="detail-btn" data-index="${index}">詳細</button>
      `;
      resultsContainer.appendChild(card);
    });
  });
});
