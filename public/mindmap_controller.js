// map_controller.js（新規ファイル）

// 🔹 グローバル変数（デモ用）
let selectedStrategy = null;

// 🔹 モーダル操作
function openMindMapModal(strategy) {
  selectedStrategy = strategy;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "mindMapModal";
  modal.innerHTML = `
    <div class="modal-content" style="width: 90%; height: 80vh;">
      <span class="close-button" id="closeMindMap">&times;</span>
      <div style="font-weight: bold; padding-bottom: 8px;">🧠 戦略マインドマップ：${strategy.strategy}</div>
      <div id="mindmapArea" style="width:100%; height:100%; border:1px solid #ccc; background:#f9f9f9;"></div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById("closeMindMap").onclick = () => modal.remove();

  renderMindMap(strategy);
}

// 🔹 デモ用マインドマップ（React FlowなしのSVG）
function renderMindMap(strategy) {
  const container = document.getElementById("mindmapArea");
  container.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  // ノードと線を簡易描画（中心ノード → サブノード）
  const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  center.setAttribute("cx", "300");
  center.setAttribute("cy", "200");
  center.setAttribute("r", "40");
  center.setAttribute("fill", "#4caf50");

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", "300");
  label.setAttribute("y", "205");
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "#fff");
  label.textContent = strategy.strategy;

  svg.appendChild(center);
  svg.appendChild(label);

  const branches = ["施策A", "施策B", "施策C"];
  branches.forEach((b, i) => {
    const x = 150 + i * 150;
    const y = 400;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "300");
    line.setAttribute("y1", "240");
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#999");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);

    const sub = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    sub.setAttribute("cx", x);
    sub.setAttribute("cy", y);
    sub.setAttribute("r", "30");
    sub.setAttribute("fill", "#2196f3");
    svg.appendChild(sub);

    const sublabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    sublabel.setAttribute("x", x);
    sublabel.setAttribute("y", y + 5);
    sublabel.setAttribute("text-anchor", "middle");
    sublabel.setAttribute("fill", "#fff");
    sublabel.textContent = b;
    svg.appendChild(sublabel);
  });

  container.appendChild(svg);
}

// 🔹 優先リスト側にボタン設置を検出（例：compareListContainer）
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const cards = document.querySelectorAll("#compareListContainer .card");
    cards.forEach((card) => {
      if (!card.querySelector(".mindmap-button")) {
        const btn = document.createElement("button");
        btn.textContent = "🧠 マップで見る";
        btn.className = "mindmap-button";
        btn.style.marginTop = "6px";
        btn.onclick = () => {
          const title = card.querySelector(".card-title")?.textContent || "戦略";
          openMindMapModal({ strategy: title });
        };
        card.appendChild(btn);
      }
    });
  });
  const target = document.getElementById("compareListContainer");
  if (target) observer.observe(target, { childList: true, subtree: true });
});
