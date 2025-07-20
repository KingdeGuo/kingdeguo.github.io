/**
 * 简化版可视化渲染引擎 v2.0
 * 轻量级、高性能的图表渲染系统
 * 
 * 特性：
 * - 模块化设计，按需加载
 * - 统一的API接口
 * - 智能错误处理
 * - 响应式支持
 * - 主题适配
 */

(function() {
  'use strict';

  // 全局配置
  const CONFIG = {
    // 库配置
    libraries: {
      echarts: {
        version: '5.4.3',
        cdn: 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
        local: '/assets/lib/echarts.min.js',
        global: 'echarts'
      },
      chartjs: {
        version: '4.4.1',
        cdn: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
        local: '/assets/lib/chart.min.js',
        global: 'Chart'
      },
      mermaid: {
        version: '10.7.0',
        cdn: 'https://cdn.jsdelivr.net/npm/mermaid@10.7.0/dist/mermaid.min.js',
        local: '/assets/lib/mermaid.min.js',
        global: 'mermaid'
      },
      plotly: {
        version: '2.27.1',
        cdn: 'https://cdn.plot.ly/plotly-2.27.1.min.js',
        local: '/assets/lib/plotly.min.js',
        global: 'Plotly'
      }
    },
    
    // 渲染配置
    rendering: {
      timeout: 10000,
      maxRetries: 3,
      retryDelay: 1000
    },
    
    // 性能配置
    performance: {
      lazyLoading: true,
      preloadCritical: true,
      cacheStrategy: 'local-first'
    }
  };

  // 资源加载器
  class ResourceLoader {
    constructor() {
      this.loadedScripts = new Set();
      this.loadingPromises = new Map();
    }

    async loadLibrary(libraryName) {
      const library = CONFIG.libraries[libraryName];
      if (!library) {
        throw new Error(`Unknown library: ${libraryName}`);
      }

      // 检查是否已加载
      if (this.loadedScripts.has(libraryName)) {
        return window[library.global];
      }

      // 检查是否正在加载
      if (this.loadingPromises.has(libraryName)) {
        return this.loadingPromises.get(libraryName);
      }

      // 开始加载
      const loadPromise = this._loadScript(library);
      this.loadingPromises.set(libraryName, loadPromise);
      
      try {
        const result = await loadPromise;
        this.loadedScripts.add(libraryName);
        this.loadingPromises.delete(libraryName);
        return result;
      } catch (error) {
        this.loadingPromises.delete(libraryName);
        throw error;
      }
    }

    async _loadScript(library) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout loading ${library.global}`));
        }, CONFIG.rendering.timeout);

        script.onload = () => {
          clearTimeout(timeoutId);
          if (window[library.global]) {
            resolve(window[library.global]);
          } else {
            reject(new Error(`${library.global} not found after loading`));
          }
        };
        
        script.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load ${library.global}`));
        };

        // 优先使用本地资源
        script.src = library.local;
        document.head.appendChild(script);
      });
    }
  }

  // 图表渲染器基类
  class ChartRenderer {
    constructor(type, loader) {
      this.type = type;
      this.loader = loader;
      this.retryCount = 0;
    }

    async render(element, config) {
      try {
        this._showLoading(element);
        const result = await this._renderWithRetry(element, config);
        this._showSuccess(element);
        return result;
      } catch (error) {
        console.error(`[${this.type}] 渲染失败:`, error);
        this._showError(element, error);
        throw error;
      }
    }

    async _renderWithRetry(element, config) {
      let lastError;
      
      for (let i = 0; i < CONFIG.rendering.maxRetries; i++) {
        try {
          return await this._doRender(element, config);
        } catch (error) {
          lastError = error;
          if (i < CONFIG.rendering.maxRetries - 1) {
            await this._delay(CONFIG.rendering.retryDelay * (i + 1));
          }
        }
      }
      
      throw lastError;
    }

    _delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    _showLoading(element) {
      element.classList.add('loading');
    }

    _showSuccess(element) {
      element.classList.remove('loading');
      element.classList.add('success');
    }

    _showError(element, error) {
      element.classList.remove('loading');
      element.classList.add('error');
      element.setAttribute('data-error', error.message);
    }

    // 子类需要实现的方法
    async _doRender(element, config) {
      throw new Error('_doRender method must be implemented');
    }
  }

  // ECharts渲染器
  class EChartsRenderer extends ChartRenderer {
    constructor(loader) {
      super('ECharts', loader);
    }

    async _doRender(element, config) {
      const echarts = await this.loader.loadLibrary('echarts');
      
      const chart = echarts.init(element);
      
      // 设置主题
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      if (theme === 'dark') {
        chart.setOption({
          backgroundColor: 'transparent',
          textStyle: { color: '#e9ecef' }
        });
      }
      
      chart.setOption(config.options || config);
      
      // 响应式处理
      const resizeHandler = () => chart.resize();
      window.addEventListener('resize', resizeHandler);
      
      // 清理函数
      element._cleanup = () => {
        window.removeEventListener('resize', resizeHandler);
        chart.dispose();
      };
      
      return chart;
    }
  }

  // Chart.js渲染器
  class ChartJSRenderer extends ChartRenderer {
    constructor(loader) {
      super('ChartJS', loader);
    }

    async _doRender(element, config) {
      const Chart = await this.loader.loadLibrary('chartjs');
      
      // 为Chart.js创建canvas元素
      const canvas = document.createElement('canvas');
      element.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, config);
      
      // 响应式处理
      const resizeHandler = () => chart.resize();
      window.addEventListener('resize', resizeHandler);
      
      // 清理函数
      element._cleanup = () => {
        window.removeEventListener('resize', resizeHandler);
        chart.destroy();
      };
      
      return chart;
    }
  }

  // Mermaid渲染器
  class MermaidRenderer extends ChartRenderer {
    constructor(loader) {
      super('Mermaid', loader);
    }

    async _doRender(element, config) {
      const mermaid = await this.loader.loadLibrary('mermaid');
      
      // 配置Mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.getAttribute('data-theme') || 'default',
        flowchart: { useMaxWidth: true, htmlLabels: true },
        sequence: { useMaxWidth: true, wrap: true },
        gantt: { useMaxWidth: true }
      });

      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      element.id = id;
      
      const { svg } = await mermaid.render(id, config.code || config.mermaid || '');
      element.innerHTML = svg;
      
      return svg;
    }
  }

  // Plotly渲染器
  class PlotlyRenderer extends ChartRenderer {
    constructor(loader) {
      super('Plotly', loader);
    }

    async _doRender(element, config) {
      const Plotly = await this.loader.loadLibrary('plotly');
      
      const layout = config.layout || {};
      const theme = document.documentElement.getAttribute('data-theme');
      
      if (theme === 'dark') {
        layout.paper_bgcolor = 'rgba(0,0,0,0)';
        layout.plot_bgcolor = 'rgba(0,0,0,0)';
        layout.font = { color: '#e9ecef' };
      }
      
      return Plotly.newPlot(element, config.data || [], layout, config.config || {});
    }
  }

  // 可视化管理器
  class VisualizationManager {
    constructor() {
      this.loader = new ResourceLoader();
      this.renderers = {
        echarts: new EChartsRenderer(this.loader),
        chartjs: new ChartJSRenderer(this.loader),
        mermaid: new MermaidRenderer(this.loader),
        plotly: new PlotlyRenderer(this.loader)
      };
      this.renderedElements = new Map();
    }

    init() {
      this._initObserver();
      this._initThemeListener();
      this._processExistingElements();
    }

    _initObserver() {
      if (!CONFIG.performance.lazyLoading) {
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this._renderElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });

      // 观察所有可视化容器
      document.querySelectorAll('[data-chart]').forEach(element => {
        observer.observe(element);
      });
    }

    _initThemeListener() {
      // 监听主题变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            this._reRenderAll();
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    _processExistingElements() {
      if (!CONFIG.performance.lazyLoading) {
        document.querySelectorAll('[data-chart]').forEach(element => {
          this._renderElement(element);
        });
      }
    }

    async _renderElement(element) {
      try {
        const config = this._parseConfig(element);
        const renderer = this.renderers[config.type];
        
        if (!renderer) {
          throw new Error(`Unknown chart type: ${config.type}`);
        }

        const result = await renderer.render(element, config);
        this.renderedElements.set(element, { renderer, result });
        
      } catch (error) {
        console.error('Failed to render element:', error);
      }
    }

    _parseConfig(element) {
      const chartData = element.getAttribute('data-chart');
      let config;
      
      try {
        config = JSON.parse(chartData);
      } catch (error) {
        console.error('Invalid chart configuration:', error);
        config = { type: 'echarts', options: {} };
      }

      // 设置默认类型
      if (!config.type) {
        config.type = 'echarts';
      }

      return config;
    }

    async _reRenderAll() {
      // 清理现有图表
      this.renderedElements.forEach(({ renderer, result }, element) => {
        if (element._cleanup) {
          element._cleanup();
        }
        element.innerHTML = '';
        element.classList.remove('success', 'error');
      });
      
      this.renderedElements.clear();

      // 重新渲染
      document.querySelectorAll('[data-chart]').forEach(element => {
        this._renderElement(element);
      });
    }

    // 公共API
    async render(type, element, config) {
      const renderer = this.renderers[type];
      if (!renderer) {
        throw new Error(`Unknown chart type: ${type}`);
      }
      
      return await renderer.render(element, config);
    }

    retry(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.classList.remove('error');
        this._renderElement(element);
      }
    }
  }

  // 全局实例
  window.VisualizationEngine = new VisualizationManager();

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.VisualizationEngine.init();
    });
  } else {
    window.VisualizationEngine.init();
  }

})(); 