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
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('filter-hide');
        } else {
          card.classList.add('filter-hide');
        }
      });
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
     开场动画 — 矩阵雨 → 粒子汇聚 → 霓虹爆炸 → CRT纯文字
     ═══════════════════════════════════════════════════════ */
function initIntroAnimation() {
  const overlay = document.getElementById('intro-overlay');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const particleCanvas = document.getElementById('particle-canvas');
  const introName = document.getElementById('intro-name');
  const introRole = document.getElementById('intro-role');
  const crtContainer = document.getElementById('crt-container');
  const terminalOutput = document.getElementById('terminal-output');
  const heroReveal = document.getElementById('hero-reveal');

  // ── 移动端检测：UA + 屏幕宽度双保险 ──
  const uaMobile = /Android|iPhone|iPad|iPod|Mobile|Phone|Tablet/i.test(navigator.userAgent);
  const widthMobile = window.innerWidth < 768;
  const isMobile = uaMobile || widthMobile;

  if (isMobile) {
    // 移动端：直接隐藏 overlay，内容已在 CSS 中默认可见
    if (overlay) { overlay.style.display = 'none'; overlay.style.visibility = 'hidden'; }
    if (heroReveal) heroReveal.classList.add('show');
    // 清除可能残留的 canvas 动画
    if (matrixCanvas) { matrixCanvas.style.display = 'none'; }
    if (particleCanvas) { particleCanvas.style.display = 'none'; }
    return;
  }

  if (!overlay || !matrixCanvas) { showPage(); return; }

  // ── 桌面端：全局超时保护 12 秒 ──
  const forceEndTimer = setTimeout(() => {
    if (overlay) { overlay.style.transition = 'none'; overlay.style.display = 'none'; }
    if (heroReveal) heroReveal.classList.add('show');
    const termOut = document.getElementById('terminal-output');
    if (termOut && !termOut.children.length) showCRTPlainText();
  }, 8000);

  // ─── 第一阶段：矩阵雨 ───
  const mCtx = matrixCanvas.getContext('2d');
  let mW, mH;
  function resizeMatrix() {
    mW = matrixCanvas.width = window.innerWidth;
    mH = matrixCanvas.height = window.innerHeight;
  }
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);

  const matrixChars = 'アイウエオカキクケコ0123456789ABCDEF唐翊杰AI01010110';
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
      const alpha = 0.3 + Math.random() * 0.7;
      mCtx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      mCtx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > mH && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();

  // 2秒后停止矩阵雨，进入第二阶段
  setTimeout(() => {
    matrixRunning = false;
    let fadeFrames = 0;
    function fadeOutMatrix() {
      mCtx.fillStyle = `rgba(0, 0, 0, ${0.08 + fadeFrames * 0.08})`;
      mCtx.fillRect(0, 0, mW, mH);
      fadeFrames++;
      if (fadeFrames < 12) {
        requestAnimationFrame(fadeOutMatrix);
      } else {
        mCtx.fillStyle = 'rgba(0, 0, 0, 1)';
        mCtx.fillRect(0, 0, mW, mH);
        initParticleConverge();
      }
    }
    fadeOutMatrix();
  }, 2000);

  // ─── 第二阶段：粒子汇聚成名字 → 散开 → 汇聚成 CRT 边框（弹簧物理版）───
  function initParticleConverge() {
    if (!particleCanvas) { showNameDirectly(); return; }
    const pCtx = particleCanvas.getContext('2d');
    let pW, pH, cx, cy;
    function resizeP() {
      pW = particleCanvas.width = window.innerWidth;
      pH = particleCanvas.height = window.innerHeight;
      cx = pW / 2;
      cy = pH / 2;
    }
    resizeP();
    window.addEventListener('resize', resizeP);

    // 缓动函数
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easeOutBack = (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

    // 生成 CRT 边框目标点阵
    function genCRTFramePoints() {
      const pts = [];
      const cw = Math.min(750, pW * 0.78);
      const ch = Math.min(320, pH * 0.50);
      const cenX = cx;
      const cenY = cy - 20;
      const hw = cw / 2;
      const hh = ch / 2;
      const step = 5;
      for (let x = cenX - hw; x <= cenX + hw; x += step) { pts.push({ x, y: cenY - hh }); pts.push({ x, y: cenY + hh }); }
      for (let y = cenY - hh + step; y < cenY + hh; y += step) { pts.push({ x: cenX - hw, y }); pts.push({ x: cenX + hw, y }); }
      return pts;
    }

    // 阶段 — 精简：绽放 → 汇聚名字 → 短暂定格 → 直接变 CRT 边框
    const PHASE = { BLOOM: 0, CONVERGE_NAME: 1, HOLD_NAME: 2, CONVERGE_CRT: 3, HOLD_CRT: 4 };
    let phase = PHASE.BLOOM;
    let phaseTimer = 0;

    // ── 名字目标点阵 ──
    const nameTargets = [];
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 900;
    tmpCanvas.height = 200;
    tmpCtx.font = '900 140px "Space Grotesk", sans-serif';
    tmpCtx.textAlign = 'center';
    tmpCtx.textBaseline = 'middle';
    tmpCtx.fillStyle = '#fff';
    tmpCtx.fillText('唐翊杰', 450, 105);
    const imgData = tmpCtx.getImageData(0, 0, 900, 200);
    for (let y = 0; y < 200; y += 4) {
      for (let x = 0; x < 900; x += 4) {
        if (imgData.data[(y * 900 + x) * 4 + 3] > 128) {
          nameTargets.push({ x: (x - 450) * (pW / 900) + cx, y: (y - 100) * (pH / 500) + cy - 30 });
        }
      }
    }
    if (nameTargets.length < 50) {
      for (let i = 0; i < 300; i++) {
        const a = (i / 300) * Math.PI * 2;
        nameTargets.push({ x: Math.cos(a) * 120 + cx, y: Math.sin(a) * 120 + cy - 30 });
      }
    }

    // ── CRT 目标 ──
    const crtTargets = genCRTFramePoints();

    // ── 创建粒子（弹簧物理模型）──
    const particles = [];
    const PARTICLE_COUNT = Math.min(Math.max(nameTargets.length, crtTargets.length), 500);
    const STIFFNESS = 0.06;
    const DAMPING = 0.82;
    const WOBBLE_PERIOD = 200;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const nt = nameTargets[i % nameTargets.length];
      const jitter = (Math.random() - 0.5) * 8;
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        tx: nt.x + jitter,
        ty: nt.y + jitter,
        size: 1.2 + Math.random() * 2.2,
        hue: Math.random() > 0.5 ? 190 : 275,
        alpha: 0.55 + Math.random() * 0.45,
        seed: Math.random() * 100
      });
    }

    function assignTargets(targetArr, stiffness, damping) {
      particles.forEach((p, i) => {
        const t = targetArr[i % targetArr.length];
        p.tx = t.x + (Math.random() - 0.5) * 6;
        p.ty = t.y + (Math.random() - 0.5) * 6;
        p._k = stiffness || STIFFNESS;
        p._d = damping || DAMPING;
      });
    }

    function animateParticles() {
      pCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      pCtx.fillRect(0, 0, pW, pH);
      phaseTimer++;

      // ── 阶段切换（精简：名字 → CRT 直接过渡）──
      if (phase === PHASE.BLOOM && phaseTimer > 30) {
        phase = PHASE.CONVERGE_NAME; phaseTimer = 0;
        assignTargets(nameTargets, 0.06, 0.84);
      } else if (phase === PHASE.CONVERGE_NAME && phaseTimer > 75) {
        phase = PHASE.HOLD_NAME; phaseTimer = 0;
      } else if (phase === PHASE.HOLD_NAME && phaseTimer > 28) {
        // 直接从名字过渡到 CRT 边框
        phase = PHASE.CONVERGE_CRT; phaseTimer = 0;
        assignTargets(crtTargets, 0.05, 0.83);
        particles.forEach(p => { p.alpha = Math.min(1, p.alpha * 1.2); });
      } else if (phase === PHASE.CONVERGE_CRT && phaseTimer > 65) {
        phase = PHASE.HOLD_CRT; phaseTimer = 0;
        showCRTFrameReveal();
      }

      // ── 弹簧物理运动 ──
      particles.forEach(p => {
        const k = p._k || STIFFNESS;
        const d = p._d || DAMPING;
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;

        // 弹簧力 + 阻尼
        p.vx += dx * k;
        p.vy += dy * k;
        p.vx *= d;
        p.vy *= d;
        p.x += p.vx;
        p.y += p.vy;

        // 正弦微动（代替随机抖动，更自然）
        if (phase !== PHASE.BLOOM) {
          const wobble = Math.sin(phaseTimer * 0.18 + p.seed) * 0.8;
          const wobble2 = Math.cos(phaseTimer * 0.14 + p.seed + 1) * 0.6;
          pCtx.beginPath();
          pCtx.arc(p.x + wobble, p.y + wobble2, p.size, 0, Math.PI * 2);
        } else {
          pCtx.beginPath();
          pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }

        // 色相在 CRT 汇聚阶段渐变
        let hue = p.hue;
        if (phase === PHASE.CONVERGE_CRT) {
          hue = p.hue + (phaseTimer / 65) * 15;
        }
        pCtx.fillStyle = `hsla(${hue}, 100%, 70%, ${p.alpha})`;
        pCtx.fill();

        // 外层辉光
        pCtx.beginPath();
        const glowR = phase === PHASE.CONVERGE_CRT ? p.size * (4 + (phaseTimer / 65) * 3) : p.size * 3.5;
        pCtx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        pCtx.fillStyle = `hsla(${hue}, 100%, 70%, ${p.alpha * 0.07})`;
        pCtx.fill();
      });

      // HOLD_CRT 阶段消退
      if (phase === PHASE.HOLD_CRT && phaseTimer > 25) {
        pCtx.fillStyle = 'rgba(0,0,0,0.15)';
        pCtx.fillRect(0, 0, pW, pH);
        if (phaseTimer > 35) {
          particleCanvas.style.transition = 'opacity 0.4s';
          particleCanvas.style.opacity = '0';
          return;
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ─── CRT 边框浮现 ───
  function showCRTFrameReveal() {
    clearTimeout(forceEndTimer);
    const crtFrame = document.getElementById('crt-container');
    if (crtFrame) {
      crtFrame.style.opacity = '0';
      crtFrame.style.transition = 'opacity 0.6s ease';
      crtFrame.style.display = 'block';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          crtFrame.style.opacity = '1';
        });
      });
    }
    setTimeout(() => {
      showCRTPlainText();
      setTimeout(() => {
        overlay.classList.add('hidden');
        document.body.classList.add('page-entered');
        if (particleCanvas) {
          particleCanvas.style.opacity = '0';
          particleCanvas.style.display = 'none';
        }
      }, 500);
    }, 300);
  }

  // 备用：如果 canvas 不可用
  function showNameDirectly() {
    if (introName) {
      introName.classList.remove('intro-name-hidden');
      introName.classList.add('intro-name-visible');
    }
    setTimeout(() => {
      overlay.classList.add('hidden');
      setTimeout(() => showCRTPlainText(), 900);
    }, 1500);
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
    { type: 'status', text: '5+ AI 产品项目 · 3 段产品/数据实习 · 0→1 全流程落地',     delay: 700 },
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
      // 纯数字如 "5+" 提取 4
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
