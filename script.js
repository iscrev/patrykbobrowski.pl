/* ============================================================
   patrykbobrowski.pl — script.js
   Lightweight: mobile menu, scroll reveal, form, cookies
   No canvas, no particle loops, no heavy RAF
   ============================================================ */

'use strict';

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

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
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
  );

  // Apply stagger delay to sibling groups (grid children)
  const groups = $$('.portfolio-grid, .skills-grid, .process-grid');
  groups.forEach(group => {
    const children = $$('.reveal, .reveal-up, .reveal-scale, .reveal-blur', group);
    children.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 60}ms`);
    });
  });

  $$('.reveal, .reveal-up, .reveal-scale, .reveal-blur').forEach(el => observer.observe(el));
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

    this.portfolioVideos = Array.from({ length: 18 }, (_, index) => `${index + 1}.mp4`);
    this.videos = this.portfolioVideos;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isMuted = true;
    this.counterEl = document.getElementById('showcase-counter');
    this.soundBtn = document.getElementById('showcase-sound');
    this.dotsEl = document.getElementById('showcase-dots');
    this.bgVideo = document.getElementById('showcase-bg-video');
    
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

  renderCards() {
    this.pauseInactiveVideos();
    this.track.innerHTML = '';

    const visibleCards = [
      { index: this.getPrevIndex(), pos: '-1', label: 'Poprzedni film' },
      { index: this.currentIndex, pos: '0', label: 'Aktywny film' },
      { index: this.getNextIndex(), pos: '1', label: 'Następny film' }
    ];

    visibleCards.forEach(({ index, pos, label }) => {
      const vid = this.portfolioVideos[index];
      const card = document.createElement('div');
      card.className = `showcase-card ${pos === '0' ? 'is-paused' : ''}`;
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
      videoEl.addEventListener('loadedmetadata', () => {
        if (videoEl.currentTime === 0) videoEl.currentTime = 0.1;
      });

      card.addEventListener('click', () => this.handleCardClick(index));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleCardClick(index);
        }
      });
      
      this.track.appendChild(card);
    });

    this.updateUi();
    if (this.isPlaying) this.playActiveVideo();
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
      this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${this.total}`;
    }

    if (this.soundBtn) {
      this.soundBtn.setAttribute('aria-pressed', String(!this.isMuted));
      this.soundBtn.setAttribute('aria-label', this.isMuted ? 'Włącz dźwięk' : 'Wycisz film');
      this.soundBtn.classList.toggle('is-unmuted', !this.isMuted);
      const label = this.soundBtn.querySelector('span');
      if (label) label.textContent = this.isMuted ? 'Muted' : 'Sound';
    }

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
  const processModule = document.getElementById('process-module');
  if (!processModule) return;

  const processSection = document.getElementById('proces');
  const heading = processSection?.querySelector('.process-heading');
  const fill = document.getElementById('process-fill');
  const steps = [...document.querySelectorAll('.process-step-premium')];
  const status = processModule.querySelector('.process-status');
  
  if (!fill || steps.length === 0) return;

  let hasAnimated = false;
  let loopInterval = null;
  let loopTimeout = null;
  const getIsDesktop = () => window.innerWidth >= 1024;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setProgress = (index) => {
    const progress = steps.length > 1 ? index / (steps.length - 1) : 1;
    fill.style.transform = getIsDesktop() ? `scaleX(${progress})` : `scaleY(${progress})`;
    if (status) status.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
  };

  const setActiveStep = (index, complete = index === steps.length - 1) => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle('is-active', stepIndex === index);
      step.classList.toggle('is-complete-step', stepIndex < index);
      step.setAttribute('aria-current', stepIndex === index ? 'step' : 'false');
    });
    setProgress(index);
    processModule.classList.toggle('is-complete', complete);
  };

  const clearProcessLoop = () => {
    if (loopInterval) {
      clearInterval(loopInterval);
      loopInterval = null;
    }
    if (loopTimeout) {
      clearTimeout(loopTimeout);
      loopTimeout = null;
    }
  };

  const runProcessLoop = () => {
    clearProcessLoop();
    let index = 0;
    setActiveStep(index, false);

    loopInterval = setInterval(() => {
      index += 1;
      setActiveStep(index, index === steps.length - 1);

      if (index === steps.length - 1) {
        clearInterval(loopInterval);
        loopInterval = null;
        loopTimeout = setTimeout(runProcessLoop, 3200);
      }
    }, 1450);
  };

  steps.forEach(step => {
    step.setAttribute('tabindex', '0');
    step.setAttribute('role', 'button');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        heading?.classList.add('is-visible');
        processModule.classList.add('is-sequencing');
        
        if (prefersReducedMotion) {
          setActiveStep(steps.length - 1, true);
          return;
        }

        loopTimeout = setTimeout(runProcessLoop, 420);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(processModule);
  
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      hasAnimated = true;
      clearProcessLoop();
      setActiveStep(index, index === steps.length - 1);
      if (!prefersReducedMotion) {
        loopTimeout = setTimeout(runProcessLoop, 4200);
      }
    });

    step.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        hasAnimated = true;
        clearProcessLoop();
        setActiveStep(index, index === steps.length - 1);
        if (!prefersReducedMotion) {
          loopTimeout = setTimeout(runProcessLoop, 4200);
        }
      }
    });
  });
}

/* ── Cookie banner ──────────────────────────────────────────── */
function initCookies() {
  const banner  = $('#cookie-banner');
  if (!banner) return;

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('cookie-consent-v1') || '{}'); }
    catch { return {}; }
  })();

  // If consent already given, skip
  if (stored.necessary) return;

  // Show after short delay (don't block CTA)
  setTimeout(() => banner.classList.add('visible'), 1200);

  const accept = $('#cookie-accept');
  const settings = $('#cookie-settings-link');

  if (accept) {
    accept.addEventListener('click', () => {
      const consent = {
        necessary: true,
        analytics: true,
        marketing: false,
        ts: Date.now()
      };
      try { localStorage.setItem('cookie-consent-v1', JSON.stringify(consent)); }
      catch {}
      banner.classList.remove('visible');

      // Signal GA if available
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    });
  }

  if (settings) {
    settings.addEventListener('click', () => {
      banner.classList.remove('visible');
    });
  }
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
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
