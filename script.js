
function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function autoComplete() {
  alert("⛅ GPTによる補完データ（仮）を表示します。正式な連携は次回実装予定です。");
}
