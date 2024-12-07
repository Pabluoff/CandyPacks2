const videoContainer = document.getElementById('video-container');
const body = document.body;

let lastTap = 0; // Variável para armazenar o último toque

// Função para marcar o "like"
function markLike(icon) {
  icon.setAttribute('name', 'heart');
  icon.style.color = '#ff5454';
}

// Função para marcar o "deslike"
function markDeslike(icon) {
  icon.setAttribute('name', 'heart'); // Alterando para 'heart-outline' para diferenciar visualmente
  icon.style.color = 'white';
}

// Função para aplicar o estado de like armazenado no localStorage
function applyStoredLikeState() {
  const videoElements = document.querySelectorAll('.video');
  
  videoElements.forEach(video => {
    const heartIcon = video.querySelector('.heart-icon-video');
    const videoId = video.dataset.id;
    const likedState = localStorage.getItem(`liked-${videoId}`);

    if (likedState === 'liked') {
      markLike(heartIcon);
    } else {
      markDeslike(heartIcon);
    }
  });
}

// Evento de clique no vídeo
videoContainer.addEventListener('click', (event) => {
  const heartIcon = event.target.closest('.heart-icon-video');
  if (heartIcon) {
    const videoElement = heartIcon.closest('.video');
    const videoId = videoElement.dataset.id;
    const isLiked = heartIcon.getAttribute('name') === 'heart';

    if (!isLiked) {
      markLike(heartIcon);
      localStorage.setItem(`liked-${videoId}`, 'liked');
    } else {
      markDeslike(heartIcon);
      localStorage.setItem(`liked-${videoId}`, 'desliked');
    }
  }
});

// Função para criar a animação de coração
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

// Evento para toque rápido no vídeo (detecta toques rápidos)
videoContainer.addEventListener('touchstart', (event) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;

  // Detecta toque rápido para animação e marcar como "like"
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

// Evento de duplo clique para curtir o vídeo
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

// Quando a página carrega, aplica o estado de like armazenado
window.addEventListener('load', () => {
  applyStoredLikeState();
});
