// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar shadow
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Back to top button
    backToTop.classList.toggle('visible', scrollY > 500);

    // Active nav link
    updateActiveNav();
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTER
// ============================================
function updateActiveNav() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// MOBILE NAVIGATION
// ============================================
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navHamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// BACK TO TOP
// ============================================
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// TYPING EFFECT
// ============================================
const typedElement = document.getElementById('typed');
const words = [
    'Structural Engineering',
    'Aerospace Engineering',
    'Structural Health Monitoring',
    'Composite Materials'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            if (step >= steps) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        }, duration / steps);
    });
}

// Run counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

heroObserver.observe(document.getElementById('hero'));

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function setupScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.about-grid, .timeline-item, ' +
        '.course-card, .project-card, .teaching-card, ' +
        '.contact-grid'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

setupScrollReveal();

// ============================================
// COURSE FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        courseCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ============================================
// TEACHING FILTER
// ============================================
const teachingFilterBtns = document.querySelectorAll('.teaching-filter .filter-btn');
const teachingCards = document.querySelectorAll('.teaching-card');

teachingFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        teachingFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        teachingCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ============================================
// STRUCTURAL ENGINEERING BACKGROUND
// ============================================
(function() {
    const canvas = document.getElementById('structuralBg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, scrollY = 0, mouseX = -1000, mouseY = -1000;
    const nodes = [];
    const beams = [];
    const loads = [];
    const NUM_NODES = 50;
    const MOUSE_RADIUS = 180;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    // Create truss nodes scattered across a tall virtual space
    function init() {
        resize();
        nodes.length = 0;
        beams.length = 0;
        loads.length = 0;

        const pageH = Math.max(document.body.scrollHeight, H * 5);

        for (let i = 0; i < NUM_NODES; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * pageH,
                baseX: 0, baseY: 0,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                radius: Math.random() * 3 + 2,
                pinned: Math.random() < 0.12,       // some nodes are supports
                displaced: 0                          // deformation amount
            });
            nodes[i].baseX = nodes[i].x;
            nodes[i].baseY = nodes[i].y;
        }

        // Connect nearby nodes as beams (truss members)
        const maxDist = 280;
        for (let i = 0; i < nodes.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].baseX - nodes[j].baseX;
                const dy = nodes[i].baseY - nodes[j].baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist && connections < 4) {
                    beams.push({ a: i, b: j, restLen: dist, stress: 0 });
                    connections++;
                }
            }
        }

        // Create floating load arrows
        for (let i = 0; i < 12; i++) {
            loads.push({
                x: Math.random() * W,
                y: Math.random() * pageH,
                angle: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
                length: Math.random() * 25 + 15,
                speed: (Math.random() - 0.5) * 0.3,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function drawTriangleSupport(x, y, size, color) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - size, y + size * 1.5);
        ctx.lineTo(x + size, y + size * 1.5);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Ground hatch lines
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * size * 0.6, y + size * 1.5);
            ctx.lineTo(x + i * size * 0.6 - 4, y + size * 1.8);
            ctx.stroke();
        }
    }

    function drawLoadArrow(x, y, angle, len, color) {
        const ex = x + Math.cos(angle) * len;
        const ey = y + Math.sin(angle) * len;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Arrow head
        const headLen = 6;
        const a1 = angle + Math.PI * 0.8;
        const a2 = angle - Math.PI * 0.8;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(a1) * headLen, ey + Math.sin(a1) * headLen);
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(a2) * headLen, ey + Math.sin(a2) * headLen);
        ctx.stroke();
    }

    // Draw subtle grid (structural analysis mesh feel)
    function drawGrid(offset) {
        const dark = isDark();
        const alpha = dark ? 0.04 : 0.06;
        ctx.strokeStyle = dark ? `rgba(129,140,248,${alpha})` : `rgba(59,130,246,${alpha})`;
        ctx.lineWidth = 0.5;

        const spacing = 60;
        const shift = (offset * 0.05) % spacing;

        for (let x = -spacing + shift; x < W + spacing; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = -spacing + shift; y < H + spacing; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
    }

    // Deformation wave based on scroll
    function getDeformation(node, time) {
        const scrollFactor = scrollY * 0.002;
        const wave = Math.sin(node.baseX * 0.005 + time * 0.8 + scrollFactor) * 8;
        const wave2 = Math.cos(node.baseY * 0.003 + time * 0.5) * 5;
        return { dx: wave * scrollFactor, dy: wave2 * scrollFactor };
    }

    let time = 0;
    function draw() {
        time += 0.016;
        ctx.clearRect(0, 0, W, H);
        const dark = isDark();

        // Background grid
        drawGrid(scrollY);

        const beamColor = dark ? 'rgba(129,140,248,0.12)' : 'rgba(59,130,246,0.12)';
        const beamStressColor = dark ? 'rgba(248,113,113,0.3)' : 'rgba(239,68,68,0.25)';
        const nodeColor = dark ? 'rgba(129,140,248,0.35)' : 'rgba(59,130,246,0.3)';
        const supportColor = dark ? 'rgba(167,139,250,0.4)' : 'rgba(37,99,235,0.3)';
        const loadColor = dark ? 'rgba(251,191,36,0.25)' : 'rgba(245,158,11,0.2)';

        // Compute screen positions
        const screenNodes = nodes.map((n, i) => {
            const def = getDeformation(n, time);
            let sx = n.x + def.dx + Math.sin(time * 0.3 + i) * 2;
            let sy = n.y - scrollY + def.dy;

            // Mouse repulsion
            const mdx = sx - mouseX;
            const mdy = sy - mouseY;
            const md = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < MOUSE_RADIUS && md > 0) {
                const force = (1 - md / MOUSE_RADIUS) * 30;
                sx += (mdx / md) * force;
                sy += (mdy / md) * force;
            }

            return { x: sx, y: sy, visible: sy > -50 && sy < H + 50 };
        });

        // Draw beams
        beams.forEach(beam => {
            const a = screenNodes[beam.a];
            const b = screenNodes[beam.b];
            if (!a.visible && !b.visible) return;

            // Calculate "stress" based on deformation
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const curLen = Math.sqrt(dx * dx + dy * dy);
            beam.stress = Math.abs(curLen - beam.restLen) / beam.restLen;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            if (beam.stress > 0.1) {
                ctx.strokeStyle = beamStressColor;
                ctx.lineWidth = 1.5;
            } else {
                ctx.strokeStyle = beamColor;
                ctx.lineWidth = 1;
            }
            ctx.stroke();

            // Dashed center line for beams under stress (structural analysis style)
            if (beam.stress > 0.15) {
                ctx.save();
                ctx.setLineDash([4, 6]);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = dark ? 'rgba(248,113,113,0.15)' : 'rgba(239,68,68,0.12)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.restore();
            }
        });

        // Draw nodes
        screenNodes.forEach((sn, i) => {
            if (!sn.visible) return;
            const node = nodes[i];

            if (node.pinned) {
                // Draw support symbol (triangle)
                drawTriangleSupport(sn.x, sn.y, 7, supportColor);
            }

            // Node circle
            ctx.beginPath();
            ctx.arc(sn.x, sn.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();

            // Outer ring for larger nodes
            if (node.radius > 3.5) {
                ctx.beginPath();
                ctx.arc(sn.x, sn.y, node.radius + 3, 0, Math.PI * 2);
                ctx.strokeStyle = dark ? 'rgba(129,140,248,0.1)' : 'rgba(59,130,246,0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        // Draw load arrows
        loads.forEach(load => {
            const sy = load.y - scrollY;
            if (sy < -50 || sy > H + 50) return;
            const bob = Math.sin(time * 1.2 + load.phase) * 5;
            drawLoadArrow(load.x, sy + bob, load.angle, load.length, loadColor);
        });

        // Floating structural formulas/symbols (subtle)
        const symbols = ['σ', 'ε', 'δ', 'F', 'M', 'τ', 'E', 'I', 'ν'];
        const symbolAlpha = dark ? 0.06 : 0.07;
        ctx.font = '14px "Inter", serif';
        ctx.fillStyle = dark ? `rgba(129,140,248,${symbolAlpha})` : `rgba(59,130,246,${symbolAlpha})`;
        symbols.forEach((sym, i) => {
            const sx = ((i * 137 + scrollY * 0.1) % (W + 100)) - 50;
            const sy = ((i * 211 + scrollY * 0.15 + Math.sin(time + i) * 20) % (H + 100)) - 50;
            ctx.fillText(sym, sx, sy);
        });

        requestAnimationFrame(draw);
    }

    // Slowly drift nodes
    function updateNodes() {
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            // Soft boundary
            if (n.x < -20 || n.x > W + 20) n.vx *= -1;
        });
        setTimeout(updateNodes, 50);
    }

    window.addEventListener('scroll', () => { scrollY = window.scrollY; });
    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

    // Re-init when theme changes to update colors immediately
    document.getElementById('themeToggle').addEventListener('click', () => {
        setTimeout(() => draw(), 50);
    });

    init();
    updateNodes();
    draw();
})();

// ============================================
// PARTICLES (Hero background)
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    const count = 30;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
    }
}

createParticles();

// ============================================
// CONTACT FORM (Basic handler)
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Create mailto link as fallback
    const mailtoLink = `mailto:your.email@university.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoLink;

    // Show success feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Opening Email Client...';
    btn.style.background = '#22c55e';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        contactForm.reset();
    }, 3000);
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// FADE IN ANIMATION KEYFRAME (CSS-in-JS)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold;');
console.log('%cThanks for checking out my source code!', 'font-size: 14px; color: #818cf8;');
console.log('%cFeel free to reach out if you want to collaborate.', 'font-size: 12px; color: #888;');
