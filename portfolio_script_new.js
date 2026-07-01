/* ============================================================
   唐翊杰 | Portfolio Script v5
   开场动画(矩阵雨+粒子汇聚+爆炸) · CRT纯文字 · 鼠标光晕 · 项目筛选
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initIntroAnimation();
  initMouseGlow();
  initMobileNav();
  initSmoothScroll();
  initScrollSpy();
  initScrollReveal();
  initBackToTop();
  initProjectFilters();
  initHeroCountUp();
});

/* ============================================================
   鼠标光晕
   ============================================================ */
function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;

  let mouseX = -999, mouseY = -999;
  let targetX = -999, targetY = -999;
  let paused = false;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!paused) glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (!paused) glow.style.opacity = '1';
  });

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (paused) glow.style.opacity = '0';
  });

  function smoothFollow() {
    if (paused) { requestAnimationFrame(smoothFollow); return; }
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    requestAnimationFrame(smoothFollow);
  }

  smoothFollow();
}

/* ============================================================
   项目筛选 Tab
   ============================================================ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      // 先统一淡出
      projectCards.forEach(card => { card.style.opacity = '0'; card.style.transform = 'scale(0.95)'; });

      setTimeout(() => {
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('filter-hide');
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.classList.add('filter-hide');
          }
        });
      }, 200);
    });
  });
}

/* ============================================================
   移动端导航
   ============================================================ */
function initMobileNav() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.classList.remove('toggle');
    });
  });
}

/* ============================================================
   平滑滚动
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   滚动监听 — 导航高亮 + 导航栏效果 (RAF 节流)
   ============================================================ */
function initScrollSpy() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        let currentId = '';
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) currentId = section.id;
        });
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active');
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   滚动渐入动画 — 交错延时
   ============================================================ */
function initScrollReveal() {
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const idx = parseInt(el.dataset.revealIdx || '0');
        el.style.transitionDelay = (idx * 60) + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll('.skill-card, .project-card, .contact-card-v2, .hero-stat, .about-card');
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    el.dataset.revealIdx = i % 6;
    observer.observe(el);
  });
}

/* ============================================================
   返回顶部按钮 (RAF 节流)
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════
     开场动画 — 矩阵雨 → CRT 浮现 → 文字逐行淡入
     ═══════════════════════════════════════════════════════ */
function initIntroAnimation() {
  const overlay = document.getElementById('intro-overlay');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const heroReveal = document.getElementById('hero-reveal');

  const uaMobile = /Android|iPhone|iPad|iPod|Mobile|Phone|Tablet/i.test(navigator.userAgent);
  const widthMobile = window.innerWidth < 768;
  const isMobile = uaMobile || widthMobile;

  if (isMobile) {
    if (overlay) { overlay.style.display = 'none'; overlay.style.visibility = 'hidden'; }
    if (heroReveal) heroReveal.classList.add('show');
    if (matrixCanvas) matrixCanvas.style.display = 'none';
    return;
  }

  if (!overlay || !matrixCanvas) { showPage(); return; }

  const forceEndTimer = setTimeout(() => {
    if (overlay) { overlay.style.transition = 'none'; overlay.style.display = 'none'; }
    if (heroReveal) heroReveal.classList.add('show');
    showCRTPlainText();
  }, 6000);

  // ── 矩阵雨 ──
  const mCtx = matrixCanvas.getContext('2d');
  let mW, mH;
  function resizeMatrix() {
    mW = matrixCanvas.width = window.innerWidth;
    mH = matrixCanvas.height = window.innerHeight;
  }
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);

  const matrixChars = 'アイウエオカキクケコ0123456789ABCDEF';
  const fontSize = 15;
  let columns = Math.floor(mW / fontSize);
  let drops = Array(columns).fill(1);
  let matrixRunning = true;

  function drawMatrix() {
    if (!matrixRunning) return;
    mCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    mCtx.fillRect(0, 0, mW, mH);
    mCtx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      mCtx.fillStyle = `rgba(0, 240, 255, ${0.3 + Math.random() * 0.7})`;
      mCtx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > mH && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();

  // 2.5s 后矩阵雨淡出
  setTimeout(() => {
    matrixRunning = false;
    let fadeFrames = 0;
    function fadeOutMatrix() {
      mCtx.fillStyle = `rgba(0, 0, 0, ${0.06 + fadeFrames * 0.06})`;
      mCtx.fillRect(0, 0, mW, mH);
      fadeFrames++;
      if (fadeFrames < 14) {
        requestAnimationFrame(fadeOutMatrix);
      } else {
        // 全黑，然后 CRT 浮现
        mCtx.fillStyle = 'rgba(0, 0, 0, 1)';
        mCtx.fillRect(0, 0, mW, mH);
        revealCRT();
      }
    }
    fadeOutMatrix();
  }, 2500);

  // ── CRT 浮现 + 文字 → 隐藏 overlay ──
  function revealCRT() {
    clearTimeout(forceEndTimer);
    const crtFrame = document.getElementById('crt-container');
    if (crtFrame) {
      crtFrame.style.opacity = '0';
      crtFrame.style.transition = 'opacity 0.5s ease';
      crtFrame.style.display = 'block';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { crtFrame.style.opacity = '1'; });
      });
    }
    setTimeout(() => showCRTPlainText(), 400);
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.classList.add('page-entered');
    }, 1200);
  }

}

/* ═══════════════════════════════════════════════════════
     CRT 内部纯文字逐行淡入
     ═══════════════════════════════════════════════════════ */
function showCRTPlainText() {
  const terminal = document.getElementById('terminal-output');
  const reveal = document.getElementById('hero-reveal');
  if (!terminal) return;

  // 清空可能残留内容
  terminal.innerHTML = '';

  const lines = [
    { type: 'name',   text: '唐翊杰',                              delay: 0   },
    { type: 'role',   text: 'AI Native Product Builder｜数据科学硕士｜香港城市大学（东莞）', delay: 400 },
    { type: 'status', text: '6+ AI 产品项目 · 3 段产品/数据实习 · 0→1 全流程落地',     delay: 700 },
  ];

  let idx = 0;
  function showNext() {
    if (idx >= lines.length) {
      // 所有文字显示完毕，淡入 Hero 后续内容
      setTimeout(() => {
        if (reveal) reveal.classList.add('show');
      }, 400);
      return;
    }

    const line = lines[idx];
    const div = document.createElement('div');
    div.className = 'hero-line';

    if (line.type === 'name') {
      div.innerHTML = `<h1 class="hero-line-name">${line.text}</h1>`;
    } else if (line.type === 'role') {
      div.innerHTML = `<p class="hero-line-role">${line.text}</p>`;
    } else {
      // status：用 · 分隔
      const parts = line.text.split('·').map(s => s.trim()).filter(Boolean);
      const sep = '<span class="sep"> · </span>';
      div.innerHTML = `<p class="hero-line-status">${parts.join(sep)}</p>`;
    }

    terminal.appendChild(div);

    // 触发动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        div.classList.add('show');
      });
    });

    idx++;
    setTimeout(showNext, line.delay);
  }

  showNext();
}

/* ═══════════════════════════════════════════════════════
     备用：直接显示页面（无动画）
     ═══════════════════════════════════════════════════════ */
function showPage() {
  const overlay = document.getElementById('intro-overlay');
  if (overlay) overlay.style.display = 'none';
  const reveal = document.getElementById('hero-reveal');
  if (reveal) reveal.classList.add('show');
}

/* ═══════════════════════════════════════════════════════
     Hero 数据面板数字滚动动画
     ═══════════════════════════════════════════════════════ */
function initHeroCountUp() {
  const stats = document.querySelectorAll('.hero-stat .number');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent;
      // 纯数字如 "6+" 提取 4
      const numMatch = raw.match(/[\d.]+/);
      if (!numMatch) return;
      const target = parseFloat(numMatch[0]);
      const suffix = raw.replace(numMatch[0], '');
      const duration = 1200;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}
