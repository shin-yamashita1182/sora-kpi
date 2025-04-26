document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");
  const compareListContainer = document.getElementById("compareListContainer");

  const demoData = [
    {
      title: "観光資源活用の促進",
      overview: "地域の観光資源を活かして交流人口を増加させる取り組み",
      kpi: "観光客数20%増加、宿泊数15%増加",
      target: "地域住民、観光業者",
      actor: "自治体、観光協会"
    },
    {
      title: "地域特産品ブランド化",
      overview: "地域特産品をブランド化し販路拡大・付加価値向上を目指す",
      kpi: "売上30%増加、認知度向上",
      target: "地元農家、事業者",
      actor: "商工会、自治体"
    },
    {
      title: "移住促進プロジェクト",
      overview: "若者世代・子育て世帯の移住定住を促進する取り組み",
      kpi: "移住者数10%増加、定住率向上",
      target: "移住希望者、地域団体",
      actor: "自治体、移住支援団体"
    },
    {
      title: "高齢者向けサービス拡充",
      overview: "高齢者の生活支援・健康増進を目的としたサービスの拡充",
      kpi: "高齢者支援サービス利用率25%増加",
      target: "高齢者、福祉施設",
      actor: "自治体、民間事業者"
    },
    {
      title: "地域交通インフラ改善",
      overview: "地域内交通の利便性を高めるためのインフラ整備",
      kpi: "バス路線利用者数15%増加",
      target: "地域住民、交通事業者",
      actor: "自治体、交通事業者"
    }
  ];

  const resultsContainer = document.getElementById('resultsContainer');
  const generateBtn = document.getElementById('generateBtn');
  let currentDetailIndex = null;

  generateBtn.addEventListener('click', () => {
    resultsContainer.innerHTML = "";

    demoData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-index', index);
      card.innerHTML = `
        <h3>${item.title}</h3>
        <button class="detail-btn">詳細</button>
      `;
      resultsContainer.appendChild(card);
    });
  });

  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      const index = parentCard.getAttribute('data-index');
      const item = demoData[index];
      currentDetailIndex = parseInt(index);

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p><strong>施策概要:</strong> ${item.overview}</p>
        <p><strong>目標KPI:</strong> ${item.kpi}</p>
        <p><strong>対象:</strong> ${item.target}</p>
        <p><strong>想定主体:</strong> ${item.actor}</p>
        <div style="margin-top: 20px; text-align: right;">
          <button id="addToCompareBtn">比較リストに追加</button>
        </div>
      `;
      modal.style.display = "block";
    }
  });

  modalBody.addEventListener('click', (event) => {
    if (event.target.id === 'addToCompareBtn' && currentDetailIndex !== null) {
      const item = demoData[currentDetailIndex];

      const exists = [...compareListContainer.querySelectorAll('.card')]
        .some(card => card.querySelector('h3')?.textContent === item.title);

      if (!exists) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${item.title}</h3>
          <p><strong>目標KPI:</strong> ${item.kpi}</p>
          <div style="text-align: right;">
            <button class="remove-btn">削除</button>
          </div>
        `;
        compareListContainer.appendChild(card);
      }

      modal.style.display = "none";
    }
  });

  // 削除処理
  compareListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const card = event.target.closest('.card');
      if (card) card.remove();
    }
  });

  // モーダル閉じる処理
  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // 出力ボタン（今は仮）
  const exportBtn = document.createElement('button');
  exportBtn.textContent = "比較リストを出力";
  exportBtn.style.marginTop = "10px";
  exportBtn.onclick = () => {
    alert("将来的にPDF出力されます（現在は仮のボタンです）");
  };
  compareListContainer.parentNode.appendChild(exportBtn);
});
