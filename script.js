async function autoComplete() {
  const region = document.getElementById("region").value;
  if (!region) return alert("地域名を入力してください。");

  try {
    const response = await fetch("/api/gpt-real", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText: region })
    });
    const data = await response.json();

    console.log("ChatGPT 応答（生データ）:", data);

    const mapping = {
      "地域名": "region",
      "人口": "population",
      "高齢化率": "aging",
      "世帯数": "households",
      "主な産業": "industry",
      "地場産品": "products",
      "観光資源": "tourism",
      "小学校数": "schools",
      "保育園数": "nurseries",
      "災害リスク": "disaster",
      "過疎度分類": "depopulation",
      "経済圏分類": "economy",
      "最寄IC・SA": "icinfo"
    };

    const lines = data.result.split("\n");
    lines.forEach(line => {
      const [label, value] = line.split("：");
      const id = mapping[label?.trim()];
      if (id && value) {
        document.getElementById(id).textContent = value.trim();
      }
    });

    showMap(data.lat, data.lng);
    document.getElementById("region").value = data.region || region;
  } catch (error) {
    console.error("autoComplete error:", error);
    alert("ChatGPTとの通信に失敗しました。");
  }
}