# GitHub Trending 看板

自动捕捉 GitHub 热门项目和教学视频。

## 部署步骤

### 1. Fork 到自己的 GitHub

### 2. 配置 GitHub Actions
- 进入 Settings → Actions → General
- 确保 Actions 已启用

### 3. 配置 YouTube API (可选)
- 获取 API Key: https://console.cloud.google.com/apis/credentials
- 进入 Settings → Secrets and variables → Actions
- 添加 Secret: `YOUTUBE_API_KEY`

### 4. 启用 GitHub Pages
- 进入 Settings → Pages
- Source 选择 `gh-pages` 分支
- 保存后等待部署完成

### 5. 手动触发首次运行
- 进入 Actions → Update Trending Board
- 点击 "Run workflow"
- 等待运行完成

## 访问地址

```
https://你的用户名.github.io/github-trending-board/
```

## 自动更新

每天北京时间 8 点自动更新。

## 技术栈

- GitHub Actions (定时任务)
- GitHub Pages (静态托管)
- Vanilla JS (前端)

## 成本

**$0** - 完全免费
