#!/usr/bin/env bash
# GitHub CLI (gh) 认证脚本
# 用法：
#   ./auth_github_cli.sh               # 交互式登录（推荐）
#   ./auth_github_cli.sh <TOKEN>       # 使用个人访问令牌（PAT）进行登录

set -e

if [[ -n "$1" ]]; then
  echo "正在使用提供的 token 进行认证..."
  # 通过管道将 token 传递给 gh，以避免在命令行中暴露 token
  echo "$1" | gh auth login --with-token
else
  echo "启动交互式认证流程，请按照提示完成登录..."
  gh auth login
fi

# 输出认证状态以确认成功
if gh auth status > /dev/null 2>&1; then
  echo "✅ GitHub CLI 已成功认证。"
  gh auth status
else
  echo "❌ 认证失败，请检查网络或凭证。"
fi
