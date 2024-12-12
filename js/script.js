const videoContainer = document.getElementById('video-container');
const body = document.body;
let lastTap = 0;

function markLike(icon) {
  icon.setAttribute('name', 'heart-sharp');
  icon.style.color = '#ff5454';
}

function markDeslike(icon) {
  icon.setAttribute('name', 'heart');
  icon.style.color = 'white';
}

function applyStoredLikeState() {
  const videos = document.querySelectorAll('.video');
  videos.forEach(video => {
    const videoId = video.dataset.id;
    const heartIcon = video.querySelector('.heart-icon-video');
    const likedState = localStorage.getItem(`liked-${videoId}`);
    if (likedState === 'liked') {
      markLike(heartIcon);
    } else {
      markDeslike(heartIcon);
    }
  });
}

videoContainer.addEventListener('click', (event) => {
  const heartIcon = event.target.closest('.heart-icon-video');
  if (heartIcon) {
    const videoElement = heartIcon.closest('.video');
    const videoId = videoElement.dataset.id;
    const isLiked = heartIcon.getAttribute('name') === 'heart-sharp';

    if (!isLiked) {
      markLike(heartIcon);
      localStorage.setItem(`liked-${videoId}`, 'liked');
    } else {
      markDeslike(heartIcon);
      localStorage.setItem(`liked-${videoId}`, 'desliked');
    }
  }
});

function createHeartAnimation(x, y) {
  const heartAnimation = document.createElement('ion-icon');
  heartAnimation.classList.add('heart-animation');
  heartAnimation.setAttribute('name', 'heart');
  heartAnimation.style.left = `${x}px`;
  heartAnimation.style.top = `${y}px`;
  body.appendChild(heartAnimation);

  setTimeout(() => {
    heartAnimation.remove();
  }, 1000);
}

videoContainer.addEventListener('touchstart', (event) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;

  if (tapLength < 300 && tapLength > 0) {
    createHeartAnimation(touchX, touchY);
    const videoElement = event.target.closest('.video');
    if (videoElement) {
      const heartIcon = videoElement.querySelector('.heart-icon-video');
      const videoId = videoElement.dataset.id;
      markLike(heartIcon);
      localStorage.setItem(`liked-${videoId}`, 'liked');
    }
  }

  lastTap = currentTime;
});

videoContainer.addEventListener('dblclick', (event) => {
  const touchX = event.clientX;
  const touchY = event.clientY;
  createHeartAnimation(touchX, touchY);

  const videoElement = event.target.closest('.video');
  if (videoElement) {
    const heartIcon = videoElement.querySelector('.heart-icon-video');
    const videoId = videoElement.dataset.id;
    markLike(heartIcon);
    localStorage.setItem(`liked-${videoId}`, 'liked');
  }
});

window.addEventListener('load', () => {
  applyStoredLikeState();
});

// Adiciona o listener para o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  const videoContainer = document.getElementById("video-container");
  const videoHeader = document.querySelector(".video-header");

  let isRefreshing = false;
  let startTouchY = null;
  let currentTouchY = null;
  let isDraggingToRefresh = false;

  // Cria o indicador de refresh
  const refreshIndicator = document.createElement("div");
  refreshIndicator.id = "refresh-indicator";
  refreshIndicator.innerHTML = `
    <span class="refresh-text">Arraste para atualizar</span>
  `;
  document.body.appendChild(refreshIndicator);

  // Cria a linha de loading fixa no topo
  const loadingLine = document.createElement("div");
  loadingLine.id = "loading-line";
  loadingLine.style.display = "none"; // Inicialmente oculta
  document.body.appendChild(loadingLine);

  // Cria o loading estilo Instagram
  const instagramLoading = document.createElement("div");
  instagramLoading.id = "instagram-loading";
  instagramLoading.innerHTML = `
    <div class="instagram-bar"></div>
    <div class="instagram-bar"></div>
    <div class="instagram-bar"></div>
  `;
  instagramLoading.style.display = "none"; // Inicialmente oculta
  document.body.appendChild(instagramLoading);

  function updateRefreshIndicatorPosition(deltaY) {
    const maxOffset = 100;
    const offset = Math.min(deltaY, maxOffset);
    refreshIndicator.style.transform = `translateY(${offset}px)`;
  }

  function resetRefreshIndicator() {
    refreshIndicator.style.transition = "transform 0.3s ease";
    refreshIndicator.style.transform = "translateY(0px)";
    setTimeout(() => {
      refreshIndicator.style.transition = "";
    }, 300);
  }

  function showRefreshIndicator(isLoading = false) {
    const refreshText = refreshIndicator.querySelector(".refresh-text");

    if (isLoading) {
      refreshText.style.display = "none";
      loadingLine.style.display = "block"; // Mostra a linha de loading
      instagramLoading.style.display = "flex"; // Mostra o loading do Instagram
    } else {
      refreshText.style.display = "block";
      loadingLine.style.display = "none"; // Esconde a linha de loading
      instagramLoading.style.display = "none"; // Esconde o loading do Instagram
    }

    refreshIndicator.classList.add("visible");
    if (videoHeader) {
      videoHeader.style.display = "none";
    }
  }

  function hideRefreshIndicator() {
    refreshIndicator.classList.remove("visible");
    resetRefreshIndicator();
    if (videoHeader) {
      videoHeader.style.display = "flex";
    }
    instagramLoading.style.display = "none"; // Esconde o loading do Instagram
  }

  function refreshContent() {
    if (isRefreshing) return;
    isRefreshing = true;

    showRefreshIndicator(true);

    // Simula uma atualização
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function handleTouchMove(event) {
    if (!startTouchY) return;

    const touch = event.touches[0];
    currentTouchY = touch.clientY;
    const deltaY = currentTouchY - startTouchY;

    if (deltaY > 0 && videoContainer.scrollTop === 0) {
      event.preventDefault();
      isDraggingToRefresh = true;
      updateRefreshIndicatorPosition(deltaY);
      showRefreshIndicator(false);
    } else if (deltaY <= 0) {
      isDraggingToRefresh = false;
      hideRefreshIndicator();
    }
  }

  function handleTouchEnd() {
    if (isDraggingToRefresh && currentTouchY - startTouchY > 60) {
      refreshContent();
    } else {
      hideRefreshIndicator();
    }

    isDraggingToRefresh = false;
    startTouchY = null;
    currentTouchY = null;
  }

  videoContainer.addEventListener("touchstart", (event) => {
    startTouchY = event.touches[0].clientY;
  });
  videoContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
  videoContainer.addEventListener("touchend", handleTouchEnd);
});

// Estilo do indicador, linha de loading no topo e Instagram loading
const style = document.createElement("style");
style.textContent = `
  #refresh-indicator {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 20px;
    z-index: 9999;
    transform: translateY(0);
    transition: transform 0.2s ease-out;
  }

  #refresh-indicator .refresh-text {
    margin-bottom: 120px;
  }

  #loading-line {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ;
    z-index: 10000;
    display: none;
  }

  #loading-line::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 30%;
    height: 100%;
    background: #fff;
    animation: loading 2s linear infinite;
  }

  #instagram-loading {
    position: fixed;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    width: 80px;
    z-index: 10000;
  }

  .instagram-bar {
    width: 20px;
    height: 20px;
    background: #ccc;
    border-radius: 50%;
    animation: instagram-loading 1.5s infinite;
  }

  .instagram-bar:nth-child(2) {
    animation-delay: 0.2s;
  }

  .instagram-bar:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes loading {
    0% {
      left: -100%;
    }
    50% {
      left: 50%;
    }
    100% {
      left: 100%;
    }
  }

  @keyframes instagram-loading {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);
