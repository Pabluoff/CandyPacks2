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

  let isRefreshing = false; // Evita múltiplos refreshes
  let lastTouchY = null; // Armazena a posição Y do último toque

  // Cria o indicador de refresh
  const refreshIndicator = document.createElement("div");
  refreshIndicator.id = "refresh-indicator";
  refreshIndicator.innerHTML = `
    <div class="spinner"></div>
  `;
  document.body.appendChild(refreshIndicator);

  function showRefreshIndicator() {
    refreshIndicator.classList.add("visible");
  }

  function hideRefreshIndicator() {
    refreshIndicator.classList.remove("visible");
  }

  function refreshContent() {
    if (isRefreshing) return; // Previne refreshes simultâneos
    isRefreshing = true;

    showRefreshIndicator();

    // Simula uma atualização (substitua com carregamento dinâmico, se necessário)
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function handleScroll(event) {
    const containerTop = videoContainer.scrollTop;

    // Verifica se o contêiner está no topo e houve tentativa de rolagem para cima
    if (containerTop <= 0 && event.deltaY < 0) {
      refreshContent();
    }
  }

  function handleTouchMove(event) {
    const touch = event.changedTouches[0];
    const currentTouchY = touch.clientY;

    if (lastTouchY !== null) {
      const deltaY = currentTouchY - lastTouchY;

      if (deltaY > 0) {
        // Simula o evento de scroll para cima
        handleScroll({ deltaY: -1 });
      }
    }

    lastTouchY = currentTouchY;
  }

  function resetTouch() {
    lastTouchY = null;
  }

  // Detecta scroll (mouse)
  videoContainer.addEventListener("wheel", handleScroll);

  // Detecta gestos de toque
  videoContainer.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0].clientY;
  });
  videoContainer.addEventListener("touchmove", handleTouchMove);
  videoContainer.addEventListener("touchend", resetTouch);
});

// Estilo do indicador no estilo TikTok
const style = document.createElement("style");
style.textContent = `
  #refresh-indicator {
    position: fixed;
    top: -100px;
    left: 0;
    right: 0;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: black;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    transition: top 0.3s ease;
  }

  #refresh-indicator.visible {
    top: 0;
  }

  #refresh-indicator .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.6);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 5px;
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
