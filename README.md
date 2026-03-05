# GitHub Trending 看板

自动捕捉 GitHub 热门项目 + B 站教学视频。

## 效果预览

- 🔥 GitHub Trending Top 10
- 📺 自动关联 B 站教学视频
- ⏰ 每日北京时间 8 点自动更新
- 💰 完全免费，无需 API Key

## 在线演示

```
https://你的用户名.github.io/github-trending-board/
```

## 部署步骤

### 1. Fork 到自己的 GitHub

### 2. 推送到你的仓库
```bash
cd ~/Desktop/Claude\ Code\ test/github-trending-board
git remote add origin https://github.com/你的用户名/github-trending-board.git
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Actions
- 进入 Actions 标签
- 点击 "I understand my workflows, go ahead and enable them"

### 4. 启用 GitHub Pages
- Settings → Pages
- Source 选择 `main` 分支，根目录 `/` (root)
- 保存

### 5. 手动触发首次运行
- Actions → Update Trending Board
- 点击 "Run workflow"
- 等待运行完成 (约 30 秒)

### 6. 访问你的看板
```
https://你的用户名.github.io/github-trending-board/
```

## 自动更新

每天北京时间 8 点自动更新。

也可以手动触发：
- Actions → Update Trending Board → Run workflow

## 技术栈

| 组件 | 服务 | 成本 |
|------|------|------|
| 定时任务 | GitHub Actions | 免费 |
| 网站托管 | GitHub Pages | 免费 |
| GitHub 数据 | 第三方 API | 免费 |
| B 站视频 | B 站开放 API | 免费 |

**总成本：$0**

## 自定义

### 修改更新频率
编辑 `.github/workflows/update.yml`:
```yaml
schedule:
  - cron: '0 0 * * *'  # 每天 0 点 UTC
```

### 修改抓取数量
编辑 `fetch.js`:
```javascript
return data.slice(0, 10); // 改为 5 或 20
```

### 添加其他数据源
在 `fetch.js` 中添加新的 API 调用。

## 注意事项

1. **B 站 API 限制**: 未登录用户有访问频率限制，如遇问题可降低更新频率
2. **GitHub Actions 时长**: 每次运行约 30-60 秒
3. **图片加载**: B 站图片使用 HTTPS，确保正常加载

## 故障排除

### 数据不更新
- 检查 Actions 是否启用
- 查看 Actions 运行日志

### B 站视频不显示
- B 站 API 可能暂时限制
- 检查网络连接

### Pages 不显示
- 等待 2-3 分钟部署完成
- 刷新页面 (Ctrl+Shift+R 强制刷新)

## License

MIT
