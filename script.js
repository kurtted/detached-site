window.addEventListener('load', () => {
  if (window.scrollY > 0) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
  }
});

const html = document.documentElement;
let currentLang = 'ru';
let isAnimating = false;

const overlay = document.getElementById('langOverlay');

function setLang(lang) {
  if (isAnimating || lang === currentLang) return;
  isAnimating = true;

  overlay.classList.add('active');

  setTimeout(() => {
    currentLang = lang;
    html.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-ru]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val) el.innerHTML = val;
    });

    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
      const val = heroSub.getAttribute('data-' + lang);
      if (val) heroSub.innerHTML = val;
    }

    document.querySelectorAll('.about-text').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val) el.innerHTML = val;
    });

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'ru' ? 'EN' : 'RU';

    overlay.classList.remove('active');

    setTimeout(() => {
      isAnimating = false;
    }, 280);
  }, 260);
}

const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    setLang(currentLang === 'ru' ? 'en' : 'ru');
  });
}

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

let rafPending = false;
document.addEventListener('mousemove', (e) => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    if (glow1 && glow2) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      glow1.style.transform = `translate(${x * 25}px, ${y * 15}px)`;
      glow2.style.transform = `translate(${-x * 15}px, ${-y * 15}px)`;
    }
    rafPending = false;
  });
}, { passive: true });

console.log('%c[detached]', 'color:#FF1010;font-family:monospace;font-size:16px;font-weight:bold;', '\ndetached.site - software studio\ntg: @cashonelove');
