/**
 * 可视化图表渲染平台
 * 支持 Mermaid, ECharts, Chart.js, Plotly, D3.js, Three.js
 * 提供统一的配置和渲染接口，提升可复用性和可维护性
 */

(function() {
  'use strict';

  // --- 配置选项 ---
  const CONFIG = {
    renderDelay: 100, // 渲染延迟，避免阻塞页面加载
    lazyLoadThreshold: 0.1, // 懒加载视口阈值
    cacheTimeout: 5 * 60 * 1000, // 缓存时间（毫秒）
    preloadDistance: 200, // 预加载距离
    maxRetries: 3, // 渲染重试次数
    retryDelayBase: 500 // 重试延迟基础值（毫秒）
  };

  // --- 缓存系统 ---
  const cache = new Map();

  // --- 工具函数 ---
  const utils = {
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

    isInViewport(element, threshold = 0) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
      );
    },

    getTheme() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    cleanCache() {
      const now = Date.now();
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > CONFIG.cacheTimeout) {
          cache.delete(key);
        }
      }
    },

    // 生成缓存键，考虑类型、主题和部分配置内容
    generateCacheKey(element, type, configContent) {
      // 使用部分配置内容生成key，避免过长
      const contentHash = encodeURIComponent(JSON.stringify(configContent).slice(0, 50));
      return `${type}_${utils.getTheme()}_${contentHash}`;
    }
  };

  // --- 图表渲染器基类 ---
  class ChartRenderer {
    constructor() {
      this.initialized = false;
      this.initPromise = null;
    }

    // 初始化图表库（如加载脚本、配置全局选项）
    async init() {
      if (this.initialized) return;
      if (this.initPromise) return this.initPromise;

      this.initPromise = this.doInit();
      await this.initPromise;
      this.initialized = true;
    }

    // 子类实现具体的初始化逻辑
    async doInit() {
      throw new Error("doInit() must be implemented by subclasses");
    }

    // 渲染图表，包含缓存和重试逻辑
    async render(element) {
      await this.init();
      
      let chartConfig;
      try {
        chartConfig = JSON.parse(element.dataset.chart);
      } catch (e) {
        console.error("Invalid chart configuration JSON:", element.dataset.chart, e);
        this.showError(element, new Error("Invalid chart configuration"));
        return;
      }

      const cacheKey = utils.generateCacheKey(element, chartConfig.type, chartConfig.options || chartConfig.code);
      
      // 检查缓存
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CONFIG.cacheTimeout) {
          element.innerHTML = cached.html;
          console.log(`Chart rendered from cache: ${chartConfig.type}`);
          return;
        }
      }

      // 实现重试机制
      for (let retry = 0; retry < CONFIG.maxRetries; retry++) {
        try {
          const result = await this.doRender(element, chartConfig);
          
          // 缓存渲染结果
          cache.set(cacheKey, {
            html: element.innerHTML,
            timestamp: Date.now()
          });
          console.log(`Chart rendered successfully: ${chartConfig.type}`);
          return result; // Success, exit loop
        } catch (error) {
          console.error(`Rendering failed (${chartConfig.type}), retry ${retry + 1}/${CONFIG.maxRetries}:`, error);
          if (retry === CONFIG.maxRetries - 1) {
            this.showError(element, error); // Show error on last retry
            throw error; // Re-throw to be caught by the outer catch if needed
          }
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelayBase * Math.pow(2, retry)));
        }
      }
    }

    // 子类实现具体的渲染逻辑，接收解析后的配置
    async doRender(element, chartConfig) {
      throw new Error("doRender() must be implemented by subclasses");
    }

    // 显示错误信息
    showError(element, error) {
      element.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666; background: #f8f9fa; border-radius: 8px;">
          <div style="font-size: 2em; margin-bottom: 10px;">📊</div>
          <div>图表加载失败</div>
          <div style="font-size: 0.9em; margin-top: 5px;">${error.message}</div>
        </div>
      `;
    }
    
    // 辅助加载脚本
    async loadScript(src) {
      if (document.querySelector(`script[src="${src}"]`)) {
        return Promise.resolve(); // Script already loaded or loading
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  }

  // --- 具体图表渲染器实现 ---

  // Mermaid 渲染器
  class MermaidRenderer extends ChartRenderer {
    async doInit() {
      await this.loadScript('https://cdn.jsdelivr.net/npm/mermaid@10.7.0/dist/mermaid.min.js');
      mermaid.initialize({
        startOnLoad: false,
        theme: utils.getTheme() === 'dark' ? 'dark' : 'default',
        // ... other mermaid configurations ...
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
        sequence: { useMaxWidth: true, wrap: true },
        gantt: { useMaxWidth: true },
        journey: { useMaxWidth: true },
        gitGraph: { useMaxWidth: true },
        pie: { useMaxWidth: true },
        er: { useMaxWidth: true },
        class: { useMaxWidth: true },
        state: { useMaxWidth: true }
      });
    }

    async doRender(element, chartConfig) {
      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      element.id = id;
      const code = chartConfig.code || element.textContent; // Get code from config or element text
      
      return new Promise((resolve, reject) => {
        mermaid.render(id, code, (svgCode) => {
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
      await this.loadScript('https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js');
    }

    async doRender(element, chartConfig) {
      const option = chartConfig.options;
      
      // 主题适配
      if (utils.getTheme() === 'dark') {
        option.backgroundColor = 'transparent';
        option.textStyle = { ...option.textStyle, color: '#e2e8f0' };
        if (option.title) option.title.textStyle = { ...option.title.textStyle, color: '#e2e8f0' };
        if (option.legend) option.legend.textStyle = { ...option.legend.textStyle, color: '#e2e8f0' };
        
        const axes = ['xAxis', 'yAxis'];
        axes.forEach(axis => {
          if (option[axis]) {
            const axisConfig = Array.isArray(option[axis]) ? option[axis] : [option[axis]];
            axisConfig.forEach(ac => {
              ac.axisLine = { ...ac.axisLine, lineStyle: { color: '#4a5568' } };
              ac.axisTick = { ...ac.axisTick, lineStyle: { color: '#4a5568' } };
              ac.axisLabel = { ...ac.axisLabel, color: '#a0aec0' };
              ac.splitLine = { ...ac.splitLine, lineStyle: { color: '#3b4557' } };
            });
          }
        });
        if (option.tooltip) {
            option.tooltip.backgroundColor = 'rgba(26, 32, 44, 0.9)';
            option.tooltip.borderColor = '#4a5568';
            option.tooltip.textStyle = { ...option.tooltip.textStyle, color: '#e2e8f0' };
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
      await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
      Chart.defaults.color = utils.getTheme() === 'dark' ? '#e2e8f0' : '#666';
      Chart.defaults.borderColor = utils.getTheme() === 'dark' ? '#4a5568' : '#e0e0e0';
    }

    async doRender(element, chartConfig) {
      const config = chartConfig.options;
      const canvas = document.createElement('canvas');
      element.appendChild(canvas);
      new Chart(canvas, config);
    }
  }

  // Plotly 渲染器
  class PlotlyRenderer extends ChartRenderer {
    async doInit() {
      await this.loadScript('https://cdn.plot.ly/plotly-latest.min.js');
    }

    async doRender(element, chartConfig) {
      const data = chartConfig.data;
      const layout = chartConfig.layout || {};
      
      if (utils.getTheme() === 'dark') {
        layout.paper_bgcolor = 'transparent';
        layout.plot_bgcolor = 'transparent';
        layout.font = { color: '#e2e8f0' };
      }

      Plotly.newPlot(element, data, layout, { responsive: true });
    }
  }

  // D3.js 渲染器 (示例)
  class D3Renderer extends ChartRenderer {
    async doInit() {
      await this.loadScript('https://d3js.org/d3.v7.min.js');
    }

    async doRender(element, chartConfig) {
      // 示例：一个简单的柱状图，配置从 chartConfig.options 获取
      const options = chartConfig.options || {};
      const data = options.data || [10, 20, 30, 40, 50];
      const width = element.offsetWidth;
      const height = options.height || 200;
      
      d3.select(element).selectAll("*").remove(); // Clear previous content

      const svg = d3.select(element)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      
      svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * (width / data.length))
        .attr('y', d => height - d * 3)
        .attr('width', width / data.length - 2)
        .attr('height', d => d * 3)
        .attr('fill', options.color || '#667eea');
    }
  }

  // Three.js 渲染器 (示例)
  class ThreeRenderer extends ChartRenderer {
    async doInit() {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    }

    async doRender(element, chartConfig) {
      const options = chartConfig.options || {};
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, element.offsetWidth / element.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      
      renderer.setSize(element.offsetWidth, element.offsetHeight);
      element.appendChild(renderer.domElement);
      
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: options.color || 0x667eea });
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

  // --- 渲染管理器 ---
  class RenderManager {
    constructor() {
      this.chartRegistry = {}; // 图表类型注册表
      this.observer = null;
      this.init();
    }

    // 注册图表渲染器
    registerRenderer(type, rendererInstance) {
      if (this.chartRegistry[type]) {
        console.warn(`Renderer for type "${type}" already registered. Overwriting.`);
      }
      this.chartRegistry[type] = rendererInstance;
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

      // 监听主题切换事件
      const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            this.reRenderAll();
          }
        });
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    // 渲染单个图表元素
    async renderElement(element) {
      if (!element.dataset.chart || element.dataset.rendered) return;
      
      try {
        const chartConfig = JSON.parse(element.dataset.chart);
        const renderer = this.chartRegistry[chartConfig.type];

        if (!renderer) {
          console.error(`No renderer found for chart type: ${chartConfig.type}`);
          this.showError(element, new Error(`Renderer not found for type: ${chartConfig.type}`));
          return;
        }

        element.dataset.rendered = 'true';
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
        
        await renderer.render(element);
        element.style.opacity = '1';
      } catch (error) {
        console.error('Error rendering element:', error);
        // Error is already handled by renderer.render, just ensure opacity is set
        element.style.opacity = '1';
      }
    }

    // 重新渲染所有图表
    async reRenderAll() {
      document.querySelectorAll('[data-chart]').forEach(el => {
        delete el.dataset.rendered; // Clear rendered status
        el.style.opacity = '0'; // Reset opacity for re-render transition
      });
      
      const elements = document.querySelectorAll('[data-chart]');
      elements.forEach(element => {
        if (utils.isInViewport(element, 0.1)) {
          this.renderElement(element);
        } else if (this.observer) {
          this.observer.observe(element);
        }
      });
    }

    // 开始观察所有图表元素
    startObserving() {
      const elements = document.querySelectorAll('[data-chart]');
      elements.forEach(element => {
        if (utils.isInViewport(element, 0.1)) {
          // 立即渲染可见元素
          setTimeout(() => this.renderElement(element), CONFIG.renderDelay);
        } else if (this.observer) {
          // 观察不可见元素
          this.observer.observe(element);
        }
      });
    }
    
    // 显示错误信息（供渲染器调用）
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

  // --- 初始化 ---
  let renderManager = null;

  function initVisualizationPlatform() {
    if (renderManager) return;
    
    renderManager = new RenderManager();
    
    // 注册所有图表渲染器
    renderManager.registerRenderer('mermaid', new MermaidRenderer());
    renderManager.registerRenderer('echarts', new EChartsRenderer());
    renderManager.registerRenderer('chartjs', new ChartJsRenderer());
    renderManager.registerRenderer('plotly', new PlotlyRenderer());
    renderManager.registerRenderer('d3', new D3Renderer());
    renderManager.registerRenderer('three', new ThreeRenderer());
    
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
    document.addEventListener('DOMContentLoaded', initVisualizationPlatform);
  } else {
    initVisualizationPlatform();
  }

  // 暴露全局接口
  window.VisualizationPlatform = {
    registerRenderer: (type, renderer) => renderManager?.registerRenderer(type, renderer),
    reRenderAll: () => renderManager?.reRenderAll(),
    renderElement: (element) => renderManager?.renderElement(element)
  };

})();
