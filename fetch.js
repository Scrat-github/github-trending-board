import fetch from 'node-fetch';

const GITHUB_TRENDING_URL = 'https://github-trending-api.now.sh/repositories';

async function fetchGitHubTrending() {
  try {
    const res = await fetch(GITHUB_TRENDING_URL);
    const data = await res.json();
    return data.slice(0, 10); // 取前 10 个
  } catch (error) {
    console.error('Failed to fetch GitHub trending:', error);
    return [];
  }
}

async function fetchYouTubeVideos(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(query + ' tutorial')}&type=video&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.default.url,
      url: `https://youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    console.error('Failed to fetch YouTube:', error);
    return [];
  }
}

async function main() {
  console.log('Fetching GitHub trending...');
  const trending = await fetchGitHubTrending();
  
  // 为每个项目获取相关视频
  for (const project of trending) {
    console.log(`Fetching videos for ${project.name}...`);
    project.videos = await fetchYouTubeVideos(project.name);
  }
  
  // 保存数据
  const fs = await import('fs');
  fs.writeFileSync('data/trending.json', JSON.stringify({
    updatedAt: new Date().toISOString(),
    projects: trending
  }, null, 2));
  
  console.log('Done!');
}

main();
