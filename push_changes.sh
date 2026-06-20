#!/usr/bin/env bash
# 用法: ./push_changes.sh "提交信息"
# 该脚本自动完成 add、commit、push（使用 GitHub CLI 检查登录状态）
set -e

if [ -z "$1" ]; then
  echo "Error: 请提供提交信息。"
  exit 1
fi

# 将所有更改加入暂存区
git add -A

# 创建提交
git commit -m "$1"

# 确认 gh 已登录
if ! gh auth status > /dev/null 2>&1; then
  echo "GitHub CLI 未登录，请执行 'gh auth login' 并完成授权。"
  exit 1
fi

# 推送到远程 main 分支（若使用其他分支，请自行修改）
git push origin main

echo "✅ 推送完成。"
