/* ============================================================
   唐翊杰 | Portfolio Script v3
   终端打字 · 鼠标光晕 · 项目筛选 · 卡片展开 · 粒子背景
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMobileNav();
  initSmoothScroll();
  initScrollSpy();
  initScrollReveal();
  initBackToTop();
  initGlitchOnHover();
  initMouseGlow();
  initTerminalTyping();
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
