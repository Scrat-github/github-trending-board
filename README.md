# GitHub Trending 看板

自动捕捉 GitHub 热门项目 + B 站教学视频。

## 🌐 在线访问

```
https://你的用户名.github.io/github-trending-board/
```

## 🚀 部署到 GitHub Pages

### 1. 推送到 GitHub

```bash
cd ~/Desktop/Claude\ Code\ test/github-trending-board

# 添加远程仓库 (替换为你的 GitHub 用户名)
git remote add origin https://github.com/你的用户名/github-trending-board.git

# 推送
git branch -M main
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入 GitHub 仓库
2. Settings → Pages
3. Source 选择 **GitHub Actions**
4. 保存

### 3. 等待部署

- 进入 Actions 标签
- 等待第一次部署完成 (约 2-3 分钟)
- 部署成功后会显示访问地址

### 4. 访问你的看板

```
https://你的用户名.github.io/github-trending-board/
```

---

## ⏰ 自动更新

### 方案 A: GitHub Actions 定时任务

编辑 `.github/workflows/deploy.yml`:

```yaml
schedule:
  - cron: '0 0 * * *'  # 每天 UTC 0 点 (北京时间 8 点)
```

### 方案 B: 手动触发

1. Actions → Deploy to GitHub Pages
2. 点击 "Run workflow"
3. 等待完成

---

## 💰 成本

**¥0** - 完全免费

| 服务 | 免费额度 |
|------|----------|
| GitHub 仓库 | 无限 |
| GitHub Actions | 2000 分钟/月 |
| GitHub Pages | 100GB/月流量 |
| B 站 API | 免费开放 |

---

## 📱 页面功能

- 🔥 GitHub Trending Top 10
- 📺 自动关联 B 站教学视频
- 📱 响应式设计 (手机/电脑)
- 🌙 深色主题
- ⚡ 快速加载

---

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 获取数据
npm run fetch

# 本地预览
npm run dev

# 访问 http://localhost:3000
```

---

## ⚠️ 注意事项

1. **国内访问**: GitHub Pages 在国内访问可能较慢，但通常可以访问
2. **首次部署**: 需要 2-3 分钟
3. **B 站 API**: 有访问频率限制，建议每天更新 1-2 次

---

## 📞 故障排除

### Pages 不显示
- 等待 3-5 分钟
- 强制刷新 (Ctrl+Shift+R)
- 检查 Actions 是否成功

### 没有数据
- 检查 Actions 运行日志
- 手动触发一次 workflow

### B 站视频不显示
- B 站 API 可能暂时限流
- 稍后再试即可

---

## License

MIT
