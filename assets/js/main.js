/* Francesco Romeo — portfolio interactions
 * Code rain background, parallax layers, scroll reveal, mobile menu and project gallery.
 * No dependencies.
 */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Config ---------- */

  const RAIN = {
    opacity: 0.12, // base alpha of the falling code
    speed: 1, // speed multiplier
    gap: 30, // px between columns
    lineHeight: 17,
    font: '13px "JetBrains Mono", ui-monospace, monospace',
    color: '#c9ced6',
    accent: '#ffa31a',
  };

  const PARALLAX_STRENGTH = 1;

  const SNIPPETS = [
    'flutter build apk --release',
    'BlocProvider(create: (_) => NavCubit())',
    'setState(() => _index++);',
    'fun onCreate(savedInstanceState: Bundle?)',
    'val api = Retrofit.Builder().build()',
    'export default defineComponent({ setup() })',
    '@Component({ selector: "app-root" })',
    'this.http.get<Stats>(url).subscribe()',
    'transform.Rotate(Vector3.up * speed);',
    'void Update() { }',
    'cv2.VideoCapture(0).read()',
    'model.fit(x, y, epochs=10)',
    'git push origin main',
    'npm run dev',
    'SELECT * FROM projects;',
    'return <FlatList data={pokemon} />',
    'import tensorflow as tf',
    'while (alive) { build(); }',
    'const app = createApp(App)',
    'O(n log n)',
    '01001000 01101001',
    '</> => { } ;',
  ];

  const GALLERIES = {
    quiz: {
      title: 'Quiz & Fresh Pineapple',
      tech: 'Flutter',
      images: [
        { src: 'assets/img/projects/quiz_mockup.webp', app: 'Quiz' },
        { src: 'assets/img/projects/fresh_pineapple1.webp', app: 'Fresh Pineapple' },
        { src: 'assets/img/projects/fresh_pineapple2.webp', app: 'Fresh Pineapple' },
        { src: 'assets/img/projects/fresh_pineapple3.webp', app: 'Fresh Pineapple' },
      ],
    },
    sidera: {
      title: 'Sidera & Way2Learn',
      tech: 'Kotlin · Android',
      images: [
        { src: 'assets/img/projects/sidera1.webp', app: 'Sidera' },
        { src: 'assets/img/projects/sidera2.webp', app: 'Sidera' },
        { src: 'assets/img/projects/sidera3.webp', app: 'Sidera' },
        { src: 'assets/img/projects/sidera4.webp', app: 'Sidera' },
        { src: 'assets/img/projects/sidera5.webp', app: 'Sidera' },
        { src: 'assets/img/projects/way2learn1.webp', app: 'Way2Learn' },
        { src: 'assets/img/projects/way2learn2.webp', app: 'Way2Learn' },
        { src: 'assets/img/projects/way2learn3.webp', app: 'Way2Learn' },
      ],
    },
  };

  /* ---------- Code rain ---------- */

  function initRain() {
    const canvas = document.getElementById('code-rain');
    if (!canvas) return { step() {} };
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let cols = [];

    const pick = () => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];

    function spawn(col, fresh) {
      col.text = pick();
      col.speed = 22 + Math.random() * 46;
      col.active = Math.random() < 0.6;
      col.y = fresh ? Math.random() * h * 1.2 - h * 0.2 : -Math.random() * 240;
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.ceil(w / RAIN.gap);
      cols = [];
      for (let i = 0; i < n; i++) {
        const col = { x: i * RAIN.gap + Math.random() * 8 };
        spawn(col, true);
        cols.push(col);
      }
      draw(0);
    }

    function draw(dt) {
      const lh = RAIN.lineHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.font = RAIN.font;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      for (const col of cols) {
        col.y += col.speed * RAIN.speed * dt;
        const n = col.text.length;
        if (col.y - n * lh > h) {
          spawn(col, false);
          continue;
        }
        if (!col.active) continue;
        for (let k = 0; k < n; k++) {
          const ch = col.text[k];
          if (ch === ' ') continue;
          const y = col.y - (n - 1 - k) * lh;
          if (y < -lh || y > h) continue;
          const head = k === n - 1;
          const f = n > 1 ? k / (n - 1) : 1;
          ctx.globalAlpha = head ? Math.min(1, RAIN.opacity * 2.2) : RAIN.opacity * (0.2 + 0.8 * f);
          ctx.fillStyle = head ? RAIN.accent : RAIN.color;
          ctx.fillText(ch, col.x, y);
        }
      }
      ctx.globalAlpha = 1;
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });
    // Redraw once the mono font is ready so glyphs use it
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => draw(0));
    resize();

    return { step: draw };
  }

  /* ---------- Parallax ---------- */

  function initParallax() {
    const els = Array.from(document.querySelectorAll('[data-depth]')).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth) || 0,
      bg: el.dataset.parallax === 'bg',
    }));
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;

    if (finePointer) {
      window.addEventListener(
        'pointermove',
        (e) => {
          tmx = e.clientX / window.innerWidth - 0.5;
          tmy = e.clientY / window.innerHeight - 0.5;
        },
        { passive: true }
      );
    }

    function step() {
      const vh = window.innerHeight;
      const scroll = window.scrollY;
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;
      for (const item of els) {
        const d = item.depth * PARALLAX_STRENGTH;
        let ty;
        if (item.bg) {
          ty = -scroll * d;
        } else {
          const host = item.el.parentElement || item.el;
          const r = host.getBoundingClientRect();
          // Skip work for elements far off-screen
          if (r.bottom < -400 || r.top > vh + 400) continue;
          const delta = Math.max(-520, Math.min(520, r.top + r.height / 2 - vh / 2));
          ty = -delta * d;
        }
        const tx = mx * d * 90;
        ty += my * d * 90;
        item.el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      }
    }

    function reset() {
      for (const item of els) item.el.style.transform = '';
    }

    return { step, reset };
  }

  /* ---------- Scroll reveal ---------- */

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Mobile menu ---------- */

  function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('hidden', !open);
      menu.classList.toggle('flex', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a') && window.matchMedia('(max-width: 767px)').matches) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Gallery ---------- */

  function initGallery() {
    const dialog = document.getElementById('gallery');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const img = document.getElementById('gallery-image');
    const title = document.getElementById('gallery-title');
    const tech = document.getElementById('gallery-tech');
    const status = document.getElementById('gallery-status');
    const thumbs = document.getElementById('gallery-thumbs');
    const pad = (n) => String(n).padStart(2, '0');

    let gallery = null;
    let index = 0;

    function render() {
      const item = gallery.images[index];
      const total = gallery.images.length;
      img.src = item.src;
      img.alt = `${item.app} screenshot ${index + 1} of ${total}`;
      img.classList.remove('animate-gin');
      void img.offsetWidth; // restart the fade animation
      img.classList.add('animate-gin');
      status.textContent = `${item.app} · ${pad(index + 1)} / ${pad(total)}`;
      thumbs.querySelectorAll('button').forEach((b, i) => {
        const current = i === index;
        b.setAttribute('aria-current', current ? 'true' : 'false');
        b.classList.toggle('border-accent', current);
        b.classList.toggle('opacity-100', current);
        b.classList.toggle('border-transparent', !current);
        b.classList.toggle('opacity-50', !current);
      });
      // Preload neighbours
      [index - 1, index + 1].forEach((i) => {
        const n = gallery.images[(i + total) % total];
        if (n) new Image().src = n.src;
      });
    }

    function go(i) {
      const total = gallery.images.length;
      index = ((i % total) + total) % total;
      render();
    }

    function open(key) {
      gallery = GALLERIES[key];
      if (!gallery) return;
      index = 0;
      title.textContent = gallery.title;
      tech.textContent = gallery.tech;
      thumbs.replaceChildren(
        ...gallery.images.map((im, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className =
            'size-16 shrink-0 cursor-pointer overflow-hidden rounded-[10px] border-2 border-transparent bg-surface-2 p-0 opacity-50 transition hover:opacity-100';
          b.setAttribute('aria-label', `Show ${im.app} screenshot ${i + 1}`);
          const t = document.createElement('img');
          t.src = im.src;
          t.alt = '';
          t.loading = 'lazy';
          t.className = 'block size-full object-cover object-top';
          b.append(t);
          b.addEventListener('click', () => go(i));
          return b;
        })
      );
      render();
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    }

    document.querySelectorAll('[data-gallery]').forEach((btn) => {
      btn.addEventListener('click', () => open(btn.dataset.gallery));
    });
    dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-gallery-prev]').addEventListener('click', () => go(index - 1));
    dialog.querySelector('[data-gallery-next]').addEventListener('click', () => go(index + 1));
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(index + 1);
      }
    });
    // Click on the dimmed area (outside the content) closes
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
    });

    // Basic swipe support on touch screens
    let startX = null;
    img.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    img.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- Boot ---------- */

  function boot() {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    initMenu();
    initGallery();
    initReveal();

    const rain = initRain();
    const parallax = initParallax();

    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      rain.step(dt);
      parallax.step();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches || document.hidden) {
        parallax.reset();
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    // Pause when the tab is hidden; respect reduced-motion changes live
    document.addEventListener('visibilitychange', start);
    reduceMotion.addEventListener('change', start);
    start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
