/* ============================================================
   Animation Presets — GSAP-based, reusable across all pages
   依赖: GSAP 3.12+ (gsap.min.js + ScrollTrigger.min.js)
   ============================================================ */

const Anim = (() => {

    // --- 滚动触发器注册 ---
    gsap.registerPlugin(ScrollTrigger);

    // =============================================================
    // 页面入场：内容区域交错淡入上移
    // @param {string} selector - 目标选择器，默认 '.page-section'
    // @param {number} stagger - 间隔 (秒)
    // =============================================================
    function pageEnter(selector = '.page-section', stagger = 0.08) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        gsap.fromTo(els,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger,
                ease: 'power2.out',
                onComplete: () => {
                    els.forEach(el => el.classList.add('visible'));
                }
            }
        );
    }

    // =============================================================
    // 页面退场：淡出
    // @param {HTMLElement} container
    // @returns {Promise}
    // =============================================================
    function pageExit(container) {
        return new Promise(resolve => {
            gsap.to(container.children, {
                opacity: 0,
                y: -10,
                duration: 0.25,
                stagger: 0.03,
                ease: 'power2.in',
                onComplete: resolve
            });
        });
    }

    // =============================================================
    // 滚动揭示：元素进入视口时淡入
    // @param {string} selector
    // =============================================================
    function scrollReveal(selector = '.reveal') {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                },
                // 只触发一次
                once: true
            });
        });
    }

    // =============================================================
    // 导航栏滚动效果：向下滚动时添加背景
    // @param {string} selector - 导航栏选择器
    // =============================================================
    function navbarOnScroll(selector = '#navbar-inner') {
        const el = document.querySelector(selector);
        if (!el) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                el.classList.add('bg-gray-950/90', 'backdrop-blur-md', 'shadow-lg');
                el.classList.remove('bg-transparent');
            } else {
                el.classList.add('bg-transparent');
                el.classList.remove('bg-gray-950/90', 'backdrop-blur-md', 'shadow-lg');
            }
        }, { passive: true });
    }

    // =============================================================
    // 数字递增动画（计数器效果）
    // @param {string} selector
    // =============================================================
    function countUp(selector) {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            const target = parseInt(el.dataset.count, 10) || 0;
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.fromTo(el,
                        { innerText: 0 },
                        {
                            innerText: target,
                            duration: 2,
                            snap: { innerText: 1 },
                            ease: 'power2.out'
                        }
                    );
                }
            });
        });
    }

    // =============================================================
    // 视差滚动效果
    // @param {string} selector
    // @param {number} speed - 视差速度 (0~1)
    // =============================================================
    function parallax(selector, speed = 0.3) {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            gsap.to(el, {
                y: () => window.innerHeight * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // =============================================================
    // 交错列表动画（用于文章列表、卡片网格等）
    // @param {string} selector - 列表项选择器
    // =============================================================
    function staggerList(selector = '.stagger-item') {
        const container = document.querySelector(selector);
        if (!container) return;

        const items = container.children;
        ScrollTrigger.create({
            trigger: container,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.fromTo(items,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.06,
                        ease: 'power2.out'
                    }
                );
            }
        });
    }

    // --- 公开 API ---
    return {
        pageEnter,
        pageExit,
        scrollReveal,
        navbarOnScroll,
        countUp,
        parallax,
        staggerList
    };

})();
