
function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function autoComplete() {
  alert("⛅ GPT補完（仮動作）中。実データは後ほど実装されます。");
}
