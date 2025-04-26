document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("closeModal");

  // 全「詳細」ボタンに対応
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('detail-btn')) {
      const parentCard = event.target.closest('.card');
      modalBody.innerHTML = parentCard.innerHTML;
      modal.style.display = "block";
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
