async function autoComplete() {
  const inputText = document.getElementById("region").value;
  if (!inputText) return alert("地域名を入力してください。");

  try {
    const response = await fetch("/api/gpt-real", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputText })
    });

    const data = await response.json();

    if (data.result) {
      console.log("ChatGPT 応答（生データ）:", data);

      const mapping = {
        地域名: "region",
        人口: "population",
        高齢化率: "aging",
        世帯数: "households",
        主な産業: "industry",
        地場産品: "products",
        観光資源: "tourism",
        小学校数: "schools",
        保育園数: "nurseries",
        災害リスク: "disaster",
        過疎度分類: "depopulation",
        経済圏分類: "economy",
        最寄IC・SA: "icinfo"
      };

      const lines = data.result.split("\n");
      lines.forEach((line) => {
        if (line.startsWith("注意") || line.startsWith("備考")) return; // 注意文はスキップ
        const [label, value] = line.split(/[:：]/);
        const id = mapping[label?.trim()];
        if (id && value) {
          document.getElementById(id).textContent = value.trim();
        }
      });

      if (data.lat && data.lng && typeof showMap === "function") {
        showMap(data.lat, data.lng);
      }

      if (data.region) {
        document.getElementById("region").value = data.region;
      }
    } else {
      alert("ChatGPTからの応答が不完全です");
    }
  } catch (err) {
    console.error("autoComplete error:", err);
    alert("自動補完でエラーが発生しました");
  }
}