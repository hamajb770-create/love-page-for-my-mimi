// ---------- COMMON HELPERS ----------
function q(sel) {
  return document.querySelector(sel);
}
function qAll(sel) {
  return Array.from(document.querySelectorAll(sel));
}

/* ---------- MUSIC PLAYER ---------- */
const song = q("#song");
const playBtn = q("#playBtn");
const pauseBtn = q("#pauseBtn");
const progress = q("#progress");
const timeLabel = q("#timeLabel");

function formatTime(s) {
  s = Math.floor(s);
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

if (song) {
  // update duration when metadata loads
  song.addEventListener("loadedmetadata", () => {
    progress.max = Math.floor(song.duration);
    timeLabel.textContent = `00:00 / ${formatTime(song.duration)}`;
  });

  // update progress while playing
  song.addEventListener("timeupdate", () => {
    progress.value = Math.floor(song.currentTime);
    timeLabel.textContent = `${formatTime(song.currentTime)} / ${formatTime(
      song.duration || 0
    )}`;
  });

  playBtn.addEventListener("click", () => song.play());
  pauseBtn.addEventListener("click", () => song.pause());
  progress.addEventListener("input", (e) => {
    song.currentTime = e.target.value;
  });
}

/* ---------- COUNTUP TIMER (since 2025-08-01) ---------- */
const startDate = new Date("2025-08-01T00:00:00"); // starts counting from this day
const countdownEl = q("#countdown");

function updateTimer() {
  const now = new Date();
  let diff = now - startDate; // ms
  if (diff < 0) diff = 0;
  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${secs}s`;
}
updateTimer();
setInterval(updateTimer, 1000);

/* ---------- HORIZONTAL GALLERY (scroll + arrows + auto) ---------- */
const gallery = q("#gallery");
const leftBtn = q("#leftBtn");
const rightBtn = q("#rightBtn");

function scrollGallery(direction = 1) {
  // scroll by gallery visible width
  const step = gallery.clientWidth * 0.9;
  gallery.scrollBy({ left: step * direction, behavior: "smooth" });
}
leftBtn.addEventListener("click", () => scrollGallery(-1));
rightBtn.addEventListener("click", () => scrollGallery(1));

// auto advance every 3 seconds
let autoSlide = setInterval(() => scrollGallery(1), 3000);
// pause auto-slide while user interacts
gallery.addEventListener("mouseenter", () => clearInterval(autoSlide));
gallery.addEventListener(
  "mouseleave",
  () => (autoSlide = setInterval(() => scrollGallery(1), 3000))
);

/* allow touch drag for nicer mobile UX */
let isDown = false,
  startX,
  scrollLeft;
gallery.addEventListener("mousedown", (e) => {
  isDown = true;
  gallery.classList.add("grabbing");
  startX = e.pageX - gallery.offsetLeft;
  scrollLeft = gallery.scrollLeft;
});
gallery.addEventListener("mouseup", () => {
  isDown = false;
  gallery.classList.remove("grabbing");
});
gallery.addEventListener("mouseleave", () => {
  isDown = false;
  gallery.classList.remove("grabbing");
});
gallery.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - gallery.offsetLeft;
  const walk = (x - startX) * 1.2;
  gallery.scrollLeft = scrollLeft - walk;
});

/* ---------- CUTE BUBBLE HEARTS (floating down) ---------- */
const heartsContainer = q("#hearts");

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "bubble-heart";
  const size = Math.random() * 22 + 18; // 18px - 40px
  const left = Math.random() * 100; // %
  const duration = Math.random() * 5 + 6; // 6s - 11s
  const delay = Math.random() * 2;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${left}%`;
  heart.style.opacity = (Math.random() * 0.6 + 0.4).toFixed(2);
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;
  heartsContainer.appendChild(heart);

  // remove after animation complete
  setTimeout(() => {
    heart.remove();
  }, (duration + delay) * 1000 + 200);
}

// create hearts continuously
setInterval(createHeart, 450); // new heart every 450ms

/* Heart styles inserted dynamically to keep JS-only creation simple */
const style = document.createElement("style");
style.innerHTML = `
  .bubble-heart{
    position: absolute;
    top: -60px;
    transform: translateY(0) rotate(0deg);
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.1)),
                linear-gradient(180deg, rgba(255,102,179,0.95), rgba(255,153,214,0.6));
    border-radius: 50%;
    filter: blur(0.6px);
    box-shadow: 0 6px 18px rgba(255,80,160,0.12);
    animation-name: fallRotate, floatX;
    animation-timing-function: linear, ease-in-out;
    animation-iteration-count: 1, infinite;
  }

  @keyframes fallRotate {
    0% { transform: translateY(-40px) rotate(0deg); opacity:0; }
    10% { opacity:1; }
    100% { transform: translateY(calc(100vh + 60px)) rotate(720deg); opacity:0.75; }
  }
  @keyframes floatX {
    0% { transform: translateX(0); }
    50% { transform: translateX(12px); }
    100% { transform: translateX(0); }
  }
`;
document.head.appendChild(style);
// Mini floating hearts animation
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💖";

  // Random horizontal position
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.setProperty("--x-move", Math.random() * 100 - 50 + "px");
  heart.style.animationDuration = 3 + Math.random() * 3 + "s";

  document.body.appendChild(heart);

  // Remove after falling
  setTimeout(() => {
    heart.remove();
  }, 6000);
}

// Create a new heart every 300ms
setInterval(createHeart, 300);
