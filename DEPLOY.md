# 部署问题修复记录

## 修复日期
2026-03-06

## 问题描述
- GitHub Actions 部署失败
- GitHub Pages 无法访问

## 问题原因

### 问题 1: package-lock.json 未提交
`package-lock.json` 文件没有被提交到 GitHub 仓库，导致 GitHub Actions 在执行 `npm install` 时失败。

错误信息：
```
[error]Dependencies lock file is not found in /home/runner/work/github-trending-board/github-trending-board. 
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

### 问题 2: 部署路径配置错误
原配置只部署 `./data` 目录，但 `index.html` 中的 JavaScript 代码请求 `data/trending.json`，导致 404 错误。

## 修复步骤

### 1. 本地构建测试
```bash
npm install
npm run build
npm run dev  # http://localhost:3000
```
✅ 本地构建成功，页面正常显示

### 2. 添加缺失的文件到 Git
```bash
git add package-lock.json data/index.html DEPLOY.md
git commit -m "添加 package-lock.json 和构建生成的文件"
git push
```

### 3. 修复部署配置
修改 `.github/workflows/deploy.yml`，将部署路径从 `./data` 改为整个根目录 `.`：

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: '.'  # 原来是 './data'
```

这样 `index.html` 可以正确访问 `data/trending.json`。

### 4. 推送修复
```bash
git add .github/workflows/deploy.yml
git commit -m "fix: 修改部署配置为部署整个根目录"
git push
```

### 5. 手动触发部署验证
```bash
gh workflow run deploy.yml
```

### 6. 验证部署结果
- ✅ GitHub Actions 部署成功（35 秒完成）
- ✅ GitHub Pages 可访问：https://Scrat-github.github.io/github-trending-board/
- ✅ 数据文件可访问：https://Scrat-github.github.io/github-trending-board/data/trending.json
- ✅ 页面正常显示 3 个热门项目：
  1. facebook/react - 221k stars
  2. microsoft/vscode - 161k stars
  3. openai/chatgpt - 95k stars

## 项目配置

### Workflow 配置
- **deploy.yml**: 推送到 main 分支或手动触发时自动部署
- **update.yml**: 每天 UTC 0 点（北京时间 8 点）自动更新数据

### 构建命令
- `npm run build`: 获取数据并生成静态文件到 `data/` 目录
- `npm run dev`: 本地测试服务器（http://localhost:3000）

### 部署配置
- 使用 GitHub Pages 部署
- 构建产物：整个根目录（包含 `index.html` 和 `data/`）
- 访问地址：https://Scrat-github.github.io/github-trending-board/

## 经验教训
1. `package-lock.json` 必须提交到 Git，确保 CI/CD 环境依赖一致
2. 部署路径配置需要与代码中的资源路径匹配
3. 本地构建成功后，确保所有必要文件都已提交
4. 使用 `git ls-files` 检查仓库中实际包含的文件
5. 使用 `gh run view <run-id> --log` 查看详细错误日志
