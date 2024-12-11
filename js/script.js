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

document.addEventListener("DOMContentLoaded", () => {
  const videoContainer = document.getElementById("video-container");
  const videos = videoContainer.querySelectorAll(".video");
  const videoHeader = document.querySelector(".video-header");

  let isRefreshing = false; // Evita múltiplos refreshes
  let lastTouchY = null; // Armazena a posição Y do último toque
  let isDraggingToRefresh = false; // Indica se está arrastando para atualizar

  // Cria o indicador de refresh
  const refreshIndicator = document.createElement("div");
  refreshIndicator.id = "refresh-indicator";
  refreshIndicator.innerHTML = `
    <span class="refresh-text">Arraste para atualizar</span>
    <div class="spinner"></div>
  `;
  document.body.appendChild(refreshIndicator);

  const spinner = refreshIndicator.querySelector(".spinner");
  spinner.style.display = "none"; // Oculta o spinner inicialmente

  function showRefreshIndicator(text) {
    refreshIndicator.querySelector(".refresh-text").textContent = text;
    refreshIndicator.classList.add("visible");
    spinner.style.display = "none"; // Mostra apenas o texto inicialmente
    if (videoHeader) {
      videoHeader.style.display = "none";
    }
  }

  function showSpinner() {
    refreshIndicator.querySelector(".refresh-text").textContent = "";
    spinner.style.display = "block"; // Exibe o spinner
  }

  function hideRefreshIndicator() {
    refreshIndicator.classList.remove("visible");
    if (videoHeader) {
      videoHeader.style.display = "flex";
    }
  }

  function refreshContent() {
    if (isRefreshing) return; // Previne refreshes simultâneos
    isRefreshing = true;

    showSpinner();

    // Simula uma atualização (substitua com carregamento dinâmico, se necessário)
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function handleTouchMove(event) {
    const touch = event.changedTouches[0];
    const currentTouchY = touch.clientY;

    if (lastTouchY !== null) {
      const deltaY = currentTouchY - lastTouchY;

      if (deltaY > 0 && videoContainer.scrollTop === 0) {
        // Arrastando para atualizar
        isDraggingToRefresh = true;
        showRefreshIndicator("Arraste para atualizar");
      }
    }

    lastTouchY = currentTouchY;
  }

  function handleTouchEnd() {
    if (isDraggingToRefresh && videoContainer.scrollTop === 0) {
      refreshContent();
    } else {
      hideRefreshIndicator();
    }

    isDraggingToRefresh = false;
    lastTouchY = null;
  }

  // Detecta gestos de toque
  videoContainer.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0].clientY;
  });
  videoContainer.addEventListener("touchmove", handleTouchMove);
  videoContainer.addEventListener("touchend", handleTouchEnd);
});

// Estilo do indicador no estilo TikTok
const style = document.createElement("style");
style.textContent = `
  #refresh-indicator {
    position: fixed;
    top: -60px;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 18px;
    z-index: 9999;
    transition: top 0.3s ease;
    margin-top: 25px;
  }

  #refresh-indicator.visible {
    top: 0;
  }

  #refresh-indicator .refresh-text {
    margin-bottom: 5px;
    font-weight: bold;
  }

  #refresh-indicator .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.6);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);
