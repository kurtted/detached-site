/**
 * detached — Bio Card Scripts
 * Features:
 * 1. High-Performance Canvas Starfield (Twinkling Stars + Meteor Shower / Starfall)
 * 2. 3D Card Tilt & Glare Physics
 * 3. Live UTC+3 Real-Time Clock
 * 4. Interactive Copy-to-Clipboard with Glass Toast
 * 5. Web Audio API Ambient Cosmic Soundscape
 * 6. Smooth Mouse Spotlight Glow
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initTiltEffect();
  initLiveClock();
  initLanguageSwitcher();
  initCopyAction();
  initAudioSynthesizer();
  initCursorGlow();
  initProtection();
});

/* ==========================================================================
   1. Canvas Starfield & Starfall (Shooting Stars) Engine
   ========================================================================== */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Star parameters
  const starCount = 220;
  const stars = [];
  const shootingStars = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Create slowly twinkling stars
  function createStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.4,
        baseAlpha: Math.random() * 0.65 + 0.25,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
        // subtle variation in color: pure white or soft warm crimson tint
        color: Math.random() > 0.85 ? '#ffb3b3' : '#ffffff'
      });
    }
  }

  // Shooting star class
  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      // Spawn mostly from top and left
      this.x = Math.random() * (width * 0.9);
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 90 + 50;
      this.speed = Math.random() * 9 + 7;
      this.angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees diagonal
      this.dx = Math.cos(this.angle) * this.speed;
      this.dy = Math.sin(this.angle) * this.speed;
      this.radius = Math.random() * 1.4 + 0.8;
      this.opacity = 1;
      this.fade = Math.random() * 0.018 + 0.012;
      this.active = true;
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.opacity -= this.fade;
      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }

    draw(context) {
      if (!this.active || this.opacity <= 0) return;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = context.createLinearGradient(this.x, this.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      grad.addColorStop(0.2, `rgba(255, 64, 64, ${this.opacity * 0.9})`);
      grad.addColorStop(0.7, `rgba(255, 64, 64, ${this.opacity * 0.3})`);
      grad.addColorStop(1, `rgba(255, 64, 64, 0)`);

      context.save();
      context.strokeStyle = grad;
      context.lineWidth = this.radius;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(tailX, tailY);
      context.stroke();

      // Glowing head
      context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      context.shadowColor = '#FF4040';
      context.shadowBlur = 10;
      context.beginPath();
      context.arc(this.x, this.y, this.radius * 1.1, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  // Spawn timer for shooting stars
  let lastShootingStarTime = 0;
  let nextShootingStarDelay = 2000;

  function handleShootingStars(currentTime) {
    if (currentTime - lastShootingStarTime > nextShootingStarDelay) {
      // Spawn 1 or occasionally 2 shooting stars
      shootingStars.push(new ShootingStar());
      if (Math.random() > 0.7) {
        setTimeout(() => shootingStars.push(new ShootingStar()), 250);
      }
      lastShootingStarTime = currentTime;
      // Random delay between 2.2s and 4.8s
      nextShootingStarDelay = Math.random() * 2600 + 2200;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      star.update();
      star.draw(ctx);
      if (!star.active) {
        shootingStars.splice(i, 1);
      }
    }
  }

  // Main animation render loop
  function animate(currentTime) {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw and twinkle static stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.phase += star.twinkleSpeed;
      const alpha = star.baseAlpha + Math.sin(star.phase) * (star.baseAlpha * 0.7);
      const safeAlpha = Math.max(0.08, Math.min(1, alpha));

      ctx.fillStyle = star.color;
      ctx.globalAlpha = safeAlpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 2. Draw shooting stars
    handleShootingStars(currentTime);

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });

  resize();
  createStars();
  requestAnimationFrame(animate);
}

/* ==========================================================================
   2. Card Interaction & Subtle Glare Physics (Stable & Readable)
   ========================================================================== */
function initTiltEffect() {
  const card = document.getElementById('bioCard');
  const glare = document.getElementById('cardGlare');
  if (!card) return;

  // Keep card completely flat and stable so text is perfectly readable
  card.style.transform = 'none';

  function onMouseMove(e) {
    const rect = card.getBoundingClientRect();
    const cardX = e.clientX - rect.left;
    const cardY = e.clientY - rect.top;

    // Check if mouse is over card
    if (
      cardX >= 0 &&
      cardX <= rect.width &&
      cardY >= 0 &&
      cardY <= rect.height
    ) {
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle 380px at ${cardX}px ${cardY}px, rgba(255, 255, 255, 0.08), transparent 70%)`;
      }
    } else {
      if (glare) glare.style.opacity = '0';
    }
  }

  window.addEventListener('mousemove', onMouseMove);
}

/* ==========================================================================
   3. Real-Time UTC+3 Live Clock
   ========================================================================== */
function initLiveClock() {
  const clockElement = document.getElementById('liveClock');
  if (!clockElement) return;

  function updateTime() {
    const now = new Date();
    // Calculate UTC + 3 hours
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();

    const targetHours = (utcHours + 3) % 24;

    const pad = (num) => String(num).padStart(2, '0');
    clockElement.textContent = `${pad(targetHours)}:${pad(utcMinutes)}:${pad(utcSeconds)}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   4. Internationalization (i18n) & Smooth Language Switcher
   ========================================================================== */
let currentLang = 'en';
let isAudioPlaying = false;
let isLangTransitioning = false;

const i18nData = {
  en: {
    langBtn: 'RU',
    audioBtnOff: 'Audio',
    audioBtnOn: 'Mute',
    role: 'Software & Bot Developer',
    bio: 'Who is it?',
    locationLabel: 'Location',
    locationValue: 'Russia',
    tzLabel: 'Timezone',
    languagesLabel: 'Languages',
    languagesValue: 'Russian, English',
    skillsTitle: 'Programming & Technologies',
    javaTag: 'MC-Plugins',
    javaDesc: 'Minecraft plugins, Paper/Spigot APIs, datapacks, and other technical mechanics.',
    pythonTag: 'Apps & Bots',
    pythonDesc: 'Bots for Telegram, Discord & VK, automation pipelines & backend.',
    csharpTag: '.NET Framework',
    csharpDesc: 'Robust desktop applications, system utilities, multithreaded tools & native Windows integration.',
    reactTag: 'Frontend & UI',
    reactDesc: 'Dynamic web applications, interactive dashboards, modern interfaces & smooth UX.',
    projectsTitle: 'Projects & Work',
    statusDone: 'Done',
    statusInDev: 'In Development',
    statusPlanned: 'Planned',
    statusArchived: 'Archived',
    proj1Date: '2024',
    proj1Desc: 'Multi-platform bot system for Telegram, Discord & VK featuring automated moderation, custom command handler, database sync & analytics dashboard.',
    proj2Date: '2023 - 2024',
    proj2Desc: 'High-performance Minecraft Paper/Spigot core plugin with customized economy mechanics, low-level packet routing, anti-dupe safeguards & staff utility tools.',
    proj3Date: 'Planned',
    proj3Desc: 'Lightweight Windows utility for real-time system monitoring, batch file optimization, scheduled process management & developer hotkeys.',
    proj4Date: '2022',
    proj4Desc: 'Legacy tournament & minigame manager for Spigot servers with arena rollback mechanics, custom scoreboard system & player matchmaking.',
    discordCopyHint: 'Copy',
    discordCopiedHint: 'Copied!',
    toastTitle: 'Copied to Clipboard!',
    toastCopiedDesc: '"{text}" copied to clipboard!'
  },
  ru: {
    langBtn: 'EN',
    audioBtnOff: 'Звук',
    audioBtnOn: 'Выкл',
    role: 'Разработчик ПО и Ботов',
    bio: 'Кто это?',
    locationLabel: 'Локация',
    locationValue: 'Россия',
    tzLabel: 'Часовой пояс',
    languagesLabel: 'Языки',
    languagesValue: 'Русский, Английский',
    skillsTitle: 'Программирование и Технологии',
    javaTag: 'MC-Плагины',
    javaDesc: 'Плагины для Minecraft, API Paper/Spigot, датапаки и прочая техническая часть.',
    pythonTag: 'Приложения и Боты',
    pythonDesc: 'Боты для Telegram, Discord и VK, автоматизация и бэкенд.',
    csharpTag: '.NET Framework',
    csharpDesc: 'Надёжные десктопные приложения, системные утилиты, многопоточные инструменты и интеграция с Windows.',
    reactTag: 'Фронтенд и UI',
    reactDesc: 'Динамические веб-приложения, интерактивные дэшборды, интерфейсы и плавный UX.',
    projectsTitle: 'Проекты и Разработки',
    statusDone: 'Завершён',
    statusInDev: 'В разработке',
    statusPlanned: 'Запланирован',
    statusArchived: 'В архиве',
    proj1Date: '2024',
    proj1Desc: 'Мультиплатформенная бот-система для Telegram, Discord и VK: авто-модерация, кастомный обработчик команд, синхронизация с БД и панель аналитики.',
    proj2Date: '2023 - 2024',
    proj2Desc: 'Высокопроизводительное ядро-плагин для Paper/Spigot: кастомная экономика, низкоуровневая маршрутизация пакетов, защита от дюпов и инструментарий персонала.',
    proj3Date: 'В планах',
    proj3Desc: 'Быстрая Windows-утилита для мониторинга системы в реальном времени, пакетной оптимизации файлов, управления процессами и горячих клавиш.',
    proj4Date: '2022',
    proj4Desc: 'Турнирный и мини-игровой менеджер для Spigot-серверов: откат арен, кастомный скорборд и подбор игроков (проект переведён в архив).',
    discordCopyHint: 'Копия',
    discordCopiedHint: 'Скопировано!',
    toastTitle: 'Скопировано в буфер!',
    toastCopiedDesc: '"{text}" скопирован в буфер обмена!'
  }
};

function applyLanguage(lang) {
  currentLang = lang;
  try {
    localStorage.setItem('detached_lang', lang);
  } catch (e) {}

  document.documentElement.lang = lang;
  const texts = i18nData[lang];
  if (!texts) return;

  // Update language button label
  const langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = texts.langBtn;

  // Update all elements with data-i18n and sync data-text for glitch effects
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) {
      el.textContent = texts[key];
      if (el.hasAttribute('data-text') || el.classList.contains('glitch-text')) {
        el.setAttribute('data-text', texts[key]);
      }
    }
  });

  // Render dynamic projects
  renderProjects(lang);

  // Sync sound button text
  const soundLabel = document.getElementById('soundLabel');
  if (soundLabel) {
    soundLabel.textContent = isAudioPlaying ? texts.audioBtnOn : texts.audioBtnOff;
  }
}

/* ==========================================================================
   4.5 Dynamic Projects Renderer (from projects.js)
   ========================================================================== */
function renderProjects(lang) {
  const container = document.getElementById('projectsList');
  if (!container) return;

  const projects = (typeof PROJECTS_CONFIG !== 'undefined' && Array.isArray(PROJECTS_CONFIG))
    ? PROJECTS_CONFIG
    : [];

  const texts = i18nData[lang] || i18nData.en;

  const statusMap = {
    'done': { cls: 'status-done', label: texts.statusDone },
    'in-dev': { cls: 'status-in-dev', label: texts.statusInDev },
    'planned': { cls: 'status-planned', label: texts.statusPlanned },
    'archived': { cls: 'status-archived', label: texts.statusArchived }
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  container.innerHTML = projects.map((proj) => {
    const statusInfo = statusMap[proj.status] || { cls: 'status-planned', label: texts.statusPlanned };
    
    // Date can be object { en, ru } or string
    let dateStr = '';
    if (proj.date) {
      if (typeof proj.date === 'object') {
        dateStr = proj.date[lang] || proj.date.en || '';
      } else {
        dateStr = proj.date;
      }
    }

    // Description can be object { en, ru } or string
    let descStr = '';
    if (proj.description) {
      if (typeof proj.description === 'object') {
        descStr = proj.description[lang] || proj.description.en || '';
      } else {
        descStr = proj.description;
      }
    }

    // Tags
    const tagsHtml = (Array.isArray(proj.tags) ? proj.tags : [])
      .map(tag => `<span class="proj-tag">${escapeHtml(tag)}</span>`)
      .join('');

    // Optional link
    const linkHtml = (proj.link && proj.link.trim())
      ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Project" aria-label="View Project">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
             <polyline points="15 3 21 3 21 9"></polyline>
             <line x1="10" y1="14" x2="21" y2="3"></line>
           </svg>
         </a>`
      : '';

    return `
      <div class="project-card">
        <div class="project-header">
          <div class="project-title-group">
            <h3 class="project-name">${escapeHtml(proj.name)}</h3>
            ${dateStr ? `<span class="project-date">${escapeHtml(dateStr)}</span>` : ''}
          </div>
          <div class="project-header-actions">
            <span class="status-badge ${statusInfo.cls}">${escapeHtml(statusInfo.label)}</span>
            ${linkHtml}
          </div>
        </div>
        ${descStr ? `<p class="project-desc">${escapeHtml(descStr)}</p>` : ''}
        ${tagsHtml ? `<div class="project-tags">${tagsHtml}</div>` : ''}
      </div>
    `;
  }).join('');
}

function switchLanguageSmooth(newLang) {
  if (isLangTransitioning) return;
  isLangTransitioning = true;

  const translatableElements = document.querySelectorAll('[data-i18n], #soundLabel, #langLabel, .project-card');

  // 1. Smooth fade out
  translatableElements.forEach((el) => el.classList.add('lang-fading'));

  setTimeout(() => {
    // 2. Update texts while faded
    applyLanguage(newLang);

    // 3. Smooth fade back in
    setTimeout(() => {
      const allFading = document.querySelectorAll('.lang-fading');
      allFading.forEach((el) => el.classList.remove('lang-fading'));
      isLangTransitioning = false;
    }, 40);
  }, 200);
}

function initLanguageSwitcher() {
  const toggleBtn = document.getElementById('langToggle');
  
  // Retrieve saved preference or default to 'en'
  let savedLang = 'en';
  try {
    savedLang = localStorage.getItem('detached_lang') || 'en';
  } catch (e) {}

  applyLanguage(savedLang);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    switchLanguageSmooth(newLang);

    // Subtle button click feedback
    toggleBtn.style.transform = 'scale(0.92)';
    setTimeout(() => {
      toggleBtn.style.transform = '';
    }, 150);
  });
}

/* ==========================================================================
   5. Copy to Clipboard with Glass Toast Notification
   ========================================================================== */
function initCopyAction() {
  const copyBtn = document.getElementById('discordCopyBtn');
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const discordHint = document.getElementById('discordHint');

  let toastTimer = null;

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const textToCopy = copyBtn.getAttribute('data-copy') || 'deetached';
    const texts = i18nData[currentLang] || i18nData.en;

    try {
      isProgrammaticCopy = true;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-https or older contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setTimeout(() => { isProgrammaticCopy = false; }, 100);

      // UI Feedback on button
      if (discordHint) {
        discordHint.textContent = texts.discordCopiedHint;
        discordHint.style.background = '#FF4040';
        discordHint.style.color = '#FFFFFF';
        setTimeout(() => {
          discordHint.textContent = texts.discordCopyHint;
          discordHint.style.background = '';
          discordHint.style.color = '';
        }, 2200);
      }

      // Show toast
      if (toast && toastMsg) {
        toastMsg.textContent = texts.toastCopiedDesc.replace('{text}', textToCopy);
        toast.classList.add('active');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('active');
        }, 2800);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      isProgrammaticCopy = false;
    }
  });
}

/* ==========================================================================
   5.5 Site Protection (Disable text selection, copy, drag & image saving)
   ========================================================================== */
let isProgrammaticCopy = false;

function initProtection() {
  // Prevent text selection
  document.addEventListener('selectstart', (e) => e.preventDefault());

  // Prevent right-click context menu (Save image as, Inspect, Copy)
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Prevent dragging images or text
  document.addEventListener('dragstart', (e) => e.preventDefault());

  // Prevent copy keyboard shortcut or browser copy action unless triggered programmatically
  document.addEventListener('copy', (e) => {
    if (!isProgrammaticCopy) {
      e.preventDefault();
      return false;
    }
  });

  // Block Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && ['c', 'C', 'u', 'U', 's', 'S', 'a', 'A'].includes(e.key)) {
      if (!isProgrammaticCopy) {
        e.preventDefault();
        return false;
      }
    }
  });
}

/* ==========================================================================
   6. Interactive Cosmic Ambient Audio (Web Audio API)
   Zero external assets, generates an ethereal space drone synth on demand!
   ========================================================================== */
function initAudioSynthesizer() {
  const toggleBtn = document.getElementById('soundToggle');
  if (!toggleBtn) return;

  const soundOffIcon = toggleBtn.querySelector('.sound-off-icon');
  const soundOnIcon = toggleBtn.querySelector('.sound-on-icon');
  const soundLabel = toggleBtn.querySelector('.sound-label');

  let audioCtx = null;
  let masterGain = null;
  let oscillators = [];

  function createAmbientDrone() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    // Warm Low-Pass Filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, audioCtx.currentTime);
    filter.Q.setValueAtTime(4, audioCtx.currentTime);

    // Cosmic chord frequencies: D minor / ambient space drone (D2, A2, D3, F3, A3)
    const freqs = [73.42, 110.0, 146.83, 174.61, 220.0];

    freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), audioCtx.currentTime);

      // Subtle slow detune modulation
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.08 + i * 0.03, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      lfo.connect(osc.detune);
      lfo.start();

      oscGain.gain.setValueAtTime(0.04 / freqs.length, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      oscillators.push(osc);
    });

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Fade in
    masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 3);
  }

  function stopAmbientDrone() {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        oscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        oscillators = [];
        if (audioCtx.state !== 'closed') {
          audioCtx.close();
        }
      }, 1300);
    }
  }

  toggleBtn.addEventListener('click', () => {
    const texts = i18nData[currentLang] || i18nData.en;

    if (!isAudioPlaying) {
      createAmbientDrone();
      isAudioPlaying = true;
      soundOffIcon.style.display = 'none';
      soundOnIcon.style.display = 'block';
      if (soundLabel) soundLabel.textContent = texts.audioBtnOn;
      toggleBtn.style.borderColor = 'var(--primary)';
      toggleBtn.style.boxShadow = '0 0 15px var(--primary-soft)';
    } else {
      stopAmbientDrone();
      isAudioPlaying = false;
      soundOffIcon.style.display = 'block';
      soundOnIcon.style.display = 'none';
      if (soundLabel) soundLabel.textContent = texts.audioBtnOff;
      toggleBtn.style.borderColor = '';
      toggleBtn.style.boxShadow = '';
    }
  });
}

/* ==========================================================================
   6. Mouse Spotlight Follower
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      glow.style.opacity = '1';
      isVisible = true;
    }
  });

  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    isVisible = false;
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;

    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}
