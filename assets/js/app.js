/* ============================================================
   应用核心 — 组件加载、路由、页面切换、布局管理
   ============================================================ */

const App = (() => {

    // --- 缓存 ---
    const CACHE = {};

    // --- DOM 引用 ---
    let $navbar, $footer, $sidebar, $main, $sidebarBackdrop, $loader;
    let $sidebarInner;

    // --- 当前状态 ---
    let currentRouteId = null;

    // =============================================================
    // 初始化
    // =============================================================
    async function init() {
        // 缓存 DOM
        $navbar   = document.getElementById('navbar-container');
        $footer   = document.getElementById('footer-container');
        $sidebar  = document.getElementById('sidebar-container');
        $main     = document.getElementById('main-content');
        $sidebarBackdrop = document.getElementById('sidebar-backdrop');
        $loader   = document.getElementById('loader');

        // 加载共享组件（navbar, footer）
        await Promise.all([
            loadComponent('navbar', 'templates/components/navbar.html', $navbar),
            loadComponent('footer', 'templates/components/footer.html', $footer)
        ]);

        // 根据 routes.js 自动生成导航链接
        buildNavLinks();

        // 注入 Sidebar
        await loadComponent('sidebar', 'templates/components/sidebar.html', $sidebar);
        $sidebarInner = document.getElementById('sidebar-inner');

        // 初始化交互
        setupNavScroll();
        setupMobileMenu();
        setupSidebarBackdrop();
        setupThemeToggle();

        // 监听 hash 变化
        window.addEventListener('hashchange', handleRoute);
        // 也拦截内部导航点击（SPA 模式）
        document.addEventListener('click', handleNavClick);

        // 初始路由
        await handleRoute();

        // 隐藏加载屏
        hideLoader();

        // 注册 GSAP ScrollTrigger 刷新（动态内容加载后）
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // =============================================================
    // 加载 HTML 片段组件
    // =============================================================
    async function loadComponent(name, url, target) {
        try {
            if (CACHE[name]) {
                target.innerHTML = CACHE[name];
                return;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const html = await res.text();
            CACHE[name] = html;
            target.innerHTML = html;
        } catch (err) {
            console.warn(`[App] 组件加载失败: ${name} (${url})`, err);
            target.innerHTML = '';
        }
    }

    // =============================================================
    // 根据 routes.js 自动生成导航链接
    // =============================================================
    function buildNavLinks() {
        const navRoutes = ROUTES.filter(r => r.nav !== false);
        const linkHTML = navRoutes.map(r => `
            <a href="${r.id === 'home' ? '#/' : '#/' + r.id}"
               data-nav-link="${r.id}"
               class="relative px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 hover-border">
                <i class="${r.icon || ''} mr-1.5 text-xs opacity-60"></i>${r.title}
            </a>
        `).join('');

        // 桌面端
        const desktop = document.getElementById('nav-links-desktop');
        if (desktop) desktop.innerHTML = linkHTML;

        // 移动端
        const mobile = document.getElementById('nav-links-mobile');
        if (mobile) {
            mobile.innerHTML = navRoutes.map(r => `
                <a href="${r.id === 'home' ? '#/' : '#/' + r.id}"
                   data-nav-link="${r.id}"
                   class="block px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200">
                    <i class="${r.icon || ''} mr-2 w-4 text-center"></i>${r.title}
                </a>
            `).join('');
        }
    }

    // =============================================================
    // 路由处理
    // =============================================================
    async function handleRoute() {
        const hash = window.location.hash.replace('#/', '') || 'home';
        const route = getRoute(hash);

        // 同一页面不重新加载
        if (currentRouteId === route.id) return;

        // 退场动画
        if (currentRouteId) {
            await Anim.pageExit($main);
        }

        // 更新标题
        document.title = route.title + (route.id !== 'home' ? ' | My Blog' : '');

        // 应用布局
        applyLayout(route.layout);

        // 高亮导航
        highlightNav(route.id);

        // 加载页面内容
        await loadPage(route);

        // 入场动画
        Anim.pageEnter('.page-section', 0.06);

        // 滚动揭示
        Anim.scrollReveal('.reveal');

        // 交错列表
        Anim.staggerList('.stagger-list');

        // 页面回到顶部
        window.scrollTo({ top: 0, behavior: 'instant' });

        currentRouteId = route.id;

        // 刷新 ScrollTrigger（内容高度变化后）
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => ScrollTrigger.refresh(), 100);
        }
    }

    // =============================================================
    // 加载页面内容
    // =============================================================
    async function loadPage(route) {
        try {
            const html = await fetchHTML(route.file);
            $main.innerHTML = html;
        } catch (err) {
            console.error(`[App] 页面加载失败: ${route.file}`, err);
            $main.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <i class="fa-solid fa-triangle-exclamation text-5xl text-yellow-400 mb-4"></i>
                    <h2 class="text-xl font-semibold mb-2">页面加载失败</h2>
                    <p class="text-gray-400">请检查文件路径: ${route.file}</p>
                    <a href="#/" class="mt-4 text-cyan-400 hover:underline">返回首页</a>
                </div>`;
        }
    }

    // =============================================================
    // 带缓存的 HTML fetch
    // =============================================================
    async function fetchHTML(url) {
        if (CACHE[url]) return CACHE[url];
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        CACHE[url] = html;
        return html;
    }

    // =============================================================
    // 应用布局模式
    // =============================================================
    function applyLayout(layout) {
        // 重置
        $main.classList.remove('lg:ml-72');
        $sidebar.classList.add('-translate-x-full');
        $sidebar.classList.remove('lg:translate-x-0');

        if (layout === 'with-sidebar') {
            // 桌面端：侧边栏固定，内容区缩进
            $main.classList.add('lg:ml-72');
            $sidebar.classList.remove('-translate-x-full');
            $sidebar.classList.add('lg:translate-x-0');
        }

        // 其他布局模式可在此扩展
        // if (layout === 'sidebar-right') { ... }
    }

    // =============================================================
    // 高亮当前导航项
    // =============================================================
    function highlightNav(routeId) {
        document.querySelectorAll('[data-nav-link]').forEach(link => {
            if (link.dataset.navLink === routeId) {
                link.classList.add('text-cyan-400');
                link.classList.remove('text-gray-300');
            } else {
                link.classList.add('text-gray-300');
                link.classList.remove('text-cyan-400');
            }
        });

        // 同步高亮侧边栏链接
        document.querySelectorAll('.sidebar-link').forEach(link => {
            if (link.dataset.sidebarLink === routeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // =============================================================
    // 拦截导航点击 (SPA 模式)
    // =============================================================
    function handleNavClick(e) {
        const link = e.target.closest('[data-nav-link]');
        if (!link) return;

        e.preventDefault();
        const routeId = link.dataset.navLink;
        window.location.hash = routeId === 'home' ? '' : `#/${routeId}`;

        // 移动端关闭菜单
        closeMobileMenu();
    }

    // =============================================================
    // 导航栏滚动效果
    // =============================================================
    function setupNavScroll() {
        // 延迟执行，确保 navbar 已注入
        setTimeout(() => {
            Anim.navbarOnScroll('#navbar-inner');
        }, 200);
    }

    // =============================================================
    // 移动端菜单
    // =============================================================
    function setupMobileMenu() {
        // 委托事件：菜单按钮点击
        document.addEventListener('click', e => {
            const btn = e.target.closest('#mobile-menu-btn');
            if (!btn) return;
            toggleMobileMenu();
        });

        // 委托事件：关闭按钮
        document.addEventListener('click', e => {
            const btn = e.target.closest('#mobile-menu-close');
            if (!btn) return;
            closeMobileMenu();
        });
    }

    function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;

        const isOpen = !menu.classList.contains('hidden');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        menu.classList.remove('hidden');
        gsap.fromTo(menu,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
    }

    function closeMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        gsap.to(menu, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => menu.classList.add('hidden')
        });
    }

    // =============================================================
    // 侧边栏遮罩 (移动端点击空白处关闭)
    // =============================================================
    function setupSidebarBackdrop() {
        if (!$sidebarBackdrop) return;
        $sidebarBackdrop.addEventListener('click', () => {
            // 移动端关闭侧边栏
            $sidebar.classList.add('-translate-x-full');
            $sidebar.classList.remove('lg:translate-x-0');
            $sidebarBackdrop.classList.add('opacity-0', 'pointer-events-none');
        });
    }

    // =============================================================
    // 昼夜主题切换 (预留)
    // =============================================================
    function setupThemeToggle() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('#theme-toggle');
            if (!btn) return;
            document.documentElement.classList.toggle('dark');
            // 可存储偏好到 localStorage
        });
    }

    // =============================================================
    // 隐藏加载屏
    // =============================================================
    function hideLoader() {
        if (!$loader) return;
        setTimeout(() => {
            $loader.classList.add('fade-out');
            setTimeout(() => {
                if ($loader.parentNode) {
                    $loader.parentNode.removeChild($loader);
                }
            }, 500);
        }, 300);
    }

    // =============================================================
    // 公开 API：供外部脚本调用
    // =============================================================
    function navigateTo(routeId) {
        window.location.hash = routeId === 'home' ? '' : `#/${routeId}`;
    }

    // --- DOM Ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { navigateTo, getRoute, getDefaultRoute };

})();
