# 使用 GitHub CLI 推送网站开发文件

本文档提供在本项目（GitHub 仓库 `lhxlhx12345.github.io`）中使用 **GitHub CLI（gh）** 进行文件提交、推送以及创建 Pull Request 的完整工作流。

## 1. 安装 GitHub CLI
- Windows（PowerShell）:  
  ```powershell
  winget install --id GitHub.cli
  ```
- macOS（Homebrew）:  
  ```bash
  brew install gh
  ```
- Linux（apt）:  
  ```bash
  sudo apt-get update && sudo apt-get install gh
  ```

> **⚠️** 请确保 `gh` 可在终端直接调用：`gh --version` 输出版本号即表示安装成功。

## 2. 登录 GitHub 账户
```bash
gh auth login
```
按照交互提示选择 **GitHub.com**、**HTTPS**，并使用浏览器进行 OAuth 授权。完成后，CLI 会将凭据安全地保存到本地。

> **提示**: 若已在其他机器上配置了 token，可直接使用 `gh auth login --with-token <TOKEN>` 进行免交互登录。

## 3. 项目初始化（仅首次运行一次）
在仓库根目录执行：
```bash
git remote -v   # 确认 remote 指向正确的 GitHub 仓库
# 若未设置 remote，可使用以下命令添加（已克隆时一般不需要）
# git remote add origin https://github.com/lhxlhx12345/lhxlhx12345.github.io.git
```

## 4. 常用推送脚本（推荐）
将以下脚本保存为 `push_changes.sh`（可自行修改文件名），并赋予可执行权限：
```bash
#!/usr/bin/env bash
# 用法: ./push_changes.sh "本次提交的描述"
set -e

if [ -z "$1" ]; then
  echo "Error: 请提供提交信息。"
  exit 1
fi

# 将所有改动加入暂存区
git add -A

# 创建提交
git commit -m "$1"

# 使用 gh 确认已登录（如未登录将提示错误）
gh auth status > /dev/null || { echo "GitHub CLI 未登录，请执行 'gh auth login'"; exit 1; }

# 推送到远端 main 分支
git push origin main

echo "✅ 推送完成。"
```
执行以下命令使脚本可执行：
```bash
chmod +x push_changes.sh
```
以后每次修改完文件后，只需运行：
```bash
./push_changes.sh "更新了首页布局"
```
即可完成 `add → commit → push` 三步自动化。

## 5. 创建 Pull Request（可选）
如果你在 **fork** 或 **feature branch** 上开发，可使用 CLI 一键创建 PR：
```bash
# 创建并切换到新分支
git checkout -b feature/xyz
# 正常开发后提交
./push_changes.sh "实现新功能 XYZ"
# 创建 PR（默认目标为 upstream 的 main）
gh pr create --title "功能 XYZ" --body "简要说明实现细节" --base main
```

## 6. 常见问题
| 场景 | 解决方案 |
|------|----------|
| `gh: command not found` | 确认已将安装路径加入 `PATH`，或使用完整路径调用，如 `C:\Program Files\GitHub CLI\bin\gh.exe` |
| 登录后推送仍提示权限错误 | 检查仓库的 **Collaborators** 权限，确保账号具有 **Write** 权限；或重新执行 `gh auth login` 以刷新 token |
| 推送被拒绝（non‑fast‑forward） | 先执行 `git pull --rebase` 合并远端更改，再重新推送 |

## 7. 小结
- 安装 `gh` 并登录
- 使用提供的 `push_changes.sh` 脚本完成 `add → commit → push`
- 如需协作或审查，可使用 `gh pr create`

如有其他需求（例如自动化 CI/CD），欢迎进一步沟通。
