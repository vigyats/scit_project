/* ============================================================
   BIZNOVATOR — Main Script
   Particles · Typing · Scroll Reveal · Counter · FAQ · etc.
   ============================================================ */

/* ─── Smooth Scroll ─────────────────────────────────────────── */
(window as Window & { smoothScroll: (e: Event, id: string) => void }).smoothScroll = (e: Event, id: string) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // close mobile menu if open
  navLinks?.classList.remove('open');
  hamburger?.classList.remove('open');
};

/* ─── Loader ────────────────────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 1800);
});

/* ─── Navbar ────────────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');
}, { passive: true });

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
});

/* ─── Scroll Progress ───────────────────────────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${pct}%`;
}, { passive: true });

/* ─── Back to Top ───────────────────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) backTop?.classList.add('visible');
  else backTop?.classList.remove('visible');
}, { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── Mouse Glow ────────────────────────────────────────────── */
const mouseGlow = document.createElement('div');
mouseGlow.className = 'mouse-glow';
document.body.appendChild(mouseGlow);
window.addEventListener('mousemove', (e) => {
  mouseGlow.style.left = `${e.clientX}px`;
  mouseGlow.style.top  = `${e.clientY}px`;
}, { passive: true });

/* ─── Particle Canvas ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = Math.min(80, Math.floor(window.innerWidth / 18));
  const COLORS = ['rgba(59,130,246,', 'rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,'];

  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * (window as Window & { innerWidth: number }).innerWidth,
    y: Math.random() * (window as Window & { innerHeight: number }).innerHeight,
    r: Math.random() * 1.8 + .4,
    vx: (Math.random() - .5) * .35,
    vy: (Math.random() - .5) * .35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    a: Math.random() * .5 + .15,
  }));

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${.08 * (1 - dist / 130)})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    // draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.a})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Typing Animation ──────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('heroTyped');
  if (!el) return;
  const phrases = ['Pitch.', 'Build.', 'Innovate.', 'Win.'];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1600); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  setTimeout(tick, 2000);
})();

/* ─── Scroll Reveal ─────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-fast');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const delay = idx * 80;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ─── Counter Animation ─────────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll<HTMLElement>('.stat-num[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.target ?? '0', 10);
      const dur = 1800;
      const start = performance.now();
      function step(now: number) {
        const progress = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target).toString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toString();
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: .5 });

  nums.forEach(n => observer.observe(n));
})();

/* ─── FAQ Accordion ─────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ─── Button Ripple ─────────────────────────────────────────── */
document.querySelectorAll<HTMLElement>('.btn').forEach(btn => {
  btn.addEventListener('click', (e: MouseEvent) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left - 5}px`;
    ripple.style.top  = `${e.clientY - rect.top  - 5}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ─── Toast Helper ──────────────────────────────────────────── */
function showToast(msg: string) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ─── Form Submission ───────────────────────────────────────── */
const regForm = document.getElementById('regForm');
regForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = regForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Registering...</span>';
  }
  setTimeout(() => {
    showToast('Registration successful! We\'ll be in touch soon. 🚀');
    (regForm as HTMLFormElement).reset();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>Register for Biznovator</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  }, 1000);
});

/* ─── Active Nav Link on Scroll ─────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const links    = document.querySelectorAll<HTMLElement>('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          const href = l.getAttribute('href')?.slice(1);
          if (href === id) l.style.color = '#ffffff';
          else l.style.color = '';
        });
      }
    });
  }, { threshold: .35 });
  sections.forEach(s => observer.observe(s));
})();

/* ─── Parallax Hero on mouse move ──────────────────────────── */
(function initParallax() {
  const hero = document.querySelector('.hero-visual') as HTMLElement | null;
  if (!hero) return;
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    hero.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
  }, { passive: true });
})();

export {};
