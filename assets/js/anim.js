/* ============================================================
   Animation system v2 — Particles + GSAP + Parallax + Interactive effects
   Dependencies: gsap.min.js + ScrollTrigger.min.js
   ============================================================ */

const Anim = (() => {

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ============================================================
    // 1. Particle System — Canvas floating particles with connections
    // ============================================================
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId = null;
        const isMobile = window.matchMedia('(pointer: coarse)').matches;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.growth = Math.random() > 0.5 ? 0.003 : -0.003;
                this.phase = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.phase += 0.01;
                this.opacity += this.growth;
                if (this.opacity > 0.5 || this.opacity < 0.05) {
                    this.growth = -this.growth;
                }
                if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(167, 139, 250, ' + this.opacity + ')';
                ctx.fill();
            }
        }

        function drawConnections() {
            const maxDist = 120;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const opacity = (1 - dist / maxDist) * 0.08;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(167, 139, 250, ' + opacity + ')';
                        ctx.lineWidth = 0.3;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        function init() {
            resizeCanvas();
            const count = isMobile ? 30 : 70;
            particles = Array.from({ length: count }, () => new Particle());
            animate();
        }

        window.addEventListener('resize', resizeCanvas, { passive: true });
        init();
    }

    // ============================================================
    // 2. Typewriter effect with cursor
    // ============================================================
    function typewriter(element, texts, speed, pause) {
        if (!element || !texts || !texts.length) return;
        speed = speed || 80;
        pause = pause || 2500;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = texts[textIndex];
            let displayText = '';

            if (isDeleting) {
                displayText = currentText.slice(0, charIndex - 1);
                charIndex--;
            } else {
                displayText = currentText.slice(0, charIndex + 1);
                charIndex++;
            }

            element.textContent = displayText;

            if (isDeleting && charIndex <= 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 300);
                return;
            }

            if (!isDeleting && charIndex >= currentText.length) {
                isDeleting = true;
                setTimeout(type, pause);
                return;
            }

            setTimeout(type, isDeleting ? speed / 2 : speed);
        }

        type();
    }

    // ============================================================
    // 3. Mouse parallax for floating elements
    // ============================================================
    function mouseParallax() {
        const isMobile = window.matchMedia('(pointer: coarse)').matches;
        if (isMobile) return;

        const elements = document.querySelectorAll('[data-parallax]');
        if (!elements.length) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        }, { passive: true });

        function update() {
            currentX += (mouseX - currentX) * 0.04;
            currentY += (mouseY - currentY) * 0.04;

            elements.forEach(el => {
                const intensity = parseFloat(el.dataset.parallax) || 10;
                el.style.transform = 'translate(' + (currentX * intensity) + 'px, ' + (currentY * intensity) + 'px)';
            });

            requestAnimationFrame(update);
        }
        update();
    }

    // ============================================================
    // 4. Page content entrance — staggered fade in
    // ============================================================
    function pageEnter(selector, stagger) {
        const els = document.querySelectorAll(selector || '.page-section');
        if (!els.length) return;

        gsap.fromTo(els,
            { opacity: 0, y: 60 },
            {
                opacity: 1, y: 0,
                duration: 0.9,
                stagger: stagger || 0.1,
                ease: 'power3.out',
                onComplete: function() {
                    els.forEach(el => el.classList.add('visible'));
                }
            }
        );
    }

    // ============================================================
    // 5. Page exit — fade out
    // ============================================================
    function pageExit(container) {
        return new Promise((resolve) => {
            gsap.to(container.children, {
                opacity: 0, y: -15,
                duration: 0.3, stagger: 0.02, ease: 'power2.in',
                onComplete: resolve
            });
        });
    }

    // ============================================================
    // 6. Scroll reveal with scale
    // ============================================================
    function scrollReveal(selector) {
        if (typeof ScrollTrigger === 'undefined') return;
        const els = document.querySelectorAll(selector || '.reveal');
        els.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el, start: 'top 85%', once: true
                    }
                }
            );
        });
    }

    // ============================================================
    // 7. Navbar scroll effect with blur
    // ============================================================
    function navbarOnScroll(selector) {
        const el = document.querySelector(selector || '#navbar-inner');
        if (!el) return;

        const scrollHandler = () => {
            el.classList.toggle('scrolled', window.scrollY > 50);
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // ============================================================
    // 8. Animated count up with suffix
    // ============================================================
    function countUp(selector) {
        if (typeof ScrollTrigger === 'undefined') return;
        const els = document.querySelectorAll(selector || '[data-count]');
        els.forEach(el => {
            const target = parseInt(el.dataset.count, 10) || 0;
            const suffix = el.dataset.suffix || '';

            ScrollTrigger.create({
                trigger: el, start: 'top 85%', once: true,
                onEnter: () => {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target, duration: 2.5, ease: 'power2.out',
                        onUpdate: () => {
                            el.textContent = Math.round(obj.val) + suffix;
                        }
                    });
                }
            });
        });
    }

    // ============================================================
    // 9. Parallax scrolling
    // ============================================================
    function parallax(selector, speed) {
        speed = speed || 0.3;
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            gsap.to(el, {
                y: () => window.innerHeight * speed, ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement || el,
                    start: 'top bottom', end: 'bottom top', scrub: true
                }
            });
        });
    }

    // ============================================================
    // 10. Stagger list with 3D flip
    // ============================================================
    function staggerList(selector) {
        if (typeof ScrollTrigger === 'undefined') return;
        const container = document.querySelector(selector || '.stagger-list');
        if (!container) return;
        const items = container.children;
        if (!items.length) return;

        ScrollTrigger.create({
            trigger: container, start: 'top 85%', once: true,
            onEnter: () => {
                gsap.fromTo(items,
                    { opacity: 0, y: 60, scale: 0.9, rotateZ: -2 },
                    {
                        opacity: 1, y: 0, scale: 1, rotateZ: 0,
                        duration: 0.8, stagger: 0.12, ease: 'power3.out'
                    }
                );
            }
        });
    }

    // ============================================================
    // 11. Magnetic button hover
    // ============================================================
    function magneticButtons() {
        const isMobile = window.matchMedia('(pointer: coarse)').matches;
        if (isMobile) return;

        const buttons = document.querySelectorAll('.magnetic');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ============================================================
    // 12. Text character split animation
    // ============================================================
    function splitText(selector) {
        if (typeof ScrollTrigger === 'undefined') return;
        const els = document.querySelectorAll(selector || '.split-text');
        els.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text.charAt(i);
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px) rotateX(-90deg)';
                el.appendChild(span);
            }

            ScrollTrigger.create({
                trigger: el, start: 'top 80%', once: true,
                onEnter: () => {
                    gsap.to(el.children, {
                        opacity: 1, y: 0, rotateX: 0,
                        duration: 0.5, stagger: 0.03, ease: 'power3.out'
                    });
                }
            });
        });
    }

    // --- Public API ---
    return {
        initParticles, typewriter, mouseParallax, pageEnter, pageExit,
        scrollReveal, navbarOnScroll, countUp, parallax, staggerList,
        magneticButtons, splitText
    };

})();
