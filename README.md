# 个人博客站点（基于 Astro）

## 项目概述
本项目采用 **Astro**（SSG） + **Tailwind CSS** + **React**（用于集成 **Shadcn UI**、**Framer Motion**、**Lucide Icons**）的技术栈，旨在构建一个 **极致性能、模块化、可扩展** 的个人博客站点，全部部署在 **GitHub Pages**。

## 目录结构（核心）
```
├─ src/
│  ├─ components/
│  │  ├─ Layout/
│  │  │  └─ BaseLayout.astro          # 通用布局，包含 Header、Sidebar、Footer
│  │  ├─ Nav/
│  │  │  └─ NavBar.jsx                # 顶部导航（React + Shadcn UI 占位）
│  │  ├─ SideBar/
│  │  │  └─ SideBar.jsx               # 侧边栏（React）
│  │  ├─ Footer/
│  │  │  └─ Footer.jsx                # 页脚（React）
│  │  ├─ Animated/
│  │  │  └─ AnimatedPage.jsx          # Framer Motion 页面入场动画包装
│  │  └─ templates/
│  │     ├─ ListSection.astro          # 通用列表区块模板
│  │     └─ DetailSection.astro        # 通用详情区块模板
│  ├─ pages/
│  │  └─ index.astro                 # 示例首页，使用 BaseLayout + AnimatedPage
│  ├─ styles/
│  │  └─ globals.css                 # Tailwind 基础样式入口
│  └─ ...
├─ astro.config.mjs                  # Astro 配置，开启 Tailwind & React 集成
├─ tailwind.config.cjs               # Tailwind 配置（JIT）
├─ postcss.config.cjs                # PostCSS 配置
├─ package.json                      # 项目依赖与脚本
├─ .gitignore                       # Git 忽略规则
└─ README.md                        # 当前文档
```

## 关键技术点
1. **Astro Island 架构**：页面默认输出纯 HTML，交互部分采用 React Island，确保首屏加载极快。
2. **Tailwind CSS**：原子化样式，支持 JIT 编译，极大缩减产出 CSS 大小。
3. **Framer Motion**：在 `src/components/Animated/AnimatedPage.jsx` 中封装了页面入场动画，可在任意 Astro 页面通过 `<AnimatedPage>...</AnimatedPage>` 使用。
4. **Shadcn UI (基于 Radix UI)**：在 `NavBar.jsx`、`SideBar.jsx`、`Footer.jsx` 中占位引入，后续可直接替换为 Shadcn UI 组件实现完整的可访问性与交互。
5. **Lucide Icons**：统一使用 `lucide-react` 的 SVG 图标，保持视觉一致性。
6. **部署**：使用 `npm run build` 生成静态文件后，通过 GitHub Actions（或手动）将 `dist/` 推送至 `gh-pages` 分支，实现 GitHub Pages 自动部署。

## 初始化与开发流程
```bash
# 1. 安装依赖（首次）
npm install

# 2. 本地开发
npm run dev

# 3. 构建静态站点
npm run build   # 输出至 ./dist

# 4. 部署到 GitHub Pages（手动）
# 将构建产物推送到 gh-pages 分支
git add -A
git commit -m "build: generate static site"
git push origin main   # push source
# 创建或更新 gh-pages 分支
git subtree push --prefix dist origin gh-pages
```
> **Tip**：项目中已提供 `push_changes.sh`，可在每次代码变更后运行 `./push_changes.sh "提交信息"` 完成 `add → commit → push`。

## 添加新栏目 / 页面
1. **新页面**：在 `src/pages/` 新建 `.astro` 文件，使用 `BaseLayout` 包裹并可嵌入 `AnimatedPage`、`ListSection`、`DetailSection` 等模板。
2. **内容块**：在 `src/components/templates/` 编写新的模板组件，保持 `slot` 机制，便于在不同页面复用。
3. **路由**：Astro 自动根据 `src/pages` 的文件结构生成路由，无需额外配置。

---
*本项目结构与脚本已完成初始化，可直接运行 `npm install` 开始开发*.
