/* ═══════════════════════════════════════════════════════════════
   MARYAM FRIENDSHIP  ·  main script
   ═══════════════════════════════════════════════════════════════ */

class FriendshipExperience {
  constructor() {
    this.currentScreen = "flowerScreen";
    this.noClickCount  = 0;
    this.init();
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  init() {
    // Start flower bloom animations after a short delay
    const t = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(t);
    }, 800);

    // Enable flower intro card interaction after animation completes
    // (4.5s delay + 1.2s duration = 5.7s total)
    setTimeout(() => {
      const card = document.querySelector(".flower-intro-card");
      if (card) card.style.pointerEvents = "all";
    }, 5800);

    this.bindButtons();
  }

  /* ─────────────────────────────────────────
     BUTTON BINDINGS
  ───────────────────────────────────────── */
  bindButtons() {
    this.on("startBtn",       () => this.goTo("apologyScreen"));
    this.on("nextToWhat",     () => this.goTo("whatScreen"));
    this.on("nextToPoem",     () => this.goTo("poemScreen"));
    this.on("nextToProposal", () => this.goTo("proposalScreen"));
    this.on("yesBtn",         () => this.handleYes());
    this.on("noBtn",          () => this.handleNo());
    this.on("restartBtn",     () => this.resetProposal());
  }

  on(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  /* ─────────────────────────────────────────
     SCREEN NAVIGATION
  ───────────────────────────────────────── */
  goTo(nextId) {
    const current = document.getElementById(this.currentScreen);
    const next    = document.getElementById(nextId);
    if (!current || !next) return;

    // Fade out current
    current.style.opacity = "0";
    current.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      current.classList.remove("active");
      current.style.display = "none";

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "instant" });

      // Fade in next
      next.style.display = "flex";
      next.style.opacity = "0";
      next.style.transition = "opacity 0.6s ease";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.classList.add("active");
          next.style.opacity = "1";
          this.currentScreen = nextId;
          this.onScreenEnter(nextId);
        });
      });
    }, 520);
  }

  /* ─────────────────────────────────────────
     SCREEN-SPECIFIC HOOKS
  ───────────────────────────────────────── */
  onScreenEnter(id) {
    if (id === "poemScreen") {
      this.animatePoemLines();
    }
    if (id === "celebrationScreen") {
      this.launchConfetti();
    }
  }

  /* ─────────────────────────────────────────
     POEM  ·  staggered line reveal
  ───────────────────────────────────────── */
  animatePoemLines() {
    const stanzas = document.querySelectorAll(".poem-stanza, .poem-divider");
    stanzas.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = `opacity 0.7s ease, transform 0.7s ease`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200 + i * 250);
    });
  }

  /* ─────────────────────────────────────────
     PROPOSAL  ·  YES
  ───────────────────────────────────────── */
  handleYes() {
    const gif      = document.getElementById("proposalGif");
    const msg      = document.getElementById("responseMessage");
    const buttons  = document.getElementById("proposalButtons");

    if (gif)     gif.src = "../FriendshipProposal-main/images/cat-yes.gif";
    if (buttons) buttons.style.display = "none";
    if (msg) {
      msg.innerHTML = `
        <p style="color:var(--gold);font-size:1.4rem;font-family:'Playfair Display',serif;
                  animation:fadeInMsg 0.8s ease forwards;">
          🎉 Yay! I'm so happy, Maryam! 💛
        </p>`;
    }

    this.burstSparkles();

    setTimeout(() => this.goTo("celebrationScreen"), 2800);
  }

  /* ─────────────────────────────────────────
     PROPOSAL  ·  NO (running button)
  ───────────────────────────────────────── */
  handleNo() {
    this.noClickCount++;
    const msg    = document.getElementById("responseMessage");
    const noBtn  = document.getElementById("noBtn");
    const yesBtn = document.getElementById("yesBtn");
    const gif    = document.getElementById("proposalGif");

    const lines = [
      "Are you sure? 🥺 Just give it a thought…",
      "Pleeeease? I promise no drama 😭",
      "Come on, even the cat wants you to say yes 😹",
      "Okay fine… last chance? 🥹",
      "I respect it… but the cat doesn't 😤",
    ];

    const idx = Math.min(this.noClickCount - 1, lines.length - 1);

    if (msg) msg.innerHTML = `<p style="animation:fadeInMsg 0.5s ease;">${lines[idx]}</p>`;
    if (gif) gif.src = "../FriendshipProposal-main/images/cat-02.gif";

    // Make Yes bigger
    if (yesBtn) {
      const scale = Math.min(1 + this.noClickCount * 0.08, 1.45);
      yesBtn.style.transform  = `scale(${scale})`;
      yesBtn.style.transition = "transform 0.3s ease";
    }

    // Make No run away
    if (noBtn) {
      const w  = window.innerWidth  - (noBtn.offsetWidth  || 160) - 32;
      const h  = window.innerHeight - (noBtn.offsetHeight || 56)  - 32;
      const rx = Math.max(20, Math.random() * w);
      const ry = Math.max(20, Math.random() * h);
      noBtn.style.position   = "fixed";
      noBtn.style.left       = rx + "px";
      noBtn.style.top        = ry + "px";
      noBtn.style.transition = "all 0.35s ease";
      noBtn.style.zIndex     = "9999";
    }

    if (this.noClickCount >= 5) {
      if (noBtn) noBtn.style.display = "none";
      const restart = document.getElementById("restartBtn");
      if (restart) restart.style.display = "inline-flex";
      if (msg) {
        msg.innerHTML = `<p style="color:var(--rose-light);animation:fadeInMsg 0.5s ease;">
          Okay… maybe another time. But I'll be here 🌸
        </p>`;
      }
    }
  }

  /* ─────────────────────────────────────────
     PROPOSAL  ·  RESET
  ───────────────────────────────────────── */
  resetProposal() {
    this.noClickCount = 0;
    const msg     = document.getElementById("responseMessage");
    const buttons = document.getElementById("proposalButtons");
    const restart = document.getElementById("restartBtn");
    const noBtn   = document.getElementById("noBtn");
    const yesBtn  = document.getElementById("yesBtn");
    const gif     = document.getElementById("proposalGif");

    if (msg)     msg.innerHTML = "";
    if (buttons) buttons.style.display = "flex";
    if (restart) restart.style.display = "none";
    if (noBtn) {
      noBtn.style.display    = "flex";
      noBtn.style.position   = "relative";
      noBtn.style.left       = "auto";
      noBtn.style.top        = "auto";
    }
    if (yesBtn) yesBtn.style.transform = "scale(1)";
    if (gif)    gif.src = "../FriendshipProposal-main/images/cat-01.gif";
  }

  /* ─────────────────────────────────────────
     SPARKLE BURST (on Yes)
  ───────────────────────────────────────── */
  burstSparkles() {
    const colors = ["#d4556a", "#f0c27f", "#ff7aaa", "#ffd700", "#fcd5ce"];
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const dot = document.createElement("div");
        dot.style.cssText = `
          position:fixed;
          width:8px; height:8px;
          border-radius:50%;
          background:${colors[i % colors.length]};
          left:${Math.random() * window.innerWidth}px;
          top:${Math.random() * window.innerHeight}px;
          pointer-events:none;
          z-index:9000;
          animation:sparkleAnim 1.4s ease-out forwards;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 1400);
      }, i * 45);
    }
    this.ensureStyle("sparkle-style", `
      @keyframes sparkleAnim {
        0%   { transform:scale(0) rotate(0deg);   opacity:1; }
        60%  { transform:scale(1.8) rotate(180deg); opacity:0.9; }
        100% { transform:scale(0) rotate(360deg); opacity:0; }
      }
      @keyframes fadeInMsg {
        from { opacity:0; transform:translateY(12px); }
        to   { opacity:1; transform:translateY(0); }
      }
    `);
  }

  /* ─────────────────────────────────────────
     CONFETTI (celebration screen)
  ───────────────────────────────────────── */
  launchConfetti() {
    const container = document.getElementById("confettiContainer");
    if (!container) return;

    const colors  = ["#d4556a","#f0c27f","#ff7aaa","#ffd700","#fcd5ce","#c778aa","#159faa"];
    const shapes  = ["2px","4px","6px"];

    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const piece = document.createElement("div");
        const size  = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left  = Math.random() * 100;
        const dur   = 2.5 + Math.random() * 3;
        const delay = Math.random() * 0.5;

        piece.className = "confetti-piece";
        piece.style.cssText = `
          left:${left}%;
          width:${size}; height:${parseInt(size) * 2}px;
          background:${color};
          animation-duration:${dur}s;
          animation-delay:${delay}s;
          border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
          transform:rotate(${Math.random()*360}deg);
        `;
        container.appendChild(piece);

        setTimeout(() => piece.remove(), (dur + delay) * 1000 + 500);
      }, i * 30);
    }
  }

  /* ─────────────────────────────────────────
     UTILITY
  ───────────────────────────────────────── */
  ensureStyle(id, css) {
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = css;
      document.head.appendChild(s);
    }
  }
}

/* ─────────────────────────────────────────
   BOOTSTRAP
───────────────────────────────────────── */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new FriendshipExperience());
} else {
  new FriendshipExperience();
}

// Keyboard: Enter on focused button
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.activeElement.tagName === "BUTTON") {
    document.activeElement.click();
  }
});

console.log("🌸 Maryam Friendship Experience loaded 🌸");
