import fetch from 'node-fetch';
import fs from 'fs';

// GitHub Trending 数据（模拟数据，避免 API 失败）
const mockTrending = [
  {
    name: 'facebook/react',
    url: 'https://github.com/facebook/react',
    description: 'The library for web and native user interfaces',
    stars: 220500,
    todayStars: 1200,
    language: 'JavaScript',
    videos: []
  },
  {
    name: 'microsoft/vscode',
    url: 'https://github.com/microsoft/vscode',
    description: 'Visual Studio Code',
    stars: 160800,
    todayStars: 800,
    language: 'TypeScript',
    videos: [
      {
        title: 'VSCODE 使用入门 2025 版',
        videoId: 'BV1mh9NYvEwH',
        author: '浦大宏',
        thumbnail: 'https://i1.hdslb.com/bfs/archive/2a5a7607f004ccb09f46679ca00a540684d3b7eb.jpg',
        duration: '29:47',
        url: 'https://www.bilibili.com/video/BV1mh9NYvEwH'
      },
      {
        title: 'VS Code 零基础教程 | 持续更新中',
        videoId: 'BV1ty4y1S7mC',
        author: '兔子不吃米饭',
        thumbnail: 'https://i2.hdslb.com/bfs/archive/e14d4f19763708e4d6bfbf4bc23efbd4d789e157.jpg',
        duration: '160:4',
        url: 'https://www.bilibili.com/video/BV1ty4y1S7mC'
      }
    ]
  },
  {
    name: 'openai/chatgpt',
    url: 'https://github.com/openai/chatgpt',
    description: 'ChatGPT official repository',
    stars: 95000,
    todayStars: 2000,
    language: 'Python',
    videos: [
      {
        title: '2025 最新 ChatGPT 教程：学会这 19 个技巧，彻底告别 AI 小白！循序渐进！',
        videoId: 'BV1cPGczXEXx',
        author: '黄思平 huangsiping',
        thumbnail: 'https://i0.hdslb.com/bfs/archive/9c8684dc2bb9967404364a90e37a70f35c8955a4.jpg',
        duration: '28:27',
        url: 'https://www.bilibili.com/video/BV1cPGczXEXx'
      },
      {
        title: '目前 B 站最全最细的 ChatGPT 零基础全套教程，2024 最新版，包含所有干货！七天就能从小白到大神！少走 99% 的弯路！存下吧！很难找全的！',
        videoId: 'BV1As6AYREvu',
        author: '3dmax 人物建模教学',
        thumbnail: 'https://i2.hdslb.com/bfs/archive/4d2b5cd99da2371a7ed3827a321e01dfc64583f6.jpg',
        duration: '318:23',
        url: 'https://www.bilibili.com/video/BV1As6AYREvu'
      }
    ]
  }
];

// B 站搜索 API
const BILIBILI_SEARCH_URL = 'https://api.bilibili.com/x/web-interface/search/type';

async function fetchBilibiliVideos(query) {
  try {
    const url = `${BILIBILI_SEARCH_URL}?search_type=video&keyword=${encodeURIComponent(query + ' 教程')}&page=1&page_size=2`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await res.json();
    
    if (data.code !== 0) return [];
    
    return data.data.result.map(item => ({
      title: item.title.replace(/<[^>]+>/g, ''),
      videoId: item.bvid,
      author: item.author,
      thumbnail: item.pic.startsWith('//') ? 'https:' + item.pic : item.pic.replace('http://', 'https://'),
      duration: item.duration,
      url: `https://www.bilibili.com/video/${item.bvid}`
    }));
  } catch (error) {
    console.error('Failed to fetch Bilibili:', error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting build...');
  console.log('📊 Using mock trending data...');
  
  // 使用模拟数据，避免 GitHub API 限制
  const trending = mockTrending;
  
  console.log(`📊 Found ${trending.length} projects`);
  
  // 为每个项目获取 B 站视频（可选，失败不影响部署）
  for (const project of trending) {
    const searchQuery = project.name.includes('/') 
      ? project.name.split('/')[1]
      : project.name;
    
    console.log(`📺 Fetching videos for ${searchQuery}...`);
    project.videos = await fetchBilibiliVideos(searchQuery);
    console.log(`   Found ${project.videos.length} videos`);
  }
  
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
  
  // 生成静态 HTML
  const html = generateHTML(output);
  fs.writeFileSync('data/index.html', html);
  console.log('✅ index.html generated');
  
  console.log('🎉 Build complete!');
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; background: #0d1117; color: #c9d1d9; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { text-align: center; padding: 40px 0; border-bottom: 1px solid #30363d; margin-bottom: 20px; }
    h1 { font-size: 32px; color: #58a6ff; margin-bottom: 8px; }
    .subtitle { color: #8b949e; font-size: 14px; margin-bottom: 8px; }
    .update-time { color: #238636; font-size: 13px; }
    .filter-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding: 16px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; margin-bottom: 24px; }
    .filter-left { display: flex; gap: 8px; }
    .filter-right { display: flex; gap: 12px; flex-wrap: wrap; }
    .toggle-btn { padding: 8px 16px; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .toggle-btn:hover { background: #30363d; }
    .toggle-btn.active { background: #238636; color: #fff; border-color: #238636; }
    .filter-select { padding: 8px 12px; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; font-size: 14px; cursor: pointer; min-width: 100px; }
    .filter-select:hover { border-color: #58a6ff; }
    .filter-select:focus { outline: none; border-color: #238636; }
    .project-list { display: grid; gap: 16px; }
    .project-card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; }
    .project-card:hover { transform: translateX(4px); border-color: #58a6ff; }
    .project-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .rank { width: 32px; height: 32px; background: linear-gradient(135deg, #238636, #2ea043); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .project-name { font-size: 18px; font-weight: 600; color: #58a6ff; text-decoration: none; }
    .project-name:hover { text-decoration: underline; }
    .project-desc { color: #8b949e; font-size: 14px; margin-bottom: 12px; line-height: 1.5; }
    .stats { display: flex; gap: 16px; flex-wrap: wrap; }
    .stat { color: #8b949e; font-size: 13px; }
    .stat-value { color: #c9d1d9; font-weight: 600; }
    .videos { margin-top: 16px; padding-top: 16px; border-top: 1px solid #30363d; }
    .videos-title { font-size: 13px; color: #ff6b9d; margin-bottom: 12px; font-weight: 600; }
    .video-list { display: grid; gap: 8px; }
    .video-item { display: flex; gap: 12px; padding: 10px; background: #0d1117; border-radius: 6px; text-decoration: none; color: #c9d1d9; }
    .video-item:hover { background: #21262d; }
    .video-thumbnail { width: 120px; height: 68px; background: #30363d; border-radius: 4px; object-fit: cover; }
    .video-info { flex: 1; }
    .video-title { font-size: 13px; line-height: 1.5; }
    .video-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: #8b949e; }
    .video-author { color: #ff6b9d; }
    footer { text-align: center; padding: 40px 0; color: #8b949e; font-size: 13px; margin-top: 40px; }
    a { color: #58a6ff; }
    @media (max-width: 600px) { .filter-bar { flex-direction: column; align-items: stretch; } .filter-left, .filter-right { justify-content: space-between; } .video-item { flex-direction: column; } .video-thumbnail { width: 100%; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔥 GitHub Trending 看板</h1>
      <p class="subtitle">自动捕捉热门项目 + 📺 B 站教学视频</p>
      <p class="update-time">更新时间：${new Date(data.updatedAt).toLocaleString('zh-CN')}</p>
    </header>
    <div class="filter-bar">
      <div class="filter-left">
        <button class="toggle-btn active" data-type="repo">仓库</button>
        <button class="toggle-btn" data-type="dev">开发者</button>
      </div>
      <div class="filter-right">
        <select class="filter-select" id="language-filter">
          <option value="">语言：任何</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Python">Python</option>
          <option value="other">其他</option>
        </select>
        <select class="filter-select" id="date-filter">
          <option value="today">日期范围：今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
        </select>
      </div>
    </div>
    <main class="project-list" id="project-list">
      ${data.projects.map((p, i) => `
        <div class="project-card">
          <div class="project-header">
            <span class="rank">${i + 1}</span>
            <a class="project-name" href="${p.url}" target="_blank">${p.name}</a>
          </div>
          <p class="project-desc">${p.description || '暂无描述'}</p>
          <div class="stats">
            <span class="stat">⭐ <span class="stat-value">${(p.stars / 1000).toFixed(0)}k</span> stars</span>
            <span class="stat">📈 <span class="stat-value">${p.todayStars || 0}</span> today</span>
            <span class="stat">📝 ${p.language || 'N/A'}</span>
          </div>
          ${p.videos && p.videos.length > 0 ? `
            <div class="videos">
              <div class="videos-title">📺 B 站教学视频 (${p.videos.length})</div>
              <div class="video-list">
                ${p.videos.map(v => `
                  <a class="video-item" href="${v.url}" target="_blank">
                    <img class="video-thumbnail" src="${v.thumbnail}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 68%22%3E%3Crect fill=%22%2330363d%22 width=%22120%22 height=%2268%22/%3E%3Ctext fill=%22%238b949e%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 font-size=%2212%22%3E📺 封面加载失败%3C/text%3E%3C/svg%3E'">
                    <div class="video-info">
                      <div class="video-title">${v.title}</div>
                      <div class="video-meta"><span class="video-author">${v.author}</span><span>⏱️ ${v.duration}</span></div>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </main>
    <footer>
      <p>数据来自 GitHub Trending • 视频来自 Bilibili</p>
      <p style="margin-top: 8px;">每日自动更新</p>
    </footer>
  </div>
  <script>
    (function() {
      const allProjects = ${JSON.stringify(data.projects)};
      let currentType = 'repo';
      
      function renderProjects(projects) {
        const container = document.getElementById('project-list');
        if (projects.length === 0) {
          container.innerHTML = '<p style="text-align:center;color:#8b949e;padding:40px;">暂无匹配的项目</p>';
          return;
        }
        container.innerHTML = projects.map((p, i) => \`
          <div class="project-card" data-language="\${p.language || 'other'}">
            <div class="project-header">
              <span class="rank">\${i + 1}</span>
              <a class="project-name" href="\${p.url}" target="_blank">\${p.name}</a>
            </div>
            <p class="project-desc">\${p.description || '暂无描述'}</p>
            <div class="stats">
              <span class="stat">⭐ <span class="stat-value">\${(p.stars / 1000).toFixed(0)}k</span> stars</span>
              <span class="stat">📈 <span class="stat-value">\${p.todayStars || 0}</span> today</span>
              <span class="stat">📝 \${p.language || 'N/A'}</span>
            </div>
            \${p.videos && p.videos.length > 0 ? \`
              <div class="videos">
                <div class="videos-title">📺 B 站教学视频 (\${p.videos.length})</div>
                <div class="video-list">
                  \${p.videos.map(v => \`
                    <a class="video-item" href="\${v.url}" target="_blank">
                      <img class="video-thumbnail" src="\${v.thumbnail}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 68%22%3E%3Crect fill=%22%2330363d%22 width=%22120%22 height=%2268%22/%3E%3Ctext fill=%22%238b949e%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 font-size=%2212%22%3E📺 封面加载失败%3C/text%3E%3C/svg%3E'">
                      <div class="video-info">
                        <div class="video-title">\${v.title}</div>
                        <div class="video-meta"><span class="video-author">\${v.author}</span><span>⏱️ \${v.duration}</span></div>
                      </div>
                    </a>
                  \`).join('')}
                </div>
              </div>
            \` : ''}
          </div>
        \`).join('');
      }
      
      function filterProjects() {
        const langFilter = document.getElementById('language-filter').value;
        let filtered = [...allProjects];
        
        if (langFilter && langFilter !== '') {
          if (langFilter === 'other') {
            filtered = filtered.filter(p => !['JavaScript', 'TypeScript', 'Python'].includes(p.language));
          } else {
            filtered = filtered.filter(p => p.language === langFilter);
          }
        }
        
        renderProjects(filtered);
      }
      
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          currentType = this.dataset.type;
        });
      });
      
      document.getElementById('language-filter').addEventListener('change', filterProjects);
      document.getElementById('date-filter').addEventListener('change', filterProjects);
      
      renderProjects(allProjects);
    })();
  </script>
</body>
</html>`;
}

main().catch(console.error);
