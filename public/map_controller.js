function updateGoogleMap(regionName) {
  const mapContainer = document.getElementById('miniMap'); // 地図エリアのdiv
  const encodedRegion = encodeURIComponent(regionName);

  const apiKey = 'AIzaSyA-DU92xdbCPQLQsjQnBiMm-Td3fht-0N0'; // ★本番キーをここに！

  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedRegion}`;

  mapContainer.innerHTML = `
    <iframe
      width="100%"
      height="400px"
      frameborder="0"
      style="border:0; width:100%; height:100%;"
      src="${mapEmbedUrl}"
      allowfullscreen>
    </iframe>
  `;
}
