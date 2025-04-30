// ✅ SORA Dashboard Script Base - CoreMaster専用簡略版（観光型廃止）
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  const compareListContainer = document.getElementById("compareListContainer");

  // 不要な旧UI要素を操作しない

  // ✅ GPT課題抽出用処理はそのまま維持
  const analyzeBtn = document.getElementById('analyzeBtn');
  analyzeBtn.addEventListener("click", async () => {
    const regionName = document.getElementById("regionName").value.trim();
    const userNote = document.getElementById("userNote").value.trim();

    updateGoogleMap(regionName);
    if (!regionName || !userNote) {
      alert("地域名とテーマは両方入力してください。");
      return;
    }

    const originalBtnText = analyzeBtn.innerText;
    analyzeBtn.innerText = "課題抽出中…";
    analyzeBtn.disabled = true;

    const prompt = `${regionName}について、テーマ「${userNote}」に基づく地域課題を抽出してください。\n以下の内容について、最大トークン数500以内で、最大5つまでの地域課題を簡潔に挙げてください。各課題は1〜2文で記述し、原因や背景が簡潔に分かるようにしてください。`;

    try {
      await fetchChatGPTResponse(prompt);
    } catch (error) {
      console.error("抽出中に問題が発生しました:", error);
      alert("課題抽出に失敗しました。");
    } finally {
      analyzeBtn.innerText = originalBtnText;
      analyzeBtn.disabled = false;
    }
  });

  async function fetchChatGPTResponse(prompt) {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error("ChatGPT APIエラー");
    const data = await response.json();
    const canvasResult = document.getElementById("canvasResult");
    canvasResult.innerText = data.result || "結果が取得できませんでした。";
  }

  // ✅ 地図取得部分は維持
  const nexcoBtn = document.getElementById("toggleNexcoBtn");
  const infoBox = document.getElementById("nexcoInfoBox");
  const infoList = document.getElementById("nexcoInfoList");
  const statusBox = document.getElementById("nexcoStatus");
  let infoFetched = false;
  let isAccordionOpen = false;
  let isFetching = false;

  nexcoBtn.addEventListener("click", () => {
    const region = document.getElementById("regionName").value.trim();
    if (!region) {
      alert("地域名を入力してください！");
      return;
    }

    if (!infoFetched && !isFetching) {
      isFetching = true;
      nexcoBtn.textContent = "NEXCO情報 取得中…";

      const prompt = `${region}周辺の高速道路に関する、主なインターチェンジ、サービスエリア、パーキングエリアを最大5〜7件程度、リスト形式で簡潔にまとめてください。各施設名と簡単な特徴（例：トイレ、飲食、ガソリン有無など）だけを記載してください。それ以外の情報は不要です。`;

      fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
        .then(response => {
          if (!response.ok) throw new Error("取得失敗");
          return response.json();
        })
        .then(data => {
          const raw = data.result || "";
          const items = raw.split(/[
・。！？]/).filter(line => line.trim().length > 4);
          infoList.innerHTML = "";
          items.forEach(text => {
            const li = document.createElement("li");
            li.textContent = text.trim();
            infoList.appendChild(li);
          });

          infoFetched = true;
          isFetching = false;
          infoBox.classList.add("open");
          isAccordionOpen = true;
          updateButtonLabel();
        })
        .catch(error => {
          console.error("🔥 取得エラー:", error);
          infoList.innerHTML = "<li>情報取得に失敗しました。</li>";
          nexcoBtn.textContent = "NEXCO情報を表示";
          isFetching = false;
        });
    } else {
      if (!isAccordionOpen) {
        infoBox.classList.add("open");
        isAccordionOpen = true;
      } else {
        infoBox.classList.remove("open");
        isAccordionOpen = false;
      }
      updateButtonLabel();
    }
  });

  function updateButtonLabel() {
    nexcoBtn.textContent = isAccordionOpen ? "NEXCO情報を閉じる" : "NEXCO情報を表示";
    if (statusBox) {
      statusBox.textContent = isAccordionOpen ? "NEXCO情報を表示中" : "NEXCO情報を非表示にしました";
    }
  }
});
