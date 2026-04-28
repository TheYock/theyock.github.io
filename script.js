const splash = document.getElementById("splash");
const portfolio = document.getElementById("portfolio");
const enterBtn = document.getElementById("enterBtn");
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const portfolioUrl = "portfolio.html";

let particles = [];
let animationStarted = false;
let waterEmitter = null;

document.body.classList.add("locked");

function getBrandMetrics() {
  const text = "YOCK";
  const fontSize = Math.max(window.innerHeight * 1.08, 180);
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  measureCtx.font = `900 ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;

  const measuredWidth = measureCtx.measureText(text).width;
  const targetWidth = window.innerWidth * 0.98;
  const scaleX = targetWidth / measuredWidth;

  return {
    text,
    fontSize,
    scaleX,
    targetWidth
  };
}

function fitBrandTitle() {
  const { fontSize, scaleX } = getBrandMetrics();

  splash.style.setProperty("--brand-font-size", `${fontSize}px`);
  splash.style.setProperty("--brand-scale-x", scaleX.toString());
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fitBrandTitle();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createTextParticles() {
  particles = [];

  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d");

  offscreen.width = window.innerWidth;
  offscreen.height = window.innerHeight;

  const { text, fontSize, scaleX } = getBrandMetrics();

  offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
  offCtx.font = `900 ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "#ffffff";
  offCtx.save();
  offCtx.translate(offscreen.width / 2, offscreen.height / 2);
  offCtx.scale(scaleX, 1);
  offCtx.fillText(text, 0, 0);
  offCtx.restore();

  const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imageData.data;

  const gap = Math.max(8, Math.floor(fontSize / 34));

  for (let y = 0; y < offscreen.height; y += gap) {
    for (let x = 0; x < offscreen.width; x += gap) {
      const index = (y * offscreen.width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 128) {
        const topHalf = y < window.innerHeight / 2;
        const direction = topHalf ? -1 : 1;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const swirl = direction * (0.012 + Math.random() * 0.02);

        particles.push({
          x,
          y,
          startX: x,
          startY: y,
          centerX,
          centerY,
          distance,
          swirl,
          size: gap,
          vx: (Math.random() - 0.5) * 2.2 + (-dy / distance) * swirl * 34,
          vy: direction * (Math.random() * 2.8 + 1.2) + (dx / distance) * swirl * 34,
          gravity: direction * 0.035,
          alpha: 1,
          color: "#050505",
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.08
        });
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    const dx = p.x - p.centerX;
    const dy = p.y - p.centerY;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const push = Math.min(0.05, 36 / distance);
    const tangentX = -dy / distance;
    const tangentY = dx / distance;
    const radialX = dx / distance;
    const radialY = dy / distance;

    p.vx += tangentX * p.swirl + radialX * push;
    p.vy += tangentY * p.swirl + radialY * push;
    p.vy += p.gravity;
    p.vx *= 0.994;
    p.vy *= 0.994;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    p.alpha -= 0.006;

    ctx.save();
    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  particles = particles.filter((p) => p.alpha > 0);

  if (particles.length > 0) {
    requestAnimationFrame(animateParticles);
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function emitWaterParticle() {
  if (prefersReducedMotion || animationStarted) return;

  const particle = document.createElement("span");
  const edge = Math.floor(Math.random() * 4);
  const width = enterBtn.offsetWidth;
  const height = enterBtn.offsetHeight;
  let x = 0;
  let y = 0;
  let angle = 0;

  if (edge === 0) {
    x = randomBetween(0, width);
    y = 0;
    angle = randomBetween(-135, -45);
  } else if (edge === 1) {
    x = width;
    y = randomBetween(0, height);
    angle = randomBetween(-45, 45);
  } else if (edge === 2) {
    x = randomBetween(0, width);
    y = height;
    angle = randomBetween(45, 135);
  } else {
    x = 0;
    y = randomBetween(0, height);
    angle = randomBetween(135, 225);
  }

  const distance = randomBetween(20, 34);
  const radians = (angle * Math.PI) / 180;
  const tx = Math.cos(radians) * distance;
  const ty = Math.sin(radians) * distance;
  const life = randomBetween(420, 720);

  particle.className = "water-particle";
  particle.setAttribute("aria-hidden", "true");
  particle.style.setProperty("--x", `${x}px`);
  particle.style.setProperty("--y", `${y}px`);
  particle.style.setProperty("--tx", `${tx}px`);
  particle.style.setProperty("--ty", `${ty}px`);
  particle.style.setProperty("--spin", `${randomBetween(-120, 120)}deg`);
  particle.style.setProperty("--size", `${randomBetween(2, 4.5)}px`);
  particle.style.setProperty("--life", `${life}ms`);

  enterBtn.appendChild(particle);
  setTimeout(() => particle.remove(), life + 80);
}

function scheduleWaterParticle() {
  waterEmitter = setTimeout(() => {
    emitWaterParticle();
    scheduleWaterParticle();
  }, randomBetween(35, 115));
}

function startWaterEmitter() {
  if (waterEmitter || prefersReducedMotion) return;
  scheduleWaterParticle();
}

function stopWaterEmitter() {
  clearTimeout(waterEmitter);
  waterEmitter = null;
}

function enterPortfolio() {
  if (animationStarted) return;
  animationStarted = true;
  stopWaterEmitter();

  if (prefersReducedMotion) {
    window.location.href = portfolioUrl;
    return;
  }

  resizeCanvas();
  createTextParticles();

  splash.classList.add("exiting");

  if (portfolio) {
    portfolio.classList.remove("hidden");
  }

  requestAnimationFrame(animateParticles);

  setTimeout(() => {
    if (portfolio) {
      portfolio.classList.add("visible");
    }

    document.body.classList.remove("locked");
  }, 450);

  setTimeout(() => {
    window.location.href = portfolioUrl;
  }, 1050);
}

enterBtn.addEventListener("click", enterPortfolio);
enterBtn.addEventListener("pointerenter", startWaterEmitter);
enterBtn.addEventListener("pointerleave", stopWaterEmitter);
enterBtn.addEventListener("focus", startWaterEmitter);
enterBtn.addEventListener("blur", stopWaterEmitter);

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    enterPortfolio();
  }
});
