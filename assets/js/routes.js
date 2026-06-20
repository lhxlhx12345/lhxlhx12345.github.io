/* ============================================================
   路由配置 — 声明式页面注册
   新增栏目只需在此添加一个条目 + 创建对应的 HTML 片段

   字段说明:
     id       — 唯一标识，用于 hash 路由 (如 #/blog)
     title    — 浏览器标题 & 导航栏显示名
     file     — 页面内容 HTML 片段路径
     layout   — 'default' (全宽) | 'with-sidebar' (含侧边栏)
     nav      — 是否在导航栏显示 (默认 true)
     icon     — Font Awesome 图标类名 (用于导航栏)
   ============================================================ */

const ROUTES = [
    {
        id: 'home',
        title: '首页',
        file: 'pages/home.html',
        layout: 'default',
        nav: true,
        icon: 'fa-solid fa-house'
    }

    // =====================================================
    // 示例：添加新栏目，取消注释并创建 pages/blog.html
    // =====================================================
    // {
    //     id: 'blog',
    //     title: '博客',
    //     file: 'pages/blog.html',
    //     layout: 'with-sidebar',
    //     nav: true,
    //     icon: 'fa-solid fa-newspaper'
    // },
    // {
    //     id: 'projects',
    //     title: '项目',
    //     file: 'pages/projects.html',
    //     layout: 'default',
    //     nav: true,
    //     icon: 'fa-solid fa-diagram-project'
    // },
    // {
    //     id: 'about',
    //     title: '关于',
    //     file: 'pages/about.html',
    //     layout: 'default',
    //     nav: true,
    //     icon: 'fa-solid fa-circle-info'
    // }
];

// --- 工具函数 ---
function getRoute(id) {
    return ROUTES.find(r => r.id === id) || ROUTES[0];
}

function getDefaultRoute() {
    return ROUTES[0];
}
