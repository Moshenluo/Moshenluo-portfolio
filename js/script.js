/* ========================================
   主脚本 / Main Script
   ======================================== */

// 粒子配置 / Particles Configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#6366f1', '#8b5cf6', '#06b6d4'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#6366f1',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// 暗黑模式切换 / Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 检查本地存储中的主题
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// 移动端导航 / Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
    
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// 平滑滚动 / Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滚动时导航栏效果 / Navbar Effect on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-lg)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.boxShadow = 'var(--shadow-md)';
        navbar.style.padding = '1rem 0';
    }
});

// 滚动动画 / Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // 技能条动画 / Skill bar animation
            if (entry.target.classList.contains('skill-bar-fill')) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
            }
            
            // 数字计数动画 / Number counter animation
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 2000);
            }
        }
    });
}, observerOptions);

// 观察所有卡片元素 / Observe all card elements
document.querySelectorAll('.skill-card, .project-card, .contact-card, .info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// 观察技能条 / Observe skill bars
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = '0';
    bar.style.transition = 'width 1s ease';
    observer.observe(bar);
});

// 观察统计数字 / Observe stats
document.querySelectorAll('.stat-number').forEach(stat => {
    observer.observe(stat);
});

// 数字计数动画 / Counter Animation
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 项目筛选 / Project Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有活动状态 / Remove all active states
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 打字机效果 / Typewriter Effect
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 复制邮箱到剪贴板 / Copy Email to Clipboard
function copyEmail() {
    const email = '72540564@cityu-dg.edu.cn';
    navigator.clipboard.writeText(email).then(() => {
        showToast('邮箱已复制到剪贴板！/ Email copied to clipboard!');
    }).catch(err => {
        console.error('复制失败 / Failed to copy:', err);
    });
}

// 显示提示消息 / Show Toast Message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 添加 CSS 动画 / Add CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .burger.toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .burger.toggle .line2 {
        opacity: 0;
    }
    
    .burger.toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .nav-links.active {
        right: 0;
    }
`;
document.head.appendChild(style);

// 页面加载完成后的动画 / Animations after page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Portfolio loaded successfully!');
    console.log('🎨 Theme:', localStorage.getItem('theme') || 'light');
    console.log('📊 Projects:', projectCards.length);
});

// 添加键盘快捷键 / Add Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // 按 'T' 切换主题 / Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        themeToggle.click();
    }
    
    // 按 'H' 回到顶部 / Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// 鼠标跟随效果（可选） / Mouse Follow Effect (Optional)
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});
