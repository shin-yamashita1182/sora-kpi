async function completeRegionFromZip() {
  const zip = document.getElementById("zipcode").value.trim();
  if (!zip) return alert("郵便番号を入力してください");

  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
    const json = await res.json();
    if (json.results && json.results[0]) {
      const result = json.results[0];
      const fullAddress = result.address1 + result.address2 + result.address3;
      document.getElementById("region").value = fullAddress;
    } else {
      alert("該当する住所が見つかりません");
    }
  } catch (err) {
    console.error("郵便番号検索エラー:", err);
    alert("郵便番号からの補完に失敗しました");
  }
}

async function autoComplete() {
  const inputText = document.getElementById("region").value;
  if (!inputText) return alert("地域名が空です");

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
        if (line.startsWith("注意") || line.startsWith("備考")) return;
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
    alert("ChatGPTとの連携でエラーが発生しました");
  }
}