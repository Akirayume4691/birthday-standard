const bgMusic = document.getElementById("bgMusic");
const scenes = Array.from(document.querySelectorAll(".scene"));
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentScene = 0;
let typingStarted = false;
let typeIndex = 0;
const messageText = "This page is a small birthday gift made from memories, feelings, and wishes for your peace, success, and happiness. I hope your day feels as beautiful as your smile. 💗";

const photos = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg"
];

const captions = [
  "Memory 01",
  "Memory 02",
  "Memory 03",
  "Memory 04",
  "Memory 05",
  "Memory 06"
];

scenes.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.addEventListener("click", () => goToScene(index));
  dotsWrap.appendChild(dot);
});

function startExperience() {
  const intro = document.getElementById("intro");
  intro.style.display = "none";
  document.body.classList.add("started");
  playMusic();
  goToScene(0);
}

function playMusic() {
  if (bgMusic) {
    bgMusic.play().catch(() => {});
  }
}

document.addEventListener("click", playMusic, { once: true });

function goToScene(index) {
  currentScene = Math.max(0, Math.min(index, scenes.length - 1));

  scenes.forEach((scene, i) => {
    scene.classList.toggle("active", i === currentScene);
  });

  Array.from(dotsWrap.children).forEach((dot, i) => {
    dot.classList.toggle("active", i === currentScene);
  });

  if (currentScene === 1 && !typingStarted) {
    typingStarted = true;
    typeText();
  }
}

function nextScene() {
  goToScene(currentScene + 1);
}

function prevScene() {
  goToScene(currentScene - 1);
}

prevBtn.addEventListener("click", prevScene);
nextBtn.addEventListener("click", nextScene);

function typeText() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  if (typeIndex < messageText.length) {
    el.textContent += messageText.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeText, 34);
  }
}

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
    diffX < 0 ? nextScene() : prevScene();
  }

  if (Math.abs(diffY) > 70 && Math.abs(diffY) > Math.abs(diffX)) {
    diffY < 0 ? nextScene() : prevScene();
  }
}, { passive: true });

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("open")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(lightboxIndex - 1);
    if (e.key === "ArrowRight") openLightbox(lightboxIndex + 1);
    return;
  }

  if (e.key === "ArrowRight" || e.key === "ArrowDown") nextScene();
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevScene();
});

const stars = document.querySelectorAll(".star");
document.addEventListener("pointermove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 22;
  const y = (e.clientY / window.innerHeight - 0.5) * 22;

  stars.forEach((star, index) => {
    const depth = (index + 1) / 5;
    star.style.setProperty("--mx", `${x * depth}px`);
    star.style.setProperty("--my", `${y * depth}px`);
  });
});

const cards = Array.from(document.querySelectorAll(".memory-card"));
const carousel = document.getElementById("carousel");
const galleryPrev = document.querySelector(".gallery-btn.prev");
const galleryNext = document.querySelector(".gallery-btn.next");
let activePhoto = 0;
let dragStart = 0;

function updateCarousel() {
  cards.forEach((card, index) => {
    let offset = index - activePhoto;

    if (offset > cards.length / 2) offset -= cards.length;
    if (offset < -cards.length / 2) offset += cards.length;

    const abs = Math.abs(offset);
    const x = offset * 135;
    const rotate = offset * -10;
    const scale = 1 - abs * 0.13;
    const z = 100 - abs;
    const opacity = abs > 2 ? 0 : 1 - abs * 0.22;
    const blur = abs > 1 ? 1.4 : 0;

    card.style.transform = `translate3d(${x}px, 0, ${-abs * 90}px) rotateY(${rotate}deg) scale(${scale})`;
    card.style.zIndex = z;
    card.style.opacity = opacity;
    card.style.filter = `blur(${blur}px)`;
  });
}

function changePhoto(step) {
  activePhoto = (activePhoto + step + cards.length) % cards.length;
  updateCarousel();
}

galleryPrev.addEventListener("click", () => changePhoto(-1));
galleryNext.addEventListener("click", () => changePhoto(1));

carousel.addEventListener("pointerdown", (e) => {
  dragStart = e.clientX;
  carousel.setPointerCapture(e.pointerId);
});

carousel.addEventListener("pointerup", (e) => {
  const diff = e.clientX - dragStart;
  if (Math.abs(diff) > 35) {
    diff < 0 ? changePhoto(1) : changePhoto(-1);
  }
});

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (index === activePhoto) openLightbox(index);
    else {
      activePhoto = index;
      updateCarousel();
    }
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = (index + photos.length) % photos.length;
  lightboxImg.src = photos[lightboxIndex];
  lightboxCaption.textContent = captions[lightboxIndex];
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

closeBtn.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => openLightbox(lightboxIndex - 1));
lightboxNext.addEventListener("click", () => openLightbox(lightboxIndex + 1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

function celebrate() {
  for (let i = 0; i < 28; i++) {
    const burst = document.createElement("span");
    burst.className = "burst";
    burst.textContent = i % 2 === 0 ? "✦" : "♡";
    burst.style.left = "50%";
    burst.style.top = "50%";
    burst.style.setProperty("--x", `${(Math.random() - 0.5) * 280}px`);
    burst.style.setProperty("--y", `${(Math.random() - 0.5) * 280}px`);
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
  }
}

updateCarousel();
goToScene(0);
