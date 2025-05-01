document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const closeBtn = document.getElementById("closeModal");
  if (modal && closeBtn) {
    closeBtn.onclick = () => (modal.style.display = "none");
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }
});
