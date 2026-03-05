import fetch from 'node-fetch';

// GitHub Trending API (第三方免费 API)
const GITHUB_TRENDING_URL = 'https://gh-trending-api.herokuapp.com/repositories';

// B 站搜索 API
const BILIBILI_SEARCH_URL = 'https://api.bilibili.com/x/web-interface/search/type';

async function fetchGitHubTrending() {
  try {
    const res = await fetch(GITHUB_TRENDING_URL);
    if (!res.ok) throw new Error('GitHub API failed');
    const data = await res.json();
    return data.slice(0, 10); // 取前 10 个
  } catch (error) {
    console.error('Failed to fetch GitHub trending:', error.message);
    // 降级：返回空数组，不中断整个流程
    return [];
  }
}

async function fetchBilibiliVideos(query) {
  try {
    // B 站搜索 API，搜索教程视频
    const url = `${BILIBILI_SEARCH_URL}?search_type=video&keyword=${encodeURIComponent(query + ' 教程')}&page=1&page_size=3`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await res.json();
    
    if (data.code !== 0) return [];
    
    return data.data.result.map(item => ({
      title: item.title.replace(/<[^>]+>/g, ''), // 去除 HTML 标签
      videoId: item.bvid,
      author: item.author,
      thumbnail: item.pic.replace('http://', 'https://'),
      duration: item.duration,
      url: `https://www.bilibili.com/video/${item.bvid}`
    }));
  } catch (error) {
    console.error('Failed to fetch Bilibili:', error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Fetching GitHub trending...');
  const trending = await fetchGitHubTrending();
  
  if (trending.length === 0) {
    console.log('⚠️ No trending data, skipping...');
    return;
  }
  
  console.log(`📊 Found ${trending.length} trending projects`);
  
  // 为每个项目获取 B 站相关视频
  for (const project of trending) {
    const searchQuery = project.name.includes('/') 
      ? project.name.split('/')[1] // 只取项目名，不要用户名
      : project.name;
    
    console.log(`📺 Fetching Bilibili videos for ${searchQuery}...`);
    project.videos = await fetchBilibiliVideos(searchQuery);
    console.log(`   Found ${project.videos.length} videos`);
  }
  
  // 保存数据
  const fs = await import('fs');
  
  // 确保 data 目录存在
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  
  const output = {
    updatedAt: new Date().toISOString(),
    projects: trending
  };
  
  fs.writeFileSync('data/trending.json', JSON.stringify(output, null, 2));
  console.log('✅ Data saved to data/trending.json');
  
  // 同时生成静态 HTML 数据
  const html = generateHTML(output);
  fs.writeFileSync('index.html', html);
  console.log('✅ index.html updated');
  
  console.log('🎉 Done!');
}

function generateHTML(data) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Trending 看板</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d1117; color: #c9d1d9; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { text-align: center; padding: 40px 0; border-bottom: 1px solid #30363d; margin-bottom: 40px; }
    h1 { font-size: 32px; color: #58a6ff; margin-bottom: 8px; }
    .subtitle { color: #8b949e; font-size: 14px; margin-bottom: 8px; }
    .update-time { color: #238636; font-size: 13px; }
    .project-list { display: grid; gap: 16px; }
    .project-card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; transition: transform 0.2s, border-color 0.2s; }
    .project-card:hover { transform: translateX(4px); border-color: #58a6ff; }
    .project-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
    .rank { width: 32px; height: 32px; background: linear-gradient(135deg, #238636, #2ea043); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .project-name { font-size: 18px; font-weight: 600; color: #58a6ff; text-decoration: none; }
    .project-name:hover { text-decoration: underline; }
    .project-desc { color: #8b949e; font-size: 14px; margin-bottom: 12px; line-height: 1.5; min-height: 42px; }
    .stats { display: flex; gap: 16px; flex-wrap: wrap; }
    .stat { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #8b949e; }
    .stat-value { color: #c9d1d9; font-weight: 600; }
    .videos { margin-top: 16px; padding-top: 16px; border-top: 1px solid #30363d; }
    .videos-title { font-size: 13px; color: #ff6b9d; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .video-list { display: grid; gap: 8px; }
    .video-item { display: flex; gap: 12px; padding: 10px; background: #0d1117; border-radius: 6px; text-decoration: none; color: #c9d1d9; transition: background 0.2s; border: 1px solid transparent; }
    .video-item:hover { background: #21262d; border-color: #ff6b9d; }
    .video-thumbnail { width: 120px; height: 68px; background: #30363d; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
    .video-info { flex: 1; min-width: 0; }
    .video-title { font-size: 13px; line-height: 1.5; color: #c9d1d9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .video-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: #8b949e; }
    .video-author { color: #ff6b9d; }
    .no-videos { color: #8b949e; font-size: 13px; font-style: italic; padding: 12px 0; }
    footer { text-align: center; padding: 40px 0; color: #8b949e; font-size: 13px; border-top: 1px solid #30363d; margin-top: 40px; }
    .bili-link { color: #ff6b9d; text-decoration: none; }
    .bili-link:hover { text-decoration: underline; }
    @media (max-width: 600px) { 
      .project-header { flex-wrap: wrap; } 
      .stats { gap: 12px; } 
      .video-item { flex-direction: column; }
      .video-thumbnail { width: 100%; height: auto; aspect-ratio: 16/9; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔥 GitHub Trending 看板</h1>
      <p class="subtitle">自动捕捉热门项目 + 📺 B 站教学视频</p>
      <p class="update-time">更新时间：${new Date(data.updatedAt).toLocaleString('zh-CN')}</p>
    </header>
    
    <main class="project-list">
      ${data.projects.map((p, i) => {
        const starsK = (p.stars / 1000).toFixed(1);
        return `
          <div class="project-card">
            <div class="project-header">
              <span class="rank">${i + 1}</span>
              <a class="project-name" href="${p.url}" target="_blank" rel="noopener">${p.name}</a>
            </div>
            <p class="project-desc">${p.description || '暂无描述'}</p>
            <div class="stats">
              <span class="stat">⭐ <span class="stat-value">${starsK}k</span> stars</span>
              <span class="stat">📈 <span class="stat-value">${p.todayStars || 0}</span> today</span>
              <span class="stat">📝 <span class="stat-value">${p.language || 'N/A'}</span></span>
            </div>
            ${p.videos && p.videos.length > 0 ? `
              <div class="videos">
                <div class="videos-title">📺 B 站教学视频 (${p.videos.length})</div>
                <div class="video-list">
                  ${p.videos.map(v => `
                    <a class="video-item" href="${v.url}" target="_blank" rel="noopener">
                      <img class="video-thumbnail" src="${v.thumbnail}" alt="${v.title}" loading="lazy">
                      <div class="video-info">
                        <div class="video-title">${v.title}</div>
                        <div class="video-meta">
                          <span class="video-author">📺 ${v.author}</span>
                          <span>⏱️ ${v.duration}</span>
                        </div>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>
            ` : '<p class="no-videos">暂无 B 站相关视频</p>'}
          </div>
        `;
      }).join('')}
    </main>
    
    <footer>
      <p>数据来自 <a href="https://github.com/trending" class="bili-link" target="_blank">GitHub Trending</a> • 视频来自 <a href="https://www.bilibili.com" class="bili-link" target="_blank">Bilibili</a></p>
      <p style="margin-top: 8px;">每日自动更新 • 完全免费</p>
    </footer>
  </div>
</body>
</html>`;
}

main().catch(console.error);
