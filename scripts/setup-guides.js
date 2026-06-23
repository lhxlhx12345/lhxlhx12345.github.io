const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'pages', 'guides');
const pagesDir = path.join(__dirname, '..', 'pages');

// 游戏配置
const games = {
    genshin: { title: '原神', icon: 'fa-solid fa-mountain', color: 'purple' },
    arknights: { title: '明日方舟', icon: 'fa-solid fa-shield-halved', color: 'blue' },
    'star-rail': { title: '崩坏星穹铁道', icon: 'fa-solid fa-train-subway', color: 'pink' },
    other: { title: '其他游戏', icon: 'fa-solid fa-gamepad', color: 'orange' },
    general: { title: '通用攻略', icon: 'fa-solid fa-book', color: 'green' }
};

// 分类中文名映射
const catNames = {
    beginner: '新手入门',
    'character-build': '角色培养',
    team: '配队推荐',
    exploration: '探索攻略',
    version: '版本更新',
    advanced: '进阶玩法',
    stage: '关卡攻略',
    event: '活动攻略',
    character: '角色攻略',
    build: '角色培养',
};

// 扫描游戏目录下的文章
function scanGame(gameId) {
    const gameDir = path.join(baseDir, gameId);
    if (!fs.existsSync(gameDir)) return null;

    const cats = {};
    const items = fs.readdirSync(gameDir, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            const catDir = path.join(gameDir, item.name);
            const files = fs.readdirSync(catDir)
                .filter(f => f.endsWith('.html'))
                .map(f => {
                    const name = f.replace('.html', '');
                    return { name, route: `guides/${gameId}/${item.name}/${name}` };
                });
            if (files.length > 0) {
                cats[item.name] = files;
            }
        }
    }
    return cats;
}

// 生成游戏主页
function generateGamePage(gameId, config, categories) {
    let catSections = '';
    for (const [cat, files] of Object.entries(categories)) {
        const catName = catNames[cat] || cat;
        let articlesHtml = '';
        for (const f of files) {
            const title = f.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            articlesHtml += `
                <a href="#/${f.route}" class="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-${config.color}-400/30 hover:bg-white/[0.06] transition-all group">
                    <h4 class="text-white/70 group-hover:text-white font-medium text-sm mb-1">${title}</h4>
                    <span class="text-xs text-white/30">${f.route}</span>
                </a>`;
        }

        catSections += `
    <!-- ===== ${catName} ===== -->
    <section class="page-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-xl bg-${config.color}-500/15 border border-${config.color}-500/25 flex items-center justify-center">
                <i class="fa-solid fa-folder-open text-${config.color}-400 text-sm"></i>
            </div>
            <h2 class="text-xl font-bold text-white">${catName}</h2>
            <span class="text-xs text-white/30 px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">${files.length} 篇</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${articlesHtml}
        </div>
    </section>`;
    }

    return `<!-- ============================================================
   ${config.title} — 攻略大全 (二级页面)
   ============================================================ -->

<!-- 面包屑导航 -->
<nav class="page-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-white/30">
        <li><a href="#/" class="hover:text-white transition-colors">首页</a></li>
        <li><i class="fa-solid fa-chevron-right text-[10px]"></i></li>
        <li><a href="#/guides" class="hover:text-white transition-colors">游戏攻略</a></li>
        <li><i class="fa-solid fa-chevron-right text-[10px]"></i></li>
        <li class="text-white/60">${config.title}</li>
    </ol>
</nav>

<!-- 页面头部 -->
<section class="page-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
    <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${config.color}-500/10 border border-${config.color}-500/20 mb-6">
            <i class="${config.icon} text-2xl text-${config.color}-400"></i>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">${config.title}</h1>
        <p class="text-white/40 text