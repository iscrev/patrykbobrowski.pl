/* ============================================================
   patrykbobrowski.pl — script.js
   Lightweight: mobile menu, scroll reveal, form, cookies
   No canvas, no particle loops, no heavy RAF
   ============================================================ */

'use strict';

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const VideoPlaybackGuard = (() => {
  const videos = new Set();
  let activeVideo = null;
  let observer = null;

  const canUseObserver = 'IntersectionObserver' in window;

  const isElementVisible = video => {
    if (!video || !document.documentElement.contains(video)) return false;
    const rect = video.getBoundingClientRect();
    return rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth;
  };

  const pauseVideo = video => {
    if (!video || typeof video.pause !== 'function') return;
    if (!video.paused) video.pause();
    if (activeVideo === video) activeVideo = null;
  };

  const pauseAllExcept = currentVideo => {
    videos.forEach(video => {
      if (video !== currentVideo) pauseVideo(video);
    });
  };

  const handlePlay = video => {
    if (!isElementVisible(video)) {
      pauseVideo(video);
      return;
    }
    pauseAllExcept(video);
    activeVideo = video;
  };

  const register = video => {
    if (!(video instanceof HTMLVideoElement) || videos.has(video)) return;
    if (video.classList.contains('section-bg-video')) return; // Ignore background videos

    videos.add(video);
    video.addEventListener('play', () => handlePlay(video));
    video.addEventListener('playing', () => handlePlay(video));
    video.addEventListener('ended', () => {
      if (activeVideo === video) activeVideo = null;
    });

    if (observer) observer.observe(video);
    if (!video.paused) handlePlay(video);
  };

  const registerExisting = (root = document) => {
    root.querySelectorAll?.('video').forEach(register);
  };

  const pauseHiddenVideos = () => {
    videos.forEach(video => {
      if (!isElementVisible(video)) pauseVideo(video);
    });
  };

  const init = () => {
    if (canUseObserver) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            pauseVideo(entry.target);
          }
        });
      }, { threshold: [0, 0.2, 0.5, 0.8] });
    }

    registerExisting();

    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches?.('video')) register(node);
          registerExisting(node);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pagehide', () => pauseAllExcept(null));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseAllExcept(null);
    });

    if (!canUseObserver) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          pauseHiddenVideos();
          ticking = false;
        });
      }, { passive: true });
      window.addEventListener('resize', pauseHiddenVideos, { passive: true });
    }
  };

  return { init, pauseAllExcept, register };
})();

/* ── Navigation ─────────────────────────────────────────────── */
function initNav() {
  const nav    = $('.nav');
  const toggle = $('.nav-toggle');
  const mobile = $('.nav-mobile');

  if (!nav) return;

  // Scroll-based style
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const isOpen = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    $$('a, button', mobile).forEach(el => {
      el.addEventListener('click', () => {
        mobile.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
        mobile.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }
}

/* ── Smooth scroll ──────────────────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();

    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH,
      behavior: 'smooth'
    });
  });
}

/* ── Scroll reveal ───────────────────────────────────────── */
function initReveal() {
  const revealElements = $$('.reveal, .reveal-up, .reveal-scale, .reveal-blur');
  
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.id === 'showcase-track') {
          $('.showcase-controls')?.classList.add('is-visible');
          $('#showcase-dots')?.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -150px 0px', threshold: 0.15 }
  );

  // Apply stagger delay to sibling groups (grid children)
  const groups = $$('.portfolio-grid, .skills-grid, .process-grid');
  groups.forEach(group => {
    const children = $$('.reveal, .reveal-up, .reveal-scale, .reveal-blur', group);
    children.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 60}ms`);
    });
  });

  revealElements.forEach(el => {
    if (el.closest('.hero')) {
      el.classList.add('is-visible');
      return;
    }

    observer.observe(el);
  });
}
/* ── About Background Scroll Effect ───────────────────────────── */
function initAboutScrollEffect() {
  const bg = document.querySelector('.section-bg-video');
  const aboutSection = document.getElementById('o-mnie');
  if (!bg || !aboutSection) return;

  let ticking = false;
  
  const updateEffect = () => {
    const rect = aboutSection.getBoundingClientRect();
    const vh = window.innerHeight;
    
    // Check if section is visible
    if (rect.top < vh && rect.bottom > 0) {
      // Calculate how far we scrolled through the section (0 to 1)
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      
      // Scale from 1.15 to 1.3
      const scaleVal = 1.15 + (progress * 0.15);
      // Blur from 0px to 8px
      const blurVal = progress * 8;
      
      bg.style.transform = `scale(${scaleVal})`;
      bg.style.filter = `blur(${blurVal}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateEffect);
      ticking = true;
    }
  }, { passive: true });
  
  // Trigger once on load
  updateEffect();
}

/* ── Hero video (showreel card) ────────────────────────────── */
function initHeroCard() {
  const playBtn = $('#hero-play-btn');
  const inlineVideo = document.querySelector('.hero-card-inner .hero-poster');

  if (!playBtn || !inlineVideo) return;

  playBtn.addEventListener('click', () => {
    // Hide play button
    playBtn.style.display = 'none';
    
    // Enable sound and controls for inline viewing
    inlineVideo.muted = false;
    inlineVideo.controls = true;
    inlineVideo.currentTime = 0;
    
    // Play the video
    inlineVideo.play().catch(() => {});
  });
}

/* ── Premium 3D Showcase ─────────────────────────────── */
class PremiumShowcase {
  constructor() {
    this.track = document.getElementById('showcase-track');
    if (!this.track) return;

    this.portfolioVideos = [
      'sigma.mp4',
      '1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4', '7.mp4', '8.mp4', '9.mp4', '10.mp4',
      '11.mp4', '12.mp4', '13.mp4', '14.mp4', '15.mp4', '16.mp4', '17.mp4', '18.mp4',
      'Ff.mp4'
    ];
    this.videos = this.portfolioVideos;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isMuted = true;
    this.counterEl = document.getElementById('showcase-counter');
    this.totalEl = document.getElementById('showcase-total');
    this.soundBtn = document.getElementById('showcase-sound');
    this.dotsEl = document.getElementById('showcase-dots');
    this.bgVideo = document.getElementById('showcase-bg-video');
    this.showcase = document.getElementById('portfolio-showcase');
    
    this.init();
  }

  init() {
    if (this.bgVideo) {
      this.bgVideo.removeAttribute('src');
      this.bgVideo.pause();
    }
    this.renderDots();
    this.renderCards();
    this.bindEvents();
  }

  get total() {
    return this.portfolioVideos.length;
  }

  getPrevIndex(index = this.currentIndex) {
    return (index - 1 + this.total) % this.total;
  }

  getNextIndex(index = this.currentIndex) {
    return (index + 1) % this.total;
  }

  getIndex(offset) {
    return ((this.currentIndex + offset) % this.total + this.total) % this.total;
  }

  renderCards() {
    const shouldResume = this.isPlaying;
    this.isRendering = true;
    this.pauseInactiveVideos();
    this.track.innerHTML = '';

    const visibleCards = [
      { index: this.getIndex(-2), pos: '-2', label: 'Film dalej' },
      { index: this.getIndex(-1), pos: '-1', label: 'Poprzedni film' },
      { index: this.currentIndex, pos: '0', label: 'Aktywny film' },
      { index: this.getIndex(1), pos: '1', label: 'Następny film' },
      { index: this.getIndex(2), pos: '2', label: 'Film dalej' }
    ];

    visibleCards.forEach(({ index, pos, label }) => {
      const vid = this.portfolioVideos[index];
      const card = document.createElement('div');
      const isLandscape = vid === 'sigma.mp4';
      card.className = `showcase-card ${pos === '0' ? 'is-paused' : ''} ${isLandscape ? 'is-landscape' : ''}`;
      card.dataset.index = index;
      card.dataset.pos = pos;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${label}: ${vid}`);
      
      card.innerHTML = `
        <video 
          src="videos/${vid}" 
          class="showcase-video" 
          preload="metadata" 
          playsinline 
          loop 
          muted 
          data-video-index="${index}"
        ></video>
        <div class="showcase-play-btn" aria-hidden="true">
          <div class="showcase-play-icon">
            <svg class="showcase-play-svg" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg>
            <svg class="showcase-pause-svg" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
          </div>
        </div>
      `;

      const videoEl = card.querySelector('video');
      VideoPlaybackGuard.register(videoEl);
      videoEl.addEventListener('loadedmetadata', () => {
        if (videoEl.currentTime === 0) videoEl.currentTime = 0.1;
      });
      videoEl.addEventListener('play', () => this.syncActiveState(videoEl, true));
      videoEl.addEventListener('pause', () => this.syncActiveState(videoEl, false));

      card.addEventListener('click', () => this.handleCardClick(index));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleCardClick(index);
        }
      });
      
      this.track.appendChild(card);
    });

    this.isRendering = false;
    // Toggle landscape-center mode for adaptive side card sizing
    const centerVid = this.portfolioVideos[this.currentIndex];
    const isLandscapeCenter = centerVid === 'sigma.mp4';
    this.track.classList.toggle('has-landscape-center', isLandscapeCenter);
    if (this.showcase) this.showcase.classList.toggle('has-landscape-center', isLandscapeCenter);
    this.updateUi();
    if (shouldResume) this.playActiveVideo();
  }

  renderDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = '';
    this.portfolioVideos.forEach((vid, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase-dot';
      dot.dataset.index = index;
      dot.setAttribute('aria-label', `Pokaż film ${String(index + 1).padStart(2, '0')}: ${vid}`);
      dot.addEventListener('click', () => this.goTo(index));
      this.dotsEl.appendChild(dot);
    });
  }

  updateUi() {
    if (this.counterEl) {
      this.counterEl.textContent = String(this.currentIndex + 1).padStart(2, '0');
    }

    if (this.totalEl) {
      this.totalEl.textContent = String(this.total).padStart(2, '0');
    }

    if (this.soundBtn) {
      this.soundBtn.setAttribute('aria-pressed', String(!this.isMuted));
      this.soundBtn.setAttribute('aria-label', this.isMuted ? 'Włącz dźwięk' : 'Wycisz film');
      this.soundBtn.classList.toggle('is-unmuted', !this.isMuted);
      const label = this.soundBtn.querySelector('.showcase-sound-state');
      if (label) label.textContent = this.isMuted ? 'Wyciszone' : 'Dźwięk';
    }

    const activeVideo = this.getActiveVideo();
    if (activeVideo) activeVideo.muted = this.isMuted;

    if (this.dotsEl) {
      this.dotsEl.querySelectorAll('.showcase-dot').forEach(dot => {
        const isActive = Number(dot.dataset.index) === this.currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }
  }

  getActiveCard() {
    return this.track.querySelector('.showcase-card[data-pos="0"]');
  }

  getActiveVideo() {
    return this.getActiveCard()?.querySelector('video') || null;
  }

  pauseInactiveVideos() {
    this.track.querySelectorAll('video').forEach(video => {
      video.pause();
      if (Number(video.dataset.videoIndex) !== this.currentIndex) {
        video.currentTime = Math.min(video.currentTime || 0, 0.1);
      }
    });
  }

  async playActiveVideo() {
    const activeCard = this.getActiveCard();
    const activeVideo = this.getActiveVideo();
    if (!activeCard || !activeVideo) return;

    this.pauseInactiveVideos();
    VideoPlaybackGuard.pauseAllExcept(activeVideo);
    activeVideo.muted = this.isMuted;

    try {
      await activeVideo.play();
      activeCard.classList.add('is-playing');
      activeCard.classList.remove('is-paused');
      this.isPlaying = true;
    } catch {
      activeCard.classList.add('is-paused');
      activeCard.classList.remove('is-playing');
      this.isPlaying = false;
    }
  }

  pauseActiveVideo() {
    const activeCard = this.getActiveCard();
    const activeVideo = this.getActiveVideo();
    if (!activeCard || !activeVideo) return;

    activeVideo.pause();
    activeCard.classList.remove('is-playing');
    activeCard.classList.add('is-paused');
    this.isPlaying = false;
  }

  syncActiveState(video, isPlaying) {
    if (this.isRendering) return;
    const activeCard = this.getActiveCard();
    const activeVideo = this.getActiveVideo();
    if (!activeCard || !activeVideo || video !== activeVideo) return;

    activeCard.classList.toggle('is-playing', isPlaying);
    activeCard.classList.toggle('is-paused', !isPlaying);
    this.isPlaying = isPlaying;
  }

  togglePlay() {
    if (this.isPlaying) this.pauseActiveVideo();
    else this.playActiveVideo();
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    const activeVideo = this.getActiveVideo();
    if (activeVideo) activeVideo.muted = this.isMuted;
    this.updateUi();
  }

  goTo(index) {
    this.currentIndex = (index + this.total) % this.total;
    this.renderCards();
  }

  next() {
    this.goTo(this.getNextIndex());
  }

  prev() {
    this.goTo(this.getPrevIndex());
  }

  handleCardClick(index) {
    if (index === this.currentIndex) {
      this.togglePlay();
    } else {
      this.goTo(index);
    }
  }

  bindEvents() {
    const prevBtn = document.getElementById('showcase-prev');
    const nextBtn = document.getElementById('showcase-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    if (this.soundBtn) this.soundBtn.addEventListener('click', () => this.toggleSound());
    
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    const swipeThreshold = 40;
    
    this.track.addEventListener('touchstart', e => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
      currentX = startX;
    }, {passive: true});

    this.track.addEventListener('touchmove', e => {
      currentX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    this.track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].screenX;
      const endY = e.changedTouches[0].screenY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) this.next();
      else this.prev();
    }, {passive: true});
  }
}

/* ── Contact form ────────────────────────────────────────────── */
function initContactForm() {
  const form      = $('#contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const status    = $('#form-status');
  const endpoint  = form.dataset.endpoint;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic honeypot check
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value.trim()) return;

    // Required fields
    const name    = form.querySelector('[name="name"]')?.value.trim();
    const email   = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();
    const privacy = form.querySelector('[name="privacy"]')?.checked;

    if (!name || !email || !message) {
      showStatus('Wypełnij wszystkie wymagane pola.', 'error');
      return;
    }
    if (!privacy) {
      showStatus('Zaakceptuj politykę prywatności.', 'error');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.setAttribute('data-loading', 'true');
    const origLabel = submitBtn.textContent;
    submitBtn.textContent = 'Wysyłanie…';
    // Reset status
    if (status) {
      status.className = 'form-status';
    }

    try {
      if (!endpoint) throw new Error('Brak konfiguracji formularza.');

      const data = new FormData(form);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.reset();
        showStatus('Wiadomość wysłana! Odezwę się wkrótce.', 'success');
      } else {
        throw new Error(`Błąd serwera (${res.status})`);
      }
    } catch (err) {
      showStatus(`Błąd: ${err.message}. Napisz bezpośrednio.`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = origLabel;
    }
  });

  function showStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    // Force reflow so CSS transition triggers from opacity:0 start
    status.className = 'form-status';
    status.offsetHeight; // eslint-disable-line
    status.className = `form-status ${type}`;
  }
}

/* ── Process Animation ───────────────────────────────────────── */
function initProcessAnimation() {
  const section = document.querySelector('.process-section');
  if (!section) return;

  const fill    = document.getElementById('proc-fill');
  const badge   = document.getElementById('proc-badge');
  const status  = document.getElementById('proc-status');
  const clock   = document.getElementById('proc-clock-hand');
  const nodes   = [...section.querySelectorAll('.proc-node')];
  const cards   = [...section.querySelectorAll('.proc-card')];

  // We require GSAP
  if (!fill || cards.length === 0 || typeof gsap === 'undefined') return;

  let fired = false;

  const setStatus = (n) => {
    if (status) status.textContent = `${String(n).padStart(2,'0')} / 04`;
  };

  const run = () => {
    if (fired) return;
    fired = true;

    // We do NOT use section.classList.add anymore because we strictly use GSAP

    const tl = gsap.timeline({
      defaults: { ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
    });

    // ================== TIME 0.0s ==================
    tl.add(() => {
      nodes[0].classList.add('is-active-style');
      cards[0].classList.add('is-active-style');
      gsap.set(cards[0], { pointerEvents: "auto" });
      setStatus(1);
    }, 0);
    tl.to(nodes[0], { opacity: 1, scale: 1.15, duration: 0.4 }, 0);
    tl.to(cards[0], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 0);

    // ================== TIME 0.8s - 1.8s ==================
    tl.to(fill, { width: "33.333%", duration: 1.0 }, 0.8);

    // ================== TIME 1.8s ==================
    tl.add(() => {
      nodes[0].classList.replace('is-active-style', 'is-done-style');
      cards[0].classList.remove('is-active-style');
      nodes[1].classList.add('is-active-style');
      cards[1].classList.add('is-active-style');
      gsap.set(cards[1], { pointerEvents: "auto" });
      setStatus(2);
    }, 1.8);
    tl.to(nodes[0], { scale: 1, duration: 0.4 }, 1.8);
    tl.to(nodes[1], { opacity: 1, scale: 1.15, duration: 0.4 }, 1.8);
    tl.to(cards[1], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 1.8);

    // ================== TIME 2.0s - 3.0s ==================
    tl.to(fill, { width: "66.666%", duration: 1.0 }, 2.0);

    // ================== TIME 3.0s ==================
    tl.add(() => {
      nodes[1].classList.replace('is-active-style', 'is-done-style');
      cards[1].classList.remove('is-active-style');
      nodes[2].classList.add('is-active-style');
      cards[2].classList.add('is-active-style');
      gsap.set(cards[2], { pointerEvents: "auto" });
      setStatus(3);
    }, 3.0);
    tl.to(nodes[1], { scale: 1, duration: 0.4 }, 3.0);
    tl.to(nodes[2], { opacity: 1, scale: 1.15, duration: 0.4 }, 3.0);
    tl.to(cards[2], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 3.0);

    // ================== TIME 3.2s - 4.2s ==================
    tl.to(fill, { width: "100%", duration: 1.0 }, 3.2);

    // ================== TIME 4.2s ==================
    tl.add(() => {
      nodes[2].classList.replace('is-active-style', 'is-done-style');
      cards[2].classList.remove('is-active-style');
      nodes[3].classList.add('is-active-style');
      cards[3].classList.add('is-active-style');
      gsap.set(cards[3], { pointerEvents: "auto" });
      setStatus(4);
    }, 4.2);
    tl.to(nodes[2], { scale: 1, duration: 0.4 }, 4.2);
    tl.to(nodes[3], { opacity: 1, scale: 1.15, duration: 0.4 }, 4.2);
    tl.to(cards[3], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 4.2);

    // ================== TIME 5.0s ==================
    tl.add(() => {
      nodes[3].classList.replace('is-active-style', 'is-done-style');
      cards[3].classList.remove('is-active-style');
      badge.classList.add('is-active-shadow'); 
    }, 5.0);
    tl.to(nodes[3], { scale: 1, duration: 0.4 }, 5.0);
    tl.to(badge, { opacity: 1, scale: 1, duration: 0.6 }, 5.0);
    tl.to(clock, { rotation: 360 * 2, duration: 1.8, svgOrigin: "12 12", ease: "power2.inOut" }, 5.0);
    // Animate badge text 0 -> 48
    const badgeText = document.getElementById('proc-badge-text');
    let badgeObj = { val: 0 };
    tl.to(badgeObj, {
      val: 48,
      roundProps: "val",
      duration: 1.6,
      ease: "power1.out",
      onUpdate: () => {
        if (badgeText) badgeText.textContent = badgeObj.val + "h";
      }
    }, 5.0);
  };

  // We explicitly run gsap.set initially to hide them *immediately*
  // This is outside `run()` so it applies on script load before scrolling
  gsap.set(cards, { opacity: 0, y: 28, filter: "blur(10px)", pointerEvents: "none" });
  gsap.set(nodes, { opacity: 0, scale: 0.4, xPercent: -50, yPercent: -50 });
  gsap.set(badge, { opacity: 0, scale: 0.7 });
  gsap.set(fill, { width: "0%" });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { run(); io.disconnect(); } });
  }, { threshold: 0.35, rootMargin: "0px 0px -150px 0px" });

  io.observe(section);

}

/* ── Cookie banner ──────────────────────────────────────────── */
function initCookies() {
  const key = 'cookieConsent';
  const validValues = new Set(['accepted', 'necessary', 'rejected', 'custom']);

  const readConsent = () => {
    try {
      const value = localStorage.getItem(key);
      return validValues.has(value) ? value : null;
    } catch {
      return null;
    }
  };

  const updateConsentMode = value => {
    if (typeof gtag !== 'function') return;

    const granted = value === 'accepted';
    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });
  };

  const createBanner = () => {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Zgoda na cookies');
    banner.innerHTML = `
      <p>
        Ta strona używa plików cookies do analizy ruchu.
        Szczegóły w <a href="cookies.html">polityce cookies</a>.
      </p>
      <div class="cookie-actions">
        <button class="cookie-btn-accept" id="cookie-accept" data-cookie-consent="accepted">Akceptuj</button>
        <button class="cookie-btn-secondary" id="cookie-necessary" data-cookie-consent="necessary">Tylko niezbędne</button>
        <button class="cookie-btn-secondary" id="cookie-reject" data-cookie-consent="rejected">Odrzuć wszystkie</button>
        <a class="cookie-btn-settings" id="cookie-settings-link" href="cookie-settings.html">Ustawienia</a>
      </div>
    `;
    document.body.appendChild(banner);
    return banner;
  };

  const hideBanner = banner => {
    banner.classList.remove('visible');
    banner.setAttribute('aria-hidden', 'true');
  };

  const saveConsent = (value, banner) => {
    if (!validValues.has(value)) return;
    try { localStorage.setItem(key, value); }
    catch {}
    updateConsentMode(value);
    hideBanner(banner);
  };

  const stored = readConsent();
  if (stored) {
    updateConsentMode(stored);
    const existingBanner = $('#cookie-banner');
    if (existingBanner) hideBanner(existingBanner);
    return;
  }

  const banner = $('#cookie-banner') || createBanner();
  banner.setAttribute('aria-hidden', 'false');

  banner.addEventListener('click', event => {
    const consentButton = event.target.closest('[data-cookie-consent]');
    if (consentButton) {
      saveConsent(consentButton.dataset.cookieConsent, banner);
      return;
    }

    if (event.target.closest('#cookie-settings-link')) {
      hideBanner(banner);
    }
  });

  setTimeout(() => {
    if (!readConsent()) banner.classList.add('visible');
  }, 500);
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  VideoPlaybackGuard.init();
  initNav();
  initSmoothScroll();
  new PremiumShowcase(); // Initializes the 3D portfolio carousel
  initReveal();
  initAboutScrollEffect();
  initHeroCard();
  initProcessAnimation();
  initContactForm();
  initCookies();

  // Trigger page load animations immediately to prevent hanging on missing assets
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 50);

  if (typeof initSettingsTabs === 'function') initSettingsTabs();
});
