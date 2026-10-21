(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Intro curtain -------------------------------------------------------- */
  var curtain = document.querySelector('._curtain_9jtnv_1');
  function runCurtain() {
    if (!curtain) return;
    if (reduce) { curtain.dataset.phase = '3'; return; }
    setTimeout(function () { curtain.dataset.phase = '1'; }, 80);
    setTimeout(function () { curtain.dataset.phase = '2'; }, 760);
    setTimeout(function () { curtain.dataset.phase = '3'; }, 1500);
  }
  runCurtain();

  /* Reveal on scroll ----------------------------------------------------- */
  var revealables = document.querySelectorAll('[data-reveal], [data-reveal-mask]');
  if (reduce) {
    revealables.forEach(function (el) {
      el.setAttribute(el.hasAttribute('data-reveal-mask') ? 'data-reveal-mask' : 'data-reveal', 'in');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.setAttribute(el.hasAttribute('data-reveal-mask') ? 'data-reveal-mask' : 'data-reveal', 'in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* Section theme + nav counter ------------------------------------------ */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var labels = { intro: ['00', 'Introduction'], experience: ['01', 'Experience'], work: ['02', 'Selected work'], leadership: ['03', 'Leadership'], about: ['04', 'About'], contact: ['05', 'Contact'] };
  var nav = document.querySelector('._nav_1lqnj_1');
  var cNum = document.querySelector('[data-counter-num]');
  var cLabel = document.querySelector('[data-counter-label]');
  var current = '';

  function onScroll() {
    var mid = window.scrollY + window.innerHeight * 0.4;
    var active = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= mid) active = s; });
    if (nav) nav.classList.toggle('_visible_1lqnj_24', window.scrollY > 40);
    if (active && active.id !== current) {
      current = active.id;
      root.dataset.theme = active.dataset.theme === 'dark' ? 'dark' : 'light';
      var meta = labels[current];
      if (meta && cNum && cLabel) { cNum.textContent = meta[0]; cLabel.textContent = meta[1]; }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Index overlay -------------------------------------------------------- */
  var toggle = document.querySelector('[data-index-toggle]');
  var panel = document.getElementById('site-index');
  function setIndex(open) {
    if (!panel || !toggle) return;
    panel.dataset.open = String(open);
    panel.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Index';
    panel.querySelectorAll('a').forEach(function (a) { a.tabIndex = open ? 0 : -1; });
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) toggle.addEventListener('click', function () { setIndex(panel.dataset.open !== 'true'); });
  if (panel) panel.addEventListener('click', function (e) { if (e.target.closest('a')) setIndex(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setIndex(false); });

  /* Hero word rotator ---------------------------------------------------- */
  var rotator = document.querySelector('[data-rotator]');
  var words = ['building', 'testing', 'failing', 'rebuilding'];
  var wi = 0;
  function renderWord(first) {
    if (!rotator) return;
    var prev = words[(wi + words.length - 1) % words.length];
    rotator.innerHTML = '';
    if (!first && !reduce) {
      var out = document.createElement('span');
      out.className = 'serif _wordOut_fsv4p_122';
      out.setAttribute('aria-hidden', 'true');
      out.textContent = prev;
      rotator.appendChild(out);
    }
    var inEl = document.createElement('span');
    inEl.className = 'serif _wordIn_fsv4p_121';
    inEl.textContent = words[wi];
    rotator.appendChild(inEl);
  }
  renderWord(true);
  if (!reduce) setInterval(function () { wi = (wi + 1) % words.length; renderWord(false); }, 3200);

  /* Local clock ---------------------------------------------------------- */
  function tick() {
    var t = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' });
    document.querySelectorAll('[data-clock]').forEach(function (el) { el.textContent = t; });
  }
  tick();
  setInterval(tick, 20000);

  /* Parallax on work numerals and frames --------------------------------- */
  var parallax = Array.prototype.slice.call(document.querySelectorAll('._numeral_1klyx_56, ._inner_1klyx_40, ._screen_1klyx_215'));
  function parallaxFrame() {
    if (reduce) return;
    var vh = window.innerHeight;
    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      var depth = el.classList.contains('_numeral_1klyx_56') ? 60
        : el.classList.contains('_screen_1klyx_215') ? (20 + (parseInt(el.dataset.i || '0', 10) * 26))
        : 18;
      el.style.transform = 'translateY(' + (p * depth).toFixed(1) + 'px)';
    });
    requestAnimationFrame(parallaxFrame);
  }
  requestAnimationFrame(parallaxFrame);

  /* Custom cursor -------------------------------------------------------- */
  var cursor = document.querySelector('._cursor_1dj6s_1');
  if (cursor && window.matchMedia('(pointer: fine)').matches && !reduce) {
    var cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      cursor.dataset.visible = 'true';
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
      var ext = e.target.closest('[data-cursor="ext"]');
      cursor.dataset.mode = ext ? 'ext' : '';
    });
    document.addEventListener('mouseleave', function () { cursor.dataset.visible = 'false'; });
  } else {
    root.dataset.cursor = 'off';
  }

  /* Smooth anchor scrolling ---------------------------------------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
})();
