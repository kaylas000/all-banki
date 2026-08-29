/* Bank Matrix Video Engine — SOTA 2026 Code-Video (SK-16 / SK-17 / M-12) */

class BankMatrixVideoEngine {
  constructor(canvas, onDone) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext("2d") : null;
    this.onDone = onDone;
    this.frame = 0;
    this.totalFrames = 210; // ~3.5s @ 60fps
    this.fps = 60;
    this.isPlaying = true;
    this.fontSize = 16;
    this.columns = [];
    this.matrixChars = "0123456789%₽$ABCDEF18.01%365ДНЕЙКЭШБЭК";

    // Dynamic text reveal per page
    if (canvas && canvas.dataset && canvas.dataset.text) {
      this.columnText = canvas.dataset.text.split("|");
    } else if (typeof window !== "undefined" && window.location.pathname.includes("kart")) {
      this.columnText = ["БАНКОВСКИЕ", "КАРТЫ", "ОНЛАЙН", "КЭШБЭК"];
    } else if (typeof window !== "undefined" && window.location.pathname.includes("kredity")) {
      this.columnText = ["КРЕДИТЫ", "НАЛИЧНЫМИ", "ОНЛАЙН", "В БАНКАХ"];
    } else if (typeof window !== "undefined" && (window.location.pathname.includes("mfo") || window.location.pathname.includes("zaym"))) {
      this.columnText = ["ЗАЙМЫ", "ОТ 0%", "ОНЛАЙН", "НА КАРТУ"];
    } else {
      this.columnText = ["ВИТРИНА", "КРЕДИТОВ", "ЗАЙМОВ"];
    }

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.totalFrames = 10; // instant reveal for accessibility
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const container = this.canvas.parentElement || document.body;
    const rect = container.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);

    const fontPx = Math.round(14 * dpr);
    const colCount = Math.floor(this.canvas.width / fontPx) || 20;
    this.columns = Array.from({ length: colCount }, () => ({
      y: Math.random() * -this.canvas.height,
      speed: (3 + Math.random() * 6) * dpr,
      chars: Array.from({ length: 25 }, () => this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)])
    }));
  }

  start() {
    if (!this.canvas || !this.ctx) {
      this.finish();
      return;
    }
    this.loop();
  }

  loop = () => {
    if (!this.isPlaying) return;
    const p = this.frame / this.totalFrames;
    this.renderMatrixFrame(p);
    this.frame++;
    if (this.frame >= this.totalFrames) {
      this.finish();
      return;
    }
    requestAnimationFrame(this.loop);
  };

  renderMatrixFrame(p) {
    const ctx = this.ctx;
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.fillStyle = "rgba(12, 11, 8, 0.22)";
    ctx.fillRect(0, 0, w, h);

    const fontPx = Math.round(14 * dpr);
    ctx.font = `700 ${fontPx}px 'JetBrains Mono', monospace`;

    this.columns.forEach((col, i) => {
      const x = i * fontPx;
      col.y += col.speed;
      if (col.y > h + 100) {
        col.y = -Math.random() * 200;
        col.speed = (3 + Math.random() * 6) * dpr;
      }
      col.chars.forEach((char, charIdx) => {
        const charY = col.y - charIdx * (fontPx + 2);
        if (charY > 0 && charY < h) {
          ctx.fillStyle = charIdx === 0 ? "#ffffff" : charIdx < 4 ? "rgba(224, 169, 28, 0.9)" : "rgba(46, 125, 79, 0.35)";
          const displayChar = (Math.random() < 0.05) ? this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)] : char;
          ctx.fillText(displayChar, x, charY);
        }
      });
    });

    const textProgress = Math.min(1, Math.max(0, (p - 0.05) / 0.85));
    const lineStep = 1 / this.columnText.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Mobile DPR text scaling: large, bold, crisp on 320px..4K
    const titleFontSize = Math.max(44 * dpr, Math.round(w * 0.11));
    const startY = h * 0.2;
    const lineHeight = titleFontSize * 1.25;

    this.columnText.forEach((word, lineIdx) => {
      const lineProgress = Math.min(1, Math.max(0, (textProgress - lineIdx * lineStep) / lineStep));
      if (lineProgress > 0) {
        const lineY = startY + lineIdx * lineHeight;
        const settledCount = Math.floor(lineProgress * word.length * 1.2);
        let displayWord = "";
        for (let c = 0; c < word.length; c++) {
          displayWord += c < settledCount ? word[c] : this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
        }

        ctx.save();
        ctx.translate(w / 2, lineY);
        ctx.globalAlpha = Math.min(1, lineProgress * 2);
        ctx.shadowColor = "#e0a91c";
        ctx.shadowBlur = 32 * lineProgress * dpr;
        ctx.font = `900 ${titleFontSize}px 'Russo One', sans-serif`;
        ctx.fillStyle = "#e0a91c";
        ctx.fillText(displayWord, 0, 0);
        ctx.restore();
      }
    });
  }

  finish() {
    this.isPlaying = false;
    const overlay = document.getElementById("introOverlay");
    if (overlay) {
      overlay.classList.add("is-done");
      overlay.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      setTimeout(() => {
        overlay.style.display = "none";
      }, 600);
    }
    if (this.onDone) this.onDone();
  }
}

// 📈 SOTA Code-Video Rate Engine
class BankCodeVideoEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext("2d") : null;
    this.frame = 0;
    this.fps = 60;
    this.particles = [];
    this.init();
  }

  init() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.particles = Array.from({ length: 300 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: 1.5 + Math.random() * 2.5,
      hue: Math.random() < 0.2 ? 35 : 210
    }));
  }

  renderFrame() {
    const ctx = this.ctx;
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = "rgba(15, 14, 10, 0.22)";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(224, 169, 28, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    // Kinetic Wave
    ctx.beginPath();
    ctx.strokeStyle = "#e0a91c";
    ctx.lineWidth = 3;

    for (let x = 0; x < w; x += 4) {
      const y = h / 2 + 
        Math.sin((x + this.frame * 2.5) * 0.015) * 35 + 
        Math.cos((x * 0.5 - this.frame) * 0.02) * 15;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Particles
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.fillStyle = p.hue === 35 ? "rgba(224, 169, 28, 0.85)" : "rgba(29, 58, 95, 0.75)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    this.frame++;
  }
}

// Auto-initialize on page load
if (typeof window !== "undefined") {
  const initEngine = () => {
    const canvas = document.getElementById("introCanvas");
    const overlay = document.getElementById("introOverlay");
    
    if (canvas && overlay) {
      const engine = new BankMatrixVideoEngine(canvas);
      engine.start();

      const dismiss = () => engine.finish();
      overlay.addEventListener("click", dismiss);
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") dismiss();
      });

      // Safety timeout: dismiss after 3.8s max
      setTimeout(() => {
        if (engine.isPlaying) engine.finish();
      }, 3800);
    } else if (overlay) {
      overlay.style.display = "none";
    }

    // Rate Canvas
    const rateCanvas = document.getElementById("rateCanvas");
    if (rateCanvas) {
      const videoEngine = new BankCodeVideoEngine(rateCanvas);
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      function loop() {
        videoEngine.renderFrame();
        if (!isReduced) requestAnimationFrame(loop);
      }
      loop();
    }

    // Filter pills & search & sorting
    const pills = document.querySelectorAll(".filter-pill");
    const cards = document.querySelectorAll(".card-item");
    const searchInput = document.getElementById("searchInput");

    function filterCards() {
      const search = (searchInput ? searchInput.value : "").toLowerCase();
      const activePill = document.querySelector(".filter-pill.active");
      const activeCat = activePill ? activePill.dataset.category : "all";

      cards.forEach(card => {
        const cat = card.dataset.category;
        const name = (card.dataset.name || "").toLowerCase();
        const matchCat = activeCat === "all" || cat === activeCat;
        const matchSearch = !search || name.includes(search);
        card.style.display = (matchCat && matchSearch) ? "flex" : "none";
      });
    }

    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", filterCards);
    }

    // Calculator Range Listeners
    const amountRange = document.getElementById("amountRange");
    const monthsRange = document.getElementById("monthsRange");
    const amountVal = document.getElementById("amountVal");
    const monthsVal = document.getElementById("monthsVal");
    const calcResult = document.getElementById("calcResult");

    function updateCalc() {
      if (!amountRange || !monthsRange || !calcResult) return;
      const amount = parseInt(amountRange.value, 10);
      const months = parseInt(monthsRange.value, 10);

      if (amountVal) amountVal.textContent = amount.toLocaleString("ru-RU") + " ₽";
      if (monthsVal) monthsVal.textContent = months + " " + (months <= 30 && (window.location.pathname.includes("mfo") || window.location.pathname.includes("zaym")) ? "дней" : "мес");

      const isMfo = window.location.pathname.includes("mfo") || window.location.pathname.includes("zaym");
      if (isMfo) {
        calcResult.textContent = amount.toLocaleString("ru-RU") + " ₽";
      } else {
        const monthlyRate = 0.185 / 12;
        const payment = Math.round((amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
        calcResult.textContent = payment.toLocaleString("ru-RU") + " ₽/мес";
      }
    }

    if (amountRange && monthsRange) {
      amountRange.addEventListener("input", updateCalc);
      monthsRange.addEventListener("input", updateCalc);
      updateCalc();
    }

    // Modals
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const modalOkBtn = document.getElementById("modalOkBtn");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const openModalBtns = document.querySelectorAll(".open-modal-btn");

    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove("active");
        modalOverlay.setAttribute("aria-hidden", "true");
      }
    }

    openModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title") || "Условия продукта";
        const desc = btn.getAttribute("data-desc") || "Информация о продукте.";

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;

        if (modalOverlay) {
          modalOverlay.classList.add("active");
          modalOverlay.setAttribute("aria-hidden", "false");
        }
      });
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener("click", closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    // Replay button
    const replayIntroBtn = document.getElementById("replayIntroBtn");
    if (replayIntroBtn && canvas && overlay) {
      replayIntroBtn.addEventListener("click", () => {
        overlay.style.display = "flex";
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        overlay.classList.remove("is-done");
        const reEngine = new BankMatrixVideoEngine(canvas);
        reEngine.start();
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEngine);
  } else {
    initEngine();
  }
}
