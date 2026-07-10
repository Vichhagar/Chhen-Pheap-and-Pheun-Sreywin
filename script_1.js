/* =========================================================
   KHMER ROYAL WEDDING — SCRIPT
   Organized by feature. Vanilla ES6, no dependencies.
========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------------------------------------------------------
     CONFIG — edit these to customize the invitation
  --------------------------------------------------------- */
  const CONFIG = {
    weddingDateISO: "2026-07-26T11:30:00+07:00",
  };

  /* ---------------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------------- */
  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loaderFill");
  const loaderPercent = document.getElementById("loaderPercent");
  const scrollGate = document.getElementById("scrollGate");

  function runLoader() {
    let progress = 0;
    const duration = reduceMotion ? 200 : 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
      loaderFill.style.width = progress + "%";
      loaderPercent.textContent = progress + "%";
      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          loader.classList.add("is-hidden");
          scrollGate.classList.add("is-visible");
          setTimeout(
            () => scrollGate.classList.add("is-open"),
            reduceMotion ? 50 : 400,
          );
        }, 250);
      }
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener("load", runLoader);
  // Fallback in case load event already fired
  if (document.readyState === "complete") runLoader();

  /* ---------------------------------------------------------
     2. ENTER SITE (scroll gate -> reveal content)
  --------------------------------------------------------- */
  const site = document.getElementById("site");
  const enterSiteBtn = document.getElementById("enterSiteBtn");

  function enterSite() {
    scrollGate.classList.add("is-leaving");
    scrollGate.classList.remove("is-visible", "is-open");
    site.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "";
    setTimeout(() => {
      scrollGate.style.display = "none";
      initScrollReveal(); // (re)check reveal state once visible
    }, 900);
  }
  document.body.style.overflow = "hidden";
  enterSiteBtn.addEventListener("click", enterSite);

  /* ---------------------------------------------------------
     3. NAVIGATION — scroll state, mobile menu, active link, smooth scroll
  --------------------------------------------------------- */
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll("[data-nav]");
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const backToTop = document.getElementById("backToTop");

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );

  const sections = document.querySelectorAll(".section, .hero");
  function onScroll() {
    // nav background
    nav.classList.toggle("is-scrolled", window.scrollY > 60);

    // scroll progress
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = pct + "%";

    // back to top visibility
    backToTop.classList.toggle("is-visible", scrollTop > 800);

    // active nav link
    let current = "";
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === "#" + current,
      );
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }),
  );

  /* ---------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------- */
  let revealObserver;
  function initScrollReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => revealObserver.observe(el));
  }
  initScrollReveal();

  /* ---------------------------------------------------------
     5. TIMELINE PROGRESS LINE
  --------------------------------------------------------- */
  const timeline = document.getElementById("timeline");
  const timelineFill = document.getElementById("timelineFill");
  function updateTimelineFill() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.75;
    const total = rect.height;
    const visible = Math.min(Math.max(viewportCenter - rect.top, 0), total);
    const pct = total > 0 ? (visible / total) * 100 : 0;
    timelineFill.style.height = pct + "%";
  }
  window.addEventListener("scroll", updateTimelineFill, { passive: true });
  window.addEventListener("resize", updateTimelineFill);

  /* ---------------------------------------------------------
     6. HERO "OPEN INVITATION" — fireworks / sparkles / confetti + music
  --------------------------------------------------------- */
  const openInvitationBtn = document.getElementById("openInvitationBtn");
  const bgMusic = document.getElementById("bgMusic");

  function spawnFX() {
    const layer = document.createElement("div");
    layer.className = "fx-layer";
    document.body.appendChild(layer);
    const colors = ["#D4AF37", "#F1D68C", "#E8A0BF", "#FDF8F0", "#6D0019"];

    for (let i = 0; i < 40; i++) {
      const spark = document.createElement("div");
      spark.className = "fx-confetti";
      const size = 6 + Math.random() * 6;
      spark.style.width = size + "px";
      spark.style.height = size * 1.6 + "px";
      spark.style.left = Math.random() * 100 + "vw";
      spark.style.top = "-20px";
      spark.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      spark.style.opacity = "0.9";
      spark.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      const duration = 2200 + Math.random() * 1400;
      const rotate = Math.random() * 720 - 360;
      const drift = (Math.random() - 0.5) * 200;
      spark.animate(
        [
          { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
          {
            transform: `translate(${drift}px, 105vh) rotate(${rotate}deg)`,
            opacity: 0.2,
          },
        ],
        { duration, easing: "cubic-bezier(.22,.61,.36,1)" },
      );
      layer.appendChild(spark);
      setTimeout(() => spark.remove(), duration + 50);
    }

    for (let i = 0; i < 24; i++) {
      const spark = document.createElement("div");
      spark.className = "fx-spark";
      const size = 3 + Math.random() * 5;
      spark.style.width = size + "px";
      spark.style.height = size + "px";
      spark.style.left = 50 + (Math.random() - 0.5) * 60 + "vw";
      spark.style.top = 35 + (Math.random() - 0.5) * 30 + "vh";
      spark.style.background =
        "radial-gradient(circle, #fff, " +
        colors[Math.floor(Math.random() * colors.length)] +
        ")";
      const duration = 900 + Math.random() * 700;
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      spark.animate(
        [
          { transform: "translate(0,0) scale(0)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(1)`,
            opacity: 0,
          },
        ],
        { duration, easing: "ease-out" },
      );
      layer.appendChild(spark);
      setTimeout(() => spark.remove(), duration + 50);
    }

    setTimeout(() => layer.remove(), 3800);
  }

  openInvitationBtn.addEventListener("click", () => {
    if (!reduceMotion) spawnFX();
    requestAnimationFrame(() => {
      document
        .getElementById("welcome")
        .scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
    if (bgMusic && bgMusic.paused) {
      bgMusic.volume = parseFloat(
        document.getElementById("musicVolume").value || "0.5",
      );
      bgMusic.play().catch(() => {
        /* autoplay may still be blocked; user can use the music widget */
      });
      updateMusicUI(true);
    }
  });

  /* ---------------------------------------------------------
     7. AMBIENT PARTICLES (background gold dust)
  --------------------------------------------------------- */
  const bgParticles = document.getElementById("bgParticles");
  if (!reduceMotion && bgParticles) {
    const count = window.innerWidth < 700 ? 16 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "bg-particle";
      p.style.left = Math.random() * 100 + "%";
      const size = 3 + Math.random() * 5;
      p.style.width = size + "px";
      p.style.height = size + "px";
      const duration = 12 + Math.random() * 14;
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = Math.random() * duration + "s";
      bgParticles.appendChild(p);
    }
  }

  /* ---------------------------------------------------------
     8. FLOATING LANTERNS (thank-you section)
  --------------------------------------------------------- */
  const lanternField = document.getElementById("lanternField");
  if (!reduceMotion && lanternField) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const l = document.createElement("span");
      l.className = "lantern";
      l.style.left = Math.random() * 100 + "%";
      const duration = 10 + Math.random() * 8;
      l.style.animationDuration = duration + "s";
      l.style.animationDelay = Math.random() * duration + "s";
      lanternField.appendChild(l);
    }
  }

  /* ---------------------------------------------------------
     9. CURSOR GLOW + CARD TILT (mouse parallax)
  --------------------------------------------------------- */
  const cursorGlow = document.querySelector(".cursor-glow");
  if (
    !reduceMotion &&
    cursorGlow &&
    window.matchMedia("(hover:hover)").matches
  ) {
    window.addEventListener(
      "mousemove",
      (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
      },
      { passive: true },
    );

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     10. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------------
     11. COUNTDOWN — flip cards
  --------------------------------------------------------- */
  const weddingDate = new Date(CONFIG.weddingDateISO).getTime();
  const flipEls = {
    days: document.querySelector("#flipDays .flip__num"),
    hours: document.querySelector("#flipHours .flip__num"),
    minutes: document.querySelector("#flipMinutes .flip__num"),
    seconds: document.querySelector("#flipSeconds .flip__num"),
  };
  const flipCards = {
    days: document.getElementById("flipDays"),
    hours: document.getElementById("flipHours"),
    minutes: document.getElementById("flipMinutes"),
    seconds: document.getElementById("flipSeconds"),
  };
  let lastValues = { days: "", hours: "", minutes: "", seconds: "" };

  function updateCountdown() {
    const now = Date.now();
    let diff = Math.max(0, weddingDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const values = {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
    Object.keys(values).forEach((key) => {
      if (values[key] !== lastValues[key]) {
        flipEls[key].textContent = values[key];
        if (!reduceMotion) {
          flipCards[key].classList.remove("is-flipping");
          void flipCards[key].offsetWidth; // reflow to restart animation
          flipCards[key].classList.add("is-flipping");
        }
      }
    });
    lastValues = values;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------------------------------------------------
     12. GALLERY LIGHTBOX
  --------------------------------------------------------- */
  const masonryItems = Array.from(document.querySelectorAll(".masonry__item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxStage = document.getElementById("lightboxStage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let currentIndex = 0;

  function renderLightbox(index) {
    currentIndex = (index + masonryItems.length) % masonryItems.length;
    const item = masonryItems[currentIndex];
    const hue = getComputedStyle(item).getPropertyValue("--hue") || "340";
    const caption = item.querySelector(".masonry__caption")?.textContent || "";
    lightboxStage.style.background = `linear-gradient(150deg, hsl(${hue} 55% 55%), hsl(${parseInt(hue) + 30} 45% 25%))`;
    lightboxStage.setAttribute("aria-label", caption);
    lightboxStage.innerHTML = `<div style="position:absolute;bottom:20px;left:24px;color:#fff;font-family:'Poppins',sans-serif;font-size:.85rem;letter-spacing:.05em;text-transform:uppercase;">${caption}</div>`;
    lightboxStage.style.position = "relative";
  }

  function openLightbox(index) {
    renderLightbox(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  masonryItems.forEach((item, i) =>
    item.addEventListener("click", () => openLightbox(i)),
  );
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () =>
    renderLightbox(currentIndex - 1),
  );
  lightboxNext.addEventListener("click", () =>
    renderLightbox(currentIndex + 1),
  );
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") renderLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") renderLightbox(currentIndex + 1);
  });

  /* Simple slideshow autoplay while open (pauses on hover) */
  let slideshowTimer = null;
  lightbox.addEventListener("mouseenter", () => clearInterval(slideshowTimer));

  /* ---------------------------------------------------------
     13. VIDEO PLAY BUTTON (placeholder — swap src for real video)
  --------------------------------------------------------- */
  const videoPlayBtn = document.getElementById("videoPlayBtn");
  const videoFrame = document.getElementById("videoFrame");
  // videoPlayBtn.addEventListener("click", () => {
  //   videoFrame.innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Poppins',sans-serif;font-size:.9rem;text-align:center;padding:20px;background:linear-gradient(150deg,#8a4a4f,#2B1A12);">
  //     Add your wedding video by replacing this section with a &lt;video&gt; tag or an embedded player.
  //   </div>`;
  // });

  /* ---------------------------------------------------------
     14. RSVP FORM — validation, submit animation, confetti, popup
  --------------------------------------------------------- */
  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpPopup = document.getElementById("rsvpPopup");
  const rsvpPopupClose = document.getElementById("rsvpPopupClose");

  /* ---------------------------------------------------------
     15. GUEST WISHES — add cards dynamically
  --------------------------------------------------------- */
  const wishForm = document.getElementById("wishForm");
  const wishCards = document.getElementById("wishCards");
  const seedWishes = [
    {
      name: "Dara & Family",
      message: "Wishing you a lifetime of love and happiness together!",
    },
    {
      name: "Ratana",
      message: "So happy for you both. Can\u2019t wait to celebrate!",
    },
  ];

  /* ---------------------------------------------------------
     16. MUSIC PLAYER
  --------------------------------------------------------- */
  const musicToggle = document.getElementById("musicToggle");
  const musicPlayPause = document.getElementById("musicPlayPause");
  const musicVolume = document.getElementById("musicVolume");
  const musicMute = document.getElementById("musicMute");
  let lastVolume = 0.5;

  function updateMusicUI(isPlaying) {
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicPlayPause.textContent = isPlaying ? "❚❚" : "▶";
  }

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.volume = parseFloat(musicVolume.value);
      bgMusic.play().catch(() => {});
      updateMusicUI(true);
    } else {
      bgMusic.pause();
      updateMusicUI(false);
    }
  }
  musicToggle.addEventListener("click", toggleMusic);
  musicPlayPause.addEventListener("click", toggleMusic);
  musicVolume.addEventListener("input", () => {
    bgMusic.volume = parseFloat(musicVolume.value);
  });
  musicMute.addEventListener("click", () => {
    if (bgMusic.muted) {
      bgMusic.muted = false;
      musicMute.textContent = "🔊";
    } else {
      bgMusic.muted = true;
      musicMute.textContent = "🔇";
    }
  });

  /* ---------------------------------------------------------
     17. KEYBOARD ESCAPE — close mobile nav
  --------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
    }
  });

  /* ---------------------------------------------------------
     18. Init scroll-dependent bits once on load
  --------------------------------------------------------- */
  onScroll();
  updateTimelineFill();
})();
