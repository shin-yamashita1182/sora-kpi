
async function completeRegionInfo(regionName) {
  const response = await fetch("https://sora-kpi.up.railway.app/api/completeRegion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ region: regionName })
  });

  if (!response.ok) {
    console.error("エラー:", response.statusText);
    return;
  }

  const data = await response.json();
  document.getElementById("result").innerText = data.summary || "GPT応答なし";
}
