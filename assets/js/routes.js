/* ============================================================
   路由配置 v2 — 支持多级页面 (栏目→游戏→攻略)
   新增页面只需在此添加一个条目
   ============================================================ */

const ROUTES = [
    // === 一级：栏目首页 ===
    {
        id: 'home',
        title: '首页',
        file: 'pages/home.html',
        layout: 'default',
        nav: true,
        icon: 'fa-solid fa-house',
        favicon: 'assets/favicons/home.svg',
        breadcrumb: []
    },

    // === 游戏攻略栏目 ===
    {
        id: 'guides',
        title: '游戏攻略',
        file: 'pages/guides.html',
        layout: 'default',
        nav: true,
        icon: 'fa-solid fa-gamepad',
        favicon: 'assets/favicons/guides.svg',
        breadcrumb: [
            { title: '首页', href: '#/' }
        ]
    },

    // === 崩坏星穹铁道 (二级) ===
    {
        id: 'guides/star-rail',
        title: '崩坏星穹铁道',
        file: 'pages/guides/star-rail.html',
        layout: 'with-sidebar',
        nav: false,
        icon: 'fa-solid fa-train-subway',
        favicon: 'assets/favicons/star-rail.svg',
        breadcrumb: [
            { title: '首页', href: '#/' },
            { title: '游戏攻略', href: '#/guides' }
        ]
    },

    // === 崩坏星穹铁道 - 新手入门攻略 (三级) ===
    {
        id: 'guides/star-rail/beginner',
        title: '新手入门全面指南',
        file: 'pages/guides/star-rail/beginner-guide.html',
        layout: 'with-sidebar',
        nav: false,
        favicon: 'assets/favicons/star-rail.svg',
        breadcrumb: [
            { title: '首页', href: '#/' },
            { title: '游戏攻略', href: '#/guides' },
            { title: '崩坏星穹铁道', href: '#/guides/star-rail' }
        ]
    },
    // === 新增页面 ===
    {
        id: 'blog',
        title: '博客',
        file: 'pages/blog.html',
        layout: 'default',
        // nav: true (default)
        icon: 'fa-solid fa-newspaper',
        favicon: 'assets/favicons/home.svg',
        breadcrumb: [{ title: '首页', href: '#/' }]
    },
    {
        id: 'about',
        title: '关于',
        file: 'pages/about.html',
        layout: 'default',
        icon: 'fa-solid fa-circle-info',
        favicon: 'assets/favicons/home.svg',
        breadcrumb: [{ title: '首页', href: '#/' }]
    },
    {
        id: 'projects',
        title: '项目',
        file: 'pages/projects.html',
        layout: 'default',
        icon: 'fa-solid fa-diagram-project',
        favicon: 'assets/favicons/home.svg',
        breadcrumb: [{ title: '首页', href: '#/' }]
    },
    {
        id: 'courses',
        title: '课程',
        file: 'pages/courses.html',
        layout: 'default',
        icon: 'fa-solid fa-graduation-cap',
        favicon: 'assets/favicons/home.svg',
        breadcrumb: [{ title: '首页', href: '#/' }]
    },
    {
        id: 'resources',
        title: '资源',
        file: 'pages/resources.html',
        layout: 'default',
        icon: 'fa-solid fa-folder',
        favicon: 'assets/favicons/home.svg',
        breadcrumb: [{ title: '首页', href: '#/' }]
    },
    // === 原神 (二级) ===
    {
        id: 'guides/genshin',
        title: '原神',
        file: 'pages/guides/genshin.html',
        layout: 'with-sidebar',
        nav: false,
        icon: 'fa-solid fa-mountain',
        favicon: 'assets/favicons/genshin.svg',
        breadcrumb: [
            { title: '首页', href: '#/' },
            { title: '游戏攻略', href: '#/guides' }
        ]
    },

    // === 明日方舟 (二级) ===
    {
        id: 'guides/arknights',
        title: '明日方舟',
        file: 'pages/guides/arknights.html',
        layout: 'with-sidebar',
        nav: false,
        icon: 'fa-solid fa-shield-halved',
        favicon: 'assets/favicons/arknights.svg',
        breadcrumb: [
            { title: '首页', href: '#/' },
            { title: '游戏攻略', href: '#/guides' }
        ]
    },

    // === 其他游戏 (二级) ===
    {
        id: 'guides/other',
        title: '其他游戏',
        file: 'pages/guides/other.html',
        layout: 'with-sidebar',
        nav: false,
        icon: 'fa-solid fa-gamepad',
        favicon: 'assets/favicons/guides.svg',
        breadcrumb: [
            { title: '首页', href: '#/' },
            { title: '游戏攻略', href: '#/guides' }
        ]
    },

    // === 通用攻略 (二级) ===
    {
        id: 'guides/general',
        title: '通用攻略',
        file: 'pages/guides/general.html',
        layout: 'with-sidebar',
        nav: false,
        icon: 'fa-solid fa-book',
        favicon: 'assets/favicons/guides.svg',
        breadcrumb: [
            { title: '首页', href: '#/' },
            { title: '游戏攻略', href: '#/guides' }
        ]
    },
];

// --- 工具函数 ---
function getRoute(id) {
    const found = ROUTES.find(r => r.id === id);
    if (found) return found;

    // 动态路由 fallback：guides/{game}/{category}/{article}
    if (id.startsWith('guides/')) {
        const parts = id.split('/'); // ['guides', 'game', 'cat', 'article']
        if (parts.length >= 3) {
            const staticIds = new Set(ROUTES.map(r => r.id));
            if (!staticIds.has(id)) {
                // 动态文章路由
                const pageTitle = parts[parts.length - 1]
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                return {
                    id: id,
                    title: pageTitle,
                    file: `pages/${id}.html`,
                    layout: 'with-sidebar',
                    nav: false,
                    favicon: 'assets/favicons/guides.svg',
                    breadcrumb: [
                        { title: '首页', href: '#/' },
                        { title: '游戏攻略', href: '#/guides' }
                    ]
                };
            }
        }
    }

    // 动态路由 fallback：blog/{category}/{article}
    if (id.startsWith('blog/')) {
        const parts = id.split('/');
        const pageTitle = parts[parts.length - 1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        return {
            id: id,
            title: pageTitle,
            file: `pages/${id}.html`,
            layout: 'with-sidebar',
            nav: false,
            favicon: 'assets/favicons/home.svg',
            breadcrumb: [
                { title: '首页', href: '#/' },
                { title: '博客', href: '#/blog' }
            ]
        };
    }

    // 动态路由 fallback：courses/{category}/{lesson}
    if (id.startsWith('courses/')) {
        const parts = id.split('/');
        const pageTitle = parts[parts.length - 1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        return {
            id: id,
            title: pageTitle,
            file: `pages/${id}.html`,
            layout: 'with-sidebar',
            nav: false,
            favicon: 'assets/favicons/home.svg',
            breadcrumb: [
                { title: '首页', href: '#/' },
                { title: '课程', href: '#/courses' }
            ]
        };
    }

    // 动态路由 fallback：projects/{project}
    if (id.startsWith('projects/')) {
        const parts = id.split('/');
        const pageTitle = parts[parts.length - 1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        return {
            id: id,
            title: pageTitle,
            file: `pages/${id}.html`,
            layout: 'with-sidebar',
            nav: false,
            favicon: 'assets/favicons/home.svg',
            breadcrumb: [
                { title: '首页', href: '#/' },
                { title: '项目', href: '#/projects' }
            ]
        };
    }

    // 动态路由 fallback：resources/{resource}
    if (id.startsWith('resources/')) {
        const parts = id.split('/');
        const pageTitle = parts[parts.length - 1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        return {
            id: id,
            title: pageTitle,
            file: `pages/${id}.html`,
            layout: 'with-sidebar',
            nav: false,
            favicon: 'assets/favicons/home.svg',
            breadcrumb: [
                { title: '首页', href: '#/' },
                { title: '资源', href: '#/resources' }
            ]
        };
    }

    return ROUTES[0];
}

function getDefaultRoute() {
    return ROUTES[0];
}

// 获取指定栏目的所有子页面
function getChildRoutes(parentId) {
    return ROUTES.filter(r => r.id !== parentId && r.id.startsWith(parentId + '/'));
}
