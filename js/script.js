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
  }, 12000);

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

  // ─── 第二阶段：粒子汇聚成名字 → 散开 → 汇聚成 CRT 边框 ───
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

    // 生成 CRT 边框目标点阵（矩形边框）
    function genCRTFramePoints() {
      const pts = [];
      const cw = Math.min(750, pW * 0.78);   // CRT 宽度
      const ch = Math.min(320, pH * 0.50);    // CRT 高度
      const cx = pW / 2;                       // 中心 X
      const cy = pH / 2 - 20;                  // 中心 Y（略偏上）
      const hw = cw / 2;
      const hh = ch / 2;
      const step = 6;                           // 采样间隔
      // 上边
      for (let x = cx - hw; x <= cx + hw; x += step) pts.push({ x, y: cy - hh });
      // 下边
      for (let x = cx - hw; x <= cx + hw; x += step) pts.push({ x, y: cy + hh });
      // 左边
      for (let y = cy - hh + step; y < cy + hh; y += step) pts.push({ x: cx - hw, y });
      // 右边
      for (let y = cy - hh + step; y < cy + hh; y += step) pts.push({ x: cx + hw, y });
      // 四个圆角（简化：角部像素）
      const cr = 16; // 圆角半径
      const corners = [
        { sx: cx - hw + cr, sy: cy - hh + cr },
        { sx: cx + hw - cr, sy: cy - hh + cr },
        { sx: cx - hw + cr, sy: cy + hh - cr },
        { sx: cx + hw - cr, sy: cy + hh - cr }
      ];
      corners.forEach(({ sx, sy }) => {
        // 在圆角区域采样
        for (let dy = -cr; dy <= cr; dy += step) {
          for (let dx = -cr; dx <= cr; dx += step) {
            if (dx * dx + dy * dy <= cr * cr) {
              pts.push({ x: sx + dx, y: sy + dy });
            }
          }
        }
      });
      return pts;
    }

    // 阶段枚举
    const PHASE = { CONVERGE_NAME: 0, HOLD_NAME: 1, SCATTER: 2, CONVERGE_CRT: 3, HOLD_CRT: 4 };
    let phase = PHASE.CONVERGE_NAME;
    let phaseTimer = 0;

    // ── 生成名字目标点阵 ──
    const nameTargets = [];
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
          nameTargets.push({
            x: (x - 450) * (pW / 900) + pW / 2,
            y: (y - 100) * (pH / 500) + pH / 2
          });
        }
      }
    }

    // 如果点太少，用圆形备用
    if (nameTargets.length < 50) {
      for (let i = 0; i < 300; i++) {
        const angle = (i / 300) * Math.PI * 2;
        const r = 120;
        nameTargets.push({
          x: Math.cos(angle) * r + pW / 2,
          y: Math.sin(angle) * r + pH / 2 - 30
        });
      }
    }

    // ── 生成 CRT 边框目标点阵 ──
    const crtTargets = genCRTFramePoints();

    // ── 创建粒子 ──
    const particles = [];
    const PARTICLE_COUNT = Math.min(Math.max(nameTargets.length, crtTargets.length), 500);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * pW,
        y: Math.random() * pH,
        // 初始目标：名字形状
        tx: nameTargets[i % nameTargets.length].x + (Math.random() - 0.5) * 30,
        ty: nameTargets[i % nameTargets.length].y + (Math.random() - 0.5) * 30,
        size: 1.5 + Math.random() * 2,
        hue: Math.random() > 0.5 ? 190 : 275,
        alpha: 0.6 + Math.random() * 0.4,
        speed: 0.02 + Math.random() * 0.03
      });
    }

    function assignTargets(targetArr) {
      particles.forEach((p, i) => {
        const t = targetArr[i % targetArr.length];
        p.tx = t.x + (Math.random() - 0.5) * 12;
        p.ty = t.y + (Math.random() - 0.5) * 12;
        p.speed = 0.03 + Math.random() * 0.04;
      });
    }

    function animateParticles() {
      pCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      pCtx.fillRect(0, 0, pW, pH);
      phaseTimer++;

      // ── 阶段切换逻辑 ──
      const HOLD_DURATION = 40;      // 名字保持帧数
      const SCATTER_DURATION = 30;   // 散开帧数
      const CRT_HOLD_DURATION = 50;  // CRT 保持帧数

      if (phase === PHASE.CONVERGE_NAME && phaseTimer > 90) {
        // 名字汇聚完成 → 保持一下
        phase = PHASE.HOLD_NAME;
        phaseTimer = 0;
      } else if (phase === PHASE.HOLD_NAME && phaseTimer > HOLD_DURATION) {
        // 保持结束 → 散开
        phase = PHASE.SCATTER;
        phaseTimer = 0;
        // 散开目标：随机远点
        particles.forEach(p => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 200 + Math.random() * 400;
          p.tx = p.x + Math.cos(angle) * dist;
          p.ty = p.y + Math.sin(angle) * dist;
          p.speed = 0.06 + Math.random() * 0.06;
          p.alpha *= 0.6;
        });
      } else if (phase === PHASE.SCATTER && phaseTimer > SCATTER_DURATION) {
        // 散开完成 → 汇聚成 CRT 边框
        phase = PHASE.CONVERGE_CRT;
        phaseTimer = 0;
        assignTargets(crtTargets);
        particles.forEach(p => { p.alpha = 0.6 + Math.random() * 0.4; });
      } else if (phase === PHASE.CONVERGE_CRT && phaseTimer > 80) {
        // CRT 边框汇聚完成 → 保持并显示真实 CRT
        phase = PHASE.HOLD_CRT;
        phaseTimer = 0;
        // 显示 CRT 实体
        showCRTFrameReveal();
      }

      // ── 粒子运动 ──
      particles.forEach(p => {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.x += dx * p.speed;
        p.y += dy * p.speed;

        // 接近目标时微抖动
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8 && phase !== PHASE.SCATTER) {
          p.x += (Math.random() - 0.5) * 1.5;
          p.y += (Math.random() - 0.5) * 1.5;
        }

        const progress = Math.min(phaseTimer / 60, 1);
        const glow = phase === PHASE.CONVERGE_CRT ? 1 + progress * 0.5 : 1;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2);
        pCtx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        pCtx.fill();

        // 霓虹发光
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        pCtx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha * 0.08 * glow})`;
        pCtx.fill();
      });

      // 到达 HOLD_CRT 阶段后继续渲染几帧再停止
      if (phase === PHASE.HOLD_CRT && phaseTimer > CRT_HOLD_DURATION) {
        // 粒子消退
        pCtx.fillStyle = 'rgba(0,0,0,0.15)';
        pCtx.fillRect(0, 0, pW, pH);
        if (phaseTimer > CRT_HOLD_DURATION + 20) {
          particleCanvas.style.transition = 'opacity 0.6s';
          particleCanvas.style.opacity = '0';
          return; // 停止粒子循环
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ─── CRT 边框浮现 ───
  function showCRTFrameReveal() {
    clearTimeout(forceEndTimer); // 动画正常完成，取消超时保护
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
    // CRT 实体出现后启动文字
    setTimeout(() => {
      showCRTPlainText();
      // 粒子消退后隐藏覆盖层
      setTimeout(() => {
        overlay.classList.add('hidden');
        // 清理 particle canvas
        if (particleCanvas) {
          particleCanvas.style.opacity = '0';
          particleCanvas.style.display = 'none';
        }
      }, 800);
    }, 400);
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
