
document.getElementById("autoCompleteBtn").addEventListener("click", async () => {
  const regionName = document.getElementById("region").value;

  if (!regionName) {
    alert("地域名を入力してください。");
    return;
  }

  try {
    const response = await fetch("https://sora-kpi.up.railway.app/api/completeRegion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ region: regionName })
    });

    const data = await response.json();

    if (data.result) {
      const resultText = data.result;
      const lines = resultText.split("\n");

      lines.forEach(line => {
        if (line.includes("人口：")) {
          document.getElementById("population").innerText = line.replace("人口：", "").trim();
        } else if (line.includes("高齢化率：")) {
          document.getElementById("aging").innerText = line.replace("高齢化率：", "").trim();
        } else if (line.includes("世帯数：")) {
          document.getElementById("households").innerText = line.replace("世帯数：", "").trim();
        } else if (line.includes("主な産業：")) {
          document.getElementById("industry").innerText = line.replace("主な産業：", "").trim();
        } else if (line.includes("地場産品：")) {
          document.getElementById("products").innerText = line.replace("地場産品：", "").trim();
        } else if (line.includes("観光資源：")) {
          document.getElementById("tourism").innerText = line.replace("観光資源：", "").trim();
        } else if (line.includes("小学校数：")) {
          document.getElementById("schools").innerText = line.replace("小学校数：", "").trim();
        } else if (line.includes("保育園数：")) {
          document.getElementById("nurseries").innerText = line.replace("保育園数：", "").trim();
        } else if (line.includes("災害リスク：")) {
          document.getElementById("disaster").innerText = line.replace("災害リスク：", "").trim();
        } else if (line.includes("過疎度分類：")) {
          document.getElementById("depopulation").innerText = line.replace("過疎度分類：", "").trim();
        } else if (line.includes("経済圏分類：")) {
          document.getElementById("economy").innerText = line.replace("経済圏分類：", "").trim();
        } else if (line.includes("最寄IC・SA：")) {
          document.getElementById("icinfo").innerText = line.replace("最寄IC・SA：", "").trim();
        }
      });

      if (data.lat && data.lng) {
        console.log("座標：", data.lat, data.lng);
      }
    } else {
      alert("GPTからの応答が不完全です。");
    }
  } catch (error) {
    console.error("補完エラー:", error);
    alert("GPT連携中にエラーが発生しました。");
  }
});
