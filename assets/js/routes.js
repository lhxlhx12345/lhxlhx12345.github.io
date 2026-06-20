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
    }

    // === 扩展模板 (按此格式添加其他游戏) ===
    // {
    //     id: 'guides/genshin',
    //     title: '原神',
    //     file: 'pages/guides/genshin.html',
    //     layout: 'with-sidebar',
    //     nav: false,
    //     icon: 'fa-solid fa-mountain',
    //     breadcrumb: [
    //         { title: '首页', href: '#/' },
    //         { title: '游戏攻略', href: '#/guides' }
    //     ]
    // },
];

// --- 工具函数 ---
function getRoute(id) {
    return ROUTES.find(r => r.id === id) || ROUTES[0];
}

function getDefaultRoute() {
    return ROUTES[0];
}

// 获取指定栏目的所有子页面
function getChildRoutes(parentId) {
    return ROUTES.filter(r => r.id !== parentId && r.id.startsWith(parentId + '/'));
}
