/**
 * 可视化图表渲染优化脚本
 * 支持 Mermaid、ECharts、Chart.js、Plotly、D3.js、Three.js
 * 优化版本：提升渲染速度和用户体验
 */

(function() {
  'use strict';

  // 配置选项
  const CONFIG = {
    // 渲染延迟，避免阻塞页面加载
    renderDelay: 100,
    // 懒加载阈值
    lazyLoadThreshold: 0.1,
    // 缓存时间（毫秒）
    cacheTimeout: 5 * 60 * 1000,
    // 预加载距离
    preloadDistance: 200,
    // 重试次数
    maxRetries: 3
  };

  // 缓存系统
  const cache = new Map();
  const renderQueue = [];
  let isRendering = false;

  // 工具函数
  const utils = {
    // 防抖函数
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // 检查元素是否在视口中
    isInViewport(element, threshold = 0) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
      );
    },

    // 获取主题
    getTheme() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    // 清理缓存
    cleanCache() {
      const now = Date.now();
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > CONFIG.cacheTimeout) {
          cache.delete(key);
        }
      }
    },

    // 生成缓存键
    generateCacheKey(element, type) {
      const content = element.getAttribute('data-option') || 
                     element.getAttribute('data-config') || 
                     element.getAttribute('data-plotly-data') || 
                     element.textContent;
      // 使用 encodeURIComponent 替代 btoa 避免中文编码问题
      return `${type}_${utils.getTheme()}_${encodeURIComponent(content).slice(0, 50)}`;
    }
  };

  // 图表渲染器基类
  class ChartRenderer {
    constructor() {
      this.initialized = false;
      this.initPromise = null;
    }

    async init() {
      if (this.initialized) return;
      if (this.initPromise) return this.initPromise;

      this.initPromise = this.doInit();
      await this.initPromise;
      this.initialized = true;
    }

    async doInit() {
      // 子类实现
    }

    async render(element) {
      await this.init();
      const cacheKey = utils.generateCacheKey(element, this.constructor.name);
      
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CONFIG.cacheTimeout) {
          element.innerHTML = cached.html;
          return;
        }
      }

      try {
        const result = await this.doRender(element);
        cache.set(cacheKey, {
          html: element.innerHTML,
          timestamp: Date.now()
        });
        return result;
      } catch (error) {
        console.error(`渲染失败 (${this.constructor.name}):`, error);
        this.showError(element, error);
      }
    }

    async doRender(element) {
      // 子类实现
    }

    showError(element, error) {
      element.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666; background: #f8f9fa; border-radius: 8px;">
          <div style="font-size: 2em; margin-bottom: 10px;">📊</div>
          <div>图表加载失败</div>
          <div style="font-size: 0.9em; margin-top: 5px;">${error.message}</div>
        </div>
      `;
    }
  }

  // Mermaid 渲染器
  class MermaidRenderer extends ChartRenderer {
    async doInit() {
      if (typeof mermaid === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/mermaid@10.7.0/dist/mermaid.min.js');
      }
      
      mermaid.initialize({
        startOnLoad: false,
        theme: utils.getTheme() === 'dark' ? 'dark' : 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true,
          wrap: true
        },
        gantt: {
          useMaxWidth: true
        },
        journey: {
          useMaxWidth: true
        },
        gitGraph: {
          useMaxWidth: true
        },
        pie: {
          useMaxWidth: true
        },
        er: {
          useMaxWidth: true
        },
        class: {
          useMaxWidth: true
        },
        state: {
          useMaxWidth: true
        }
      });
    }

    async doRender(element) {
      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      element.id = id;
      
      return new Promise((resolve, reject) => {
        mermaid.render(id, element.textContent, (svgCode) => {
          element.innerHTML = svgCode;
          resolve();
        }, (error) => {
          reject(error);
        });
      });
    }
  }

  // ECharts 渲染器
  class EChartsRenderer extends ChartRenderer {
    async doInit() {
      if (typeof echarts === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js');
      }
    }

    async doRender(element) {
      const option = JSON.parse(element.getAttribute('data-option'));
      
      // 主题适配
      if (utils.getTheme() === 'dark') {
        option.backgroundColor = 'transparent';
        if (option.textStyle) {
          option.textStyle.color = '#e2e8f0';
        }
      }

      const chart = echarts.init(element, utils.getTheme() === 'dark' ? 'dark' : null);
      chart.setOption(option);
      
      // 响应式处理
      window.addEventListener('resize', utils.debounce(() => {
        chart.resize();
      }, 100));
    }
  }

  // Chart.js 渲染器
  class ChartJsRenderer extends ChartRenderer {
    async doInit() {
      if (typeof Chart === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
      }
      
      // 全局配置
      Chart.defaults.color = utils.getTheme() === 'dark' ? '#e2e8f0' : '#666';
      Chart.defaults.borderColor = utils.getTheme() === 'dark' ? '#4a5568' : '#e0e0e0';
    }

    async doRender(element) {
      const config = JSON.parse(element.getAttribute('data-config'));
      const canvas = document.createElement('canvas');
      element.appendChild(canvas);
      
      new Chart(canvas, config);
    }
  }

  // Plotly 渲染器
  class PlotlyRenderer extends ChartRenderer {
    async doInit() {
      if (typeof Plotly === 'undefined') {
        await this.loadScript('https://cdn.plot.ly/plotly-latest.min.js');
      }
    }

    async doRender(element) {
      const data = JSON.parse(element.getAttribute('data-plotly-data'));
      const layout = JSON.parse(element.getAttribute('data-plotly-layout') || '{}');
      
      // 主题适配
      if (utils.getTheme() === 'dark') {
        layout.paper_bgcolor = 'transparent';
        layout.plot_bgcolor = 'transparent';
        layout.font = { color: '#e2e8f0' };
      }

      Plotly.newPlot(element, data, layout, { responsive: true });
    }
  }

  // D3.js 渲染器
  class D3Renderer extends ChartRenderer {
    async doInit() {
      if (typeof d3 === 'undefined') {
        await this.loadScript('https://d3js.org/d3.v7.min.js');
      }
    }

    async doRender(element) {
      // 基础 D3 图表示例
      const data = [10, 20, 30, 40, 50];
      const width = element.offsetWidth;
      const height = 200;
      
      const svg = d3.select(element)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      
      const bars = svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * (width / data.length))
        .attr('y', d => height - d * 3)
        .attr('width', width / data.length - 2)
        .attr('height', d => d * 3)
        .attr('fill', '#667eea');
    }
  }

  // Three.js 渲染器
  class ThreeRenderer extends ChartRenderer {
    async doInit() {
      if (typeof THREE === 'undefined') {
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
      }
    }

    async doRender(element) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, element.offsetWidth / element.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      
      renderer.setSize(element.offsetWidth, element.offsetHeight);
      element.appendChild(renderer.domElement);
      
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x667eea });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      
      camera.position.z = 5;
      
      function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    }
  }

  // 脚本加载器
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 渲染管理器
  class RenderManager {
    constructor() {
      this.renderers = {
        'mermaid': new MermaidRenderer(),
        'echarts-container': new EChartsRenderer(),
        'chartjs-container': new ChartJsRenderer(),
        'plotly-chart': new PlotlyRenderer(),
        'd3-chart': new D3Renderer(),
        'three-chart': new ThreeRenderer()
      };
      
      this.observer = null;
      this.init();
    }

    init() {
      // 初始化 Intersection Observer
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.renderElement(entry.target);
                this.observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: `${CONFIG.preloadDistance}px`,
            threshold: CONFIG.lazyLoadThreshold
          }
        );
      }

      // 定期清理缓存
      setInterval(() => utils.cleanCache(), CONFIG.cacheTimeout);

      // 主题切换时重新渲染
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            this.reRenderAll();
          }
        });
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    async renderElement(element) {
      const className = Array.from(element.classList).find(cls => 
        this.renderers[cls]
      );
      
      if (!className || element.dataset.rendered) return;
      
      element.dataset.rendered = 'true';
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.3s ease';
      
      try {
        await this.renderers[className].render(element);
        element.style.opacity = '1';
      } catch (error) {
        console.error('渲染失败:', error);
        element.style.opacity = '1';
      }
    }

    async reRenderAll() {
      // 清除所有已渲染标记
      document.querySelectorAll('[data-rendered]').forEach(el => {
        delete el.dataset.rendered;
      });
      
      // 重新渲染可见元素
      const elements = document.querySelectorAll('.mermaid, .echarts-container, .chartjs-container, .plotly-chart, .d3-chart, .three-chart');
      elements.forEach(element => {
        if (utils.isInViewport(element, 0.1)) {
          this.renderElement(element);
        } else {
          this.observer.observe(element);
        }
      });
    }

    startObserving() {
      const elements = document.querySelectorAll('.mermaid, .echarts-container, .chartjs-container, .plotly-chart, .d3-chart, .three-chart');
      elements.forEach(element => {
        if (utils.isInViewport(element, 0.1)) {
          // 立即渲染可见元素
          setTimeout(() => this.renderElement(element), CONFIG.renderDelay);
        } else {
          // 观察不可见元素
          this.observer.observe(element);
        }
      });
    }
  }

  // 初始化渲染管理器
  let renderManager = null;

  function initVisualization() {
    if (renderManager) return;
    
    renderManager = new RenderManager();
    
    // 延迟启动观察，确保页面完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => renderManager.startObserving(), CONFIG.renderDelay);
      });
    } else {
      setTimeout(() => renderManager.startObserving(), CONFIG.renderDelay);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualization);
  } else {
    initVisualization();
  }

  // 暴露全局函数供外部调用
  window.VisualizationManager = {
    reRender: () => renderManager?.reRenderAll(),
    renderElement: (element) => renderManager?.renderElement(element)
  };

})();