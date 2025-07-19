#!/usr/bin/env node
/**
 * 可视化库下载工具
 * 下载所有图表库的本地版本，确保高可靠性
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LIBS = {
  'mermaid.min.js': 'https://cdn.jsdelivr.net/npm/mermaid@10.7.0/dist/mermaid.min.js',
  'echarts.min.js': 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
  'chart.min.js': 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'plotly.min.js': 'https://cdn.plot.ly/plotly-2.27.1.min.js',
  'd3.min.js': 'https://d3js.org/d3.v7.min.js',
  'three.min.js': 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js'
};

const TARGET_DIR = path.join(__dirname, '..', 'assets', 'lib');

// 确保目录存在
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(TARGET_DIR, filename);
    
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 1000) { // 文件大于1KB认为有效
        console.log(`✅ ${filename} 已存在，跳过下载`);
        resolve();
        return;
      }
    }

    console.log(`📥 正在下载 ${filename}...`);
    
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ ${filename} 下载完成`);
          resolve();
        });
      } else {
        reject(new Error(`下载失败: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // 删除失败文件
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('🚀 开始下载可视化库...\n');
  
  const promises = Object.entries(LIBS).map(([filename, url]) => 
    downloadFile(url, filename).catch(err => {
      console.error(`❌ ${filename} 下载失败:`, err.message);
    })
  );
  
  await Promise.all(promises);
  
  console.log('\n🎉 所有可视化库下载完成！');
  console.log(`📁 文件保存在: ${TARGET_DIR}`);
}

// 创建回退图片
function createFallbackImages() {
  const imagesDir = path.join(__dirname, '..', 'assets', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 创建简单的SVG回退图片
  const createSVG = (text, filename) => {
    const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#6c757d">
        ${text}
      </text>
    </svg>`;
    
    fs.writeFileSync(path.join(imagesDir, filename), svg);
    console.log(`✅ 创建回退图片: ${filename}`);
  };

  createSVG('Mermaid图表加载失败', 'mermaid-fallback.png');
  createSVG('ECharts图表加载失败', 'echarts-fallback.png');
  createSVG('Chart.js图表加载失败', 'chartjs-fallback.png');
  createSVG('Plotly图表加载失败', 'plotly-fallback.png');
}

// 执行下载
if (require.main === module) {
  downloadAll().then(() => {
    createFallbackImages();
    console.log('\n✨ 所有任务完成！');
  }).catch(err => {
    console.error('❌ 下载过程出错:', err);
    process.exit(1);
  });
}

module.exports = { downloadAll, createFallbackImages };
