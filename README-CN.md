# GitHub Trending 看板 - 国内部署版

自动捕捉 GitHub 热门项目 + B 站教学视频。

## 🇨🇳 国内部署方案

### 方案一：Vercel (推荐⭐)

**优点**: 
- 国内访问速度快
- 完全免费
- 自动 HTTPS
- 无需域名

**部署步骤**:

1. 安装 Vercel CLI
```bash
npm i -g vercel
```

2. 本地构建
```bash
npm install
npm run build
```

3. 部署到 Vercel
```bash
vercel login  # 登录 (支持 GitHub 登录)
vercel        # 部署
```

4. 设置定时更新
- 进入 Vercel Dashboard
- Settings → Git → Import Git Repository
- 连接你的 GitHub 仓库
- Settings → Cron Jobs → 添加定时任务

**访问地址**: `https://your-project.vercel.app`

---

### 方案二：Gitee Pages

**优点**: 
- 国内访问最快
- 完全免费

**缺点**: 
- 需要实名认证
- 内容需要审核

**部署步骤**:

1. Fork 到 Gitee
```bash
git remote add gitee https://gitee.com/你的用户名/github-trending-board.git
git push gitee main
```

2. 开启 Pages 服务
- 进入 Gitee 仓库
- 服务 → Gitee Pages
- 选择 main 分支
- 提交审核

**访问地址**: `https://你的用户名.gitee.io/github-trending-board`

---

### 方案三：本地运行 + 内网穿透

**适合**: 仅自己访问

```bash
# 安装内网穿透工具
npm i -g localtunnel

# 运行项目
npm install
npm run build
npm run dev  # 本地启动 (http://localhost:3000)

# 内网穿透
lt --port 3000
```

---

## 自动更新配置

### Vercel Cron Jobs

在 `vercel.json` 中配置:
```json
{
  "crons": [{
    "path": "/api/update",
    "schedule": "0 0 * * *"
  }]
}
```

### GitHub Actions (需要能访问 GitHub)

```yaml
schedule:
  - cron: '0 0 * * *'  # 每天 UTC 0 点 (北京时间 8 点)
```

---

## 本地开发

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

## 成本

| 方案 | 成本 |
|------|------|
| Vercel | ¥0 |
| Gitee | ¥0 |
| 本地运行 | ¥0 |

---

## 注意事项

1. **B 站 API**: 有访问频率限制，建议每天更新 1-2 次
2. **图片加载**: B 站图片可能需要 HTTPS
3. **定时任务**: Vercel 免费版有次数限制

---

## 推荐配置

**个人使用推荐**: Vercel + GitHub Actions
- 代码托管：GitHub
- 部署托管：Vercel
- 定时任务：GitHub Actions (能访问的话) 或 Vercel Cron

**完全国内**: Gitee 代码 + Gitee Pages
- 代码托管：Gitee
- 部署托管：Gitee Pages
- 定时任务：Gitee Go (免费额度内)
