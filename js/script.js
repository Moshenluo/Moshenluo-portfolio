/* ============================================================
   唐翊杰 | Portfolio Script v5
   开场动画(矩阵雨+粒子汇聚+爆炸) · CRT纯文字 · 鼠标光晕 · 项目筛选
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initIntroAnimation();   // 开场动画（含矩阵雨 + 粒子 + 爆炸）
  initMouseGlow();
  initMobileNav();
  initSmoothScroll();
  initScrollSpy();
  initScrollReveal();
  initBackToTop();
  initProjectFilters();
});

/* ============================================================
   粒子背景 — 赛博数据流
   ============================================================ */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = (Math.random() - 0.5) * 0.008;
      this.hue = Math.random() > 0.5 ? 190 : 275;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeSpeed;
      if (this.opacity <= 0.05 || this.opacity >= 0.6) this.fadeSpeed *= -1;
      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
      if (this.y < -10) this.y = h + 10;
      if (this.y > h + 10) this.y = -10;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity * 0.15})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(ctx); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   Hero 纯文字逐行淡入
   ============================================================ */
function initTerminalTyping() {
  const terminal = document.getElementById('terminal-output');
  const reveal = document.getElementById('hero-reveal');
  if (!terminal || !reveal) return;

  const lines = [
    { html: '<h1 class="hero-name">唐翊杰</h1>', delay: 300 },
    { html: '<p class="hero-role">AI Native Product Builder &nbsp;|&nbsp; 数据科学硕士 &nbsp;|&nbsp; 香港城市大学（东莞）</p>', delay: 400 },
    { html: '<p class="hero-status">4+ AI 产品项目 &nbsp;&middot;&nbsp; 3 段产品/数据实习 &nbsp;&middot;&nbsp; 0 → 1 全流程落地</p>', delay: 400 },
  ];

  let idx = 0;

  function showLine() {
    if (idx >= lines.length) {
      reveal.classList.add('show');
      return;
    }
    const div = document.createElement('div');
    div.className = 'hero-line';
    div.style.opacity = '0';
    div.style.transform = 'translateY(12px)';
    div.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    div.innerHTML = lines[idx].html;
    terminal.appendChild(div);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
      });
    });

    idx++;
    setTimeout(showLine, lines[idx - 1].delay);
  }

  setTimeout(showLine, 400);
}

/* ============================================================
   鼠标光晕
   ============================================================ */
function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;

  let mouseX = -999, mouseY = -999;
  let targetX = -999, targetY = -999;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  // Smooth follow with requestAnimationFrame
  function smoothFollow() {
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
   滚动监听 — 导航高亮 + 导航栏效果
   ============================================================ */
function initScrollSpy() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
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
  });
}

/* ============================================================
   滚动渐入动画
   ============================================================ */
function initScrollReveal() {
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-card, .project-card, .contact-card, .info-item, .hero-stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
}

/* ============================================================
   返回顶部按钮
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   故障文字效果 — 名字悬停触发（保留兼容）
   ============================================================ */
function initGlitchOnHover() {
  const nameEl = document.querySelector('.hero-text h1');
  if (!nameEl) return;
  const originalText = nameEl.textContent;
  let glitchTimer = null;

  nameEl.addEventListener('mouseenter', () => {
    let count = 0;
    glitchTimer = setInterval(() => {
      if (count >= 8) {
        clearInterval(glitchTimer);
        nameEl.textContent = originalText;
        return;
      }
      const chars = originalText.split('');
      const idx = Math.floor(Math.random() * chars.length);
      const glitchChars = '!@#$%^&*<>?/\\|{}[]';
      chars[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      nameEl.textContent = chars.join('');
      count++;
    }, 60);
  });

  nameEl.addEventListener('mouseleave', () => {
    if (glitchTimer) {
      clearInterval(glitchTimer);
      glitchTimer = null;
    }
    nameEl.textContent = originalText;
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

  if (!overlay || !matrixCanvas) { showPage(); return; }

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

  // 2.8秒后停止矩阵雨，进入第二阶段
  setTimeout(() => {
    matrixRunning = false;
    mCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    mCtx.fillRect(0, 0, mW, mH);
    initParticleConverge();
  }, 2800);

  // ─── 第二阶段：粒子汇聚成名字 ───
  function initParticleConverge() {
    if (!particleCanvas) { showNameDirectly(); return; }
    const pCtx = particleCanvas.getContext('2d');
    let pW, pH;
    function resizeP() {
      pW = particleCanvas.width = window.innerWidth;
      pH = particleCanvas.height = window.innerHeight;
    }
    resizeP();
    window.addEventListener('resize', resizeP);

    // 生成目标文字形状的点阵
    const targetPoints = [];
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 900;
    tmpCanvas.height = 200;
    tmpCtx.font = '900 110px "Space Grotesk", sans-serif';
    tmpCtx.textAlign = 'center';
    tmpCtx.textBaseline = 'middle';
    tmpCtx.fillStyle = '#fff';
    tmpCtx.fillText('唐翊杰', 450, 100);

    const imgData = tmpCtx.getImageData(0, 0, 900, 200);
    for (let y = 0; y < 200; y += 5) {
      for (let x = 0; x < 900; x += 5) {
        const idx = (y * 900 + x) * 4;
        if (imgData.data[idx + 3] > 128) {
          targetPoints.push({
            x: (x - 450) * (window.innerWidth / 900) + window.innerWidth / 2,
            y: (y - 100) * (window.innerHeight / 500) + window.innerHeight / 2
          });
        }
      }
    }

    // 如果点太少，用备用方案
    if (targetPoints.length < 50) {
      for (let i = 0; i < 300; i++) {
        const angle = (i / 300) * Math.PI * 2;
        const r = 120;
        targetPoints.push({
          x: Math.cos(angle) * r + window.innerWidth / 2,
          y: Math.sin(angle) * r + window.innerHeight / 2 - 30
        });
      }
    }

    // 创建粒子
    const particles = [];
    const PARTICLE_COUNT = Math.min(targetPoints.length, 500);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        tx: targetPoints[i % targetPoints.length].x + (Math.random() - 0.5) * 30,
        ty: targetPoints[i % targetPoints.length].y + (Math.random() - 0.5) * 30,
        size: 1.5 + Math.random() * 2,
        hue: Math.random() > 0.5 ? 190 : 275,
        alpha: 0.6 + Math.random() * 0.4,
        speed: 0.02 + Math.random() * 0.03
      });
    }

    let convergeProgress = 0;
    let explosionTriggered = false;

    function animateParticles() {
      pCtx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      pCtx.fillRect(0, 0, pW, pH);
      convergeProgress += 0.018;

      particles.forEach(p => {
        // 向目标点移动
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.x += dx * p.speed;
        p.y += dy * p.speed;

        // 在目标位置附近抖动
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          p.x += (Math.random() - 0.5) * 2;
          p.y += (Math.random() - 0.5) * 2;
        }

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size * (0.5 + convergeProgress * 0.5), 0, Math.PI * 2);
        pCtx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha * Math.min(convergeProgress * 2, 1)})`;
        pCtx.fill();

        // 霓虹发光
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        pCtx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha * 0.1 * Math.min(convergeProgress * 2, 1)})`;
        pCtx.fill();
      });

      // 汇聚完成后触发爆炸
      if (convergeProgress >= 1 && !explosionTriggered) {
        explosionTriggered = true;
        triggerExplosion(particles);
        setTimeout(() => {
          particleCanvas.style.transition = 'opacity 0.5s';
          particleCanvas.style.opacity = '0';
          showNameText();
        }, 800);
        return;
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ─── 第三阶段：霓虹爆炸 ───
  function triggerExplosion(particles) {
    particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2;
      const force = 3 + Math.random() * 8;
      p.tx = p.x + Math.cos(angle) * force * 80;
      p.ty = p.y + Math.sin(angle) * force * 80;
      p.speed = 0.08 + Math.random() * 0.12;
      p.alpha = 0;
    });
  }

  // ─── 显示名字文字 ───
  function showNameText() {
    if (introName) {
      introName.classList.remove('intro-name-hidden');
      introName.classList.add('intro-name-visible');
      introName.style.position = 'relative';
      introName.style.zIndex = '10';
      document.getElementById('intro-text-container').style.position = 'relative';
      document.getElementById('intro-text-container').style.zIndex = '10';
    }
    if (introRole) {
      setTimeout(() => {
        introRole.classList.remove('intro-role-hidden');
        introRole.classList.add('intro-role-visible');
      }, 400);
    }
    // 1.5秒后淡出覆盖层
    setTimeout(() => {
      overlay.classList.add('hidden');
      // 显示 CRT 纯文字
      setTimeout(() => {
        showCRTPlainText();
      }, 900);
    }, 2200);
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
    { type: 'role',   text: 'AI Native Product Builder｜数据科学硕士｜香港城市大学（东莞）', delay: 500 },
    { type: 'status', text: '4+ AI 产品项目 · 3 段产品/数据实习 · 0→1 全流程落地',     delay: 900 },
  ];

  let idx = 0;
  function showNext() {
    if (idx >= lines.length) {
      // 所有文字显示完毕，淡入 Hero 后续内容
      setTimeout(() => {
        if (reveal) reveal.classList.add('show');
      }, 600);
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
