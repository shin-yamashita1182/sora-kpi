
document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([31.9333, 131.0667], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([31.9333, 131.0667]).addTo(map)
    .bindPopup('宮崎県西諸県郡高原町')
    .openPopup();
});
