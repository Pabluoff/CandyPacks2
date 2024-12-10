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

const refreshIndicator = document.getElementById('refresh-indicator');
let isRefreshing = false; // Flag para evitar múltiplas atualizações

// Função para exibir o indicador de refresh
function showRefreshIndicator() {
  refreshIndicator.style.top = '10px'; // Move o indicador para dentro da tela
  refreshIndicator.style.opacity = '1';
}

// Função para ocultar o indicador de refresh
function hideRefreshIndicator() {
  refreshIndicator.style.top = '-50px'; // Move o indicador para fora da tela
  refreshIndicator.style.opacity = '0';
}

// Função para realizar o refresh
function refreshPage() {
  if (isRefreshing) return; // Evita múltiplos refreshes
  isRefreshing = true;

  showRefreshIndicator(); // Exibe o indicador de atualização

  setTimeout(() => {
    location.reload(); // Recarrega a página após 1.5s
  }, 1500);
}

// Detecta o scroll para ativar o refresh
window.addEventListener('scroll', () => {
  if (window.scrollY <= 0 && !isRefreshing) {
    refreshPage();
  }
});
