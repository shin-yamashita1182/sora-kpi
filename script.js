
function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function autoComplete() {
  alert("GPTによる自動補完機能（仮）を実行します。※実装準備中");
}
