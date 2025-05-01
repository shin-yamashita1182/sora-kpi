
document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.querySelector(".close-button");
  const compareList = document.getElementById("compareListContainer");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const canvas = document.getElementById("canvasResult");

  const JSON_PATH = "coremaster_real_401cards.json";

  fetch(JSON_PATH)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        // 視点タグ
        const viewpointTag = document.createElement("div");
        viewpointTag.className = "viewpoint-tag";
        viewpointTag.textContent = item.viewpointLabel;

        switch (item.viewpoint) {
          case "finance":
            viewpointTag.classList.add("viewpoint-finance");
            break;
          case "customer":
            viewpointTag.classList.add("viewpoint-customer");
            break;
          case "process":
            viewpointTag.classList.add("viewpoint-process");
            break;
          case "learning":
            viewpointTag.classList.add("viewpoint-growth");
            break;
        }

        const title = document.createElement("h3");
        title.textContent = item.title;

        const note = document.createElement("div");
        note.className = "card-note";
        note.textContent = item.note;

        const kpi = document.createElement("p");
        kpi.innerHTML = `<strong>KPI:</strong> ${item.kpi}`;

        const detailBtn = document.createElement("button");
        detailBtn.className = "detail-button";
        detailBtn.textContent = "詳細を見る";
        detailBtn.addEventListener("click", () => showDetailModal(item));

        const addPriorityBtn = document.createElement("button");
        addPriorityBtn.className = "add-priority-button";
        addPriorityBtn.textContent = "優先に追加";
        addPriorityBtn.addEventListener("click", () => addToCompareList(item));

        card.appendChild(viewpointTag);
        card.appendChild(title);
        card.appendChild(note);
        card.appendChild(kpi);
        card.appendChild(detailBtn);
        card.appendChild(addPriorityBtn);

        resultsContainer.appendChild(card);
      });
    })
    .catch((err) => console.error("❌ JSON読み込みエラー:", err));

  function showDetailModal(item) {
    modalBody.innerHTML = `
      <h2>${item.title}</h2>
      <p><strong>施策:</strong> ${item.policy}</p>
      <p><strong>KPI:</strong> ${item.kpi}</p>
      <p><strong>注釈:</strong> ${item.note}</p>
    `;
    modal.style.display = "block";
  }

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  function addToCompareList(item) {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const note = document.createElement("div");
    note.className = "card-note";
    note.textContent = item.note;

    const kpi = document.createElement("p");
    kpi.innerHTML = `<strong>KPI:</strong> ${item.kpi}`;

    card.appendChild(title);
    card.appendChild(note);
    card.appendChild(kpi);
    compareList.appendChild(card);
  }

  // ✅ ChatGPT課題抽出
  analyzeBtn.addEventListener("click", async () => {
    const region = document.getElementById("regionName").value.trim();
    const userNote = document.getElementById("userNote").value.trim();

    if (!region || !userNote) {
      alert("地域名とテーマを両方入力してください。");
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "抽出中…";

    const prompt = `${region}について、テーマ「${userNote}」に基づく地域課題を抽出してください。
以下の条件に従ってください：
・最大トークン500以内
・地域課題は5件以内
・各課題は1〜2文で簡潔に
・原因や背景が簡潔に分かるように`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error("ChatGPT APIエラー");

      const data = await res.json();
      canvas.innerText = data.result || "ChatGPTからの応答がありませんでした。";
    } catch (err) {
      console.error("ChatGPT連携エラー:", err);
      canvas.innerText = "エラーが発生しました。";
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.innerText = "課題抽出";
    }
  });
});
