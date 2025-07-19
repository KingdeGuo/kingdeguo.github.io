/**
 * Phoenix Visualization Platform
 * 零故障微服务可视化架构
 * 作者：KingdeGuo
 * 版本：2.0.0
 */

(function() {
  'use strict';

  // ==========================
  // 配置管理
  // ==========================
  const CONFIG = {
    // 微服务配置
    services: {
      mermaid: {
        enabled: true,
        timeout: 5000,
        fallback: 'image',
        worker: '/workers/mermaid-worker.js'
      },
      echarts: {
        enabled: true,
        timeout: 8000,
        fallback: 'static',
        worker: '/workers/echarts-worker.js'
      },
      chartjs: {
        enabled: true,
        timeout: 3000,
        fallback: 'text',
        worker: '/workers/chartjs-worker.js'
      },
      plotly: {
        enabled: true,
        timeout: 10000,
        fallback: 'image',
        worker: '/workers/plotly-worker.js'
      },
      d3: {
        enabled: true,
        timeout: 6000,
        fallback: 'static',
        worker: '/workers/d3-worker.js'
      },
      three: {
        enabled: true,
        timeout: 12000,
        fallback: 'image',
        worker: '/workers/three-worker.js'
      }
    },
    
    // 降级策略
    fallbackLevels: {
      level1: 'full',      // 完整图表
      level2: 'simplified', // 简化版本
      level3: 'static',    // 静态图片
      level4: 'text',      // 文本描述
      level5: 'error'      // 错误提示
    },
    
    // 性能优化
    performance: {
      preloadDistance: 200,
      cacheTimeout: 5 * 60 * 1000,
      maxRetries: 3,
      retryDelay: 1000
    }
  };

  // ==========================
  // 健康监控服务
  // ==========================
  class HealthMonitor {
    constructor() {
      this.services = new Map();
      this.metrics = new Map();
      this.init();
    }

    init() {
      // 初始化各服务健康状态
      Object.keys(CONFIG.services).forEach(type => {
        this.services.set(type, {
          status: 'unknown',
          lastCheck: null,
          failures: 0,
          responseTime: 0
        });
      });
    }

    async checkService(type) {
      const service = CONFIG.services[type];
      const startTime = performance.now();
      
      try {
        // 模拟服务健康检查
        const check = await this.performHealthCheck(type);
        const responseTime = performance.now() - startTime;
        
        this.services.set(type, {
          status: check.success ? 'healthy' : 'unhealthy',
          lastCheck: new Date(),
          failures: check.success ? 0 : this.services.get(type).failures + 1,
          responseTime
        });
        
        return check.success;
      } catch (error) {
        this.services.set(type, {
          status: 'failed',
          lastCheck: new Date(),
          failures: this.services.get(type).failures + 1,
          responseTime: performance.now() - startTime
        });
        return false;
      }
    }

    async performHealthCheck(type) {
      // 实际项目中这里会调用真实的服务检查
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: Math.random() > 0.1 }); // 90%成功率模拟
        }, 100);
      });
    }

    getServiceStatus(type) {
      return this.services.get(type) || { status: 'unknown' };
    }

    getOverallHealth() {
      const services = Array.from(this.services.values());
      const healthy = services.filter(s => s.status === 'healthy').length;
      const total = services.length;
      
      return {
        healthy,
        total,
        percentage: Math.round((healthy / total) * 100),
        services: Object.fromEntries(this.services)
      };
    }
  }

  // ==========================
  // 故障隔离与降级系统
  // ==========================
  class FallbackRenderer {
    constructor() {
      this.strategies = new Map();
      this.initStrategies();
    }

    initStrategies() {
      // 注册降级策略
      this.strategies.set('image', this.renderAsImage.bind(this));
      this.strategies.set('static', this.renderStatic.bind(this));
      this.strategies.set('text', this.renderText.bind(this));
      this.strategies.set('error', this.renderError.bind(this));
    }

    renderAsImage(element, config) {
      return `
        <div class="phoenix-fallback phoenix-fallback-image">
          <img src="/assets/images/charts/${config.type}-placeholder.svg" 
               alt="${config.type} chart placeholder" 
               class="phoenix-fallback-img">
          <div class="phoenix-fallback-text">
            <p>图表加载中，请稍候...</p>
            <button onclick="Phoenix.retry('${config.type}')" class="phoenix-retry-btn">
              重试
            </button>
          </div>
        </div>
      `;
    }

    renderStatic(element, config) {
      return `
        <div class="phoenix-fallback phoenix-fallback-static">
          <div class="phoenix-static-chart">
            <div class="phoenix-chart-bar" style="height: 60%"></div>
            <div class="phoenix-chart-bar" style="height: 80%"></div>
            <div class="phoenix-chart-bar" style="height: 40%"></div>
          </div>
          <p class="phoenix-fallback-note">静态图表预览</p>
        </div>
      `;
    }

    renderText(element, config) {
      return `
        <div class="phoenix-fallback phoenix-fallback-text">
          <pre class="phoenix-code-block"><code>${JSON.stringify(config, null, 2)}</code></pre>
          <button onclick="Phoenix.copyCode(this)" class="phoenix-copy-btn">
            复制代码
          </button>
        </div>
      `;
    }

    renderError(element, config, error) {
      return `
        <div class="phoenix-fallback phoenix-fallback-error">
          <div class="phoenix-error-icon">⚠️</div>
          <h4>图表渲染失败</h4>
          <p class="phoenix-error-message">${error.message || '未知错误'}</p>
          <div class="phoenix-error-actions">
            <button onclick="Phoenix.retry('${config.type}')" class="phoenix-retry-btn">
              重试
            </button>
            <button onclick="Phoenix.reportError('${config.type}', '${error.message}')" class="phoenix-report-btn">
              报告问题
            </button>
          </div>
        </div>
      `;
    }

    render(level, element, config, error = null) {
      const strategy = this.strategies.get(level) || this.strategies.get('error');
      return strategy(element, config, error);
    }
  }

  // ==========================
  // 微服务渲染器
  // ==========================
  class MicroserviceRenderer {
    constructor(type, config) {
      this.type = type;
      this.config = config;
      this.healthMonitor = new HealthMonitor();
      this.fallback = new FallbackRenderer();
      this.timeout = CONFIG.services[type]?.timeout || 5000;
    }

    async render(element) {
      const startTime = performance.now();
      
      try {
        // 1. 健康检查
        const isHealthy = await this.healthMonitor.checkService(this.type);
        if (!isHealthy) {
          throw new Error(`${this.type}服务不可用`);
        }

        // 2. 尝试渲染
        const result = await this.renderWithTimeout(element);
        
        // 3. 记录成功指标
        this.recordMetrics('success', performance.now() - startTime);
        
        return result;

      } catch (error) {
        // 4. 记录失败指标
        this.recordMetrics('failure', performance.now() - startTime);
        
        // 5. 选择降级策略
        const fallbackLevel = this.selectFallbackLevel(error);
        return this.fallback.render(fallbackLevel, element, this.config, error);
      }
    }

    async renderWithTimeout(element) {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`${this.type}渲染超时`));
        }, this.timeout);

        // 模拟微服务渲染
        setTimeout(() => {
          clearTimeout(timeoutId);
          if (Math.random() > 0.1) { // 90%成功率
            resolve(this.performRender(element));
          } else {
            reject(new Error(`${this.type}渲染失败`));
          }
        }, Math.random() * 1000 + 500);
      });
    }

    performRender(element) {
      // 这里会根据不同类型调用实际的渲染逻辑
      const renderers = {
        mermaid: () => this.renderMermaid(element),
        echarts: () => this.renderECharts(element),
        chartjs: () => this.renderChartJS(element),
        plotly: () => this.renderPlotly(element),
        d3: () => this.renderD3(element),
        three: () => this.renderThree(element)
      };

      const renderer = renderers[this.type];
      return renderer ? renderer() : '<div>未知图表类型</div>';
    }

    renderMermaid(element) {
      return `<div class="phoenix-chart phoenix-mermaid">
        <div class="phoenix-chart-title">Mermaid图表</div>
        <div class="phoenix-chart-content">${this.config.code || '流程图内容'}</div>
      </div>`;
    }

    renderECharts(element) {
      return `<div class="phoenix-chart phoenix-echarts">
        <div class="phoenix-chart-title">ECharts图表</div>
        <div class="phoenix-chart-content">ECharts: ${this.config.title || '数据可视化'}</div>
      </div>`;
    }

    renderChartJS(element) {
      return `<div class="phoenix-chart phoenix-chartjs">
        <div class="phoenix-chart-title">Chart.js图表</div>
        <div class="phoenix-chart-content">Chart.js: ${this.config.type || '图表'}</div>
      </div>`;
    }

    renderPlotly(element) {
      return `<div class="phoenix-chart phoenix-plotly">
        <div class="phoenix-chart-title">Plotly图表</div>
        <div class="phoenix-chart-content">Plotly: 交互式图表</div>
      </div>`;
    }

    renderD3(element) {
      return `<div class="phoenix-chart phoenix-d3">
        <div class="phoenix-chart-title">D3.js图表</div>
        <div class="phoenix-chart-content">D3: 自定义可视化</div>
      </div>`;
    }

    renderThree(element) {
      return `<div class="phoenix-chart phoenix-three">
        <div class="phoenix-chart-title">Three.js图表</div>
        <div class="phoenix-chart-content">Three.js: 3D可视化</div>
      </div>`;
    }

    selectFallbackLevel(error) {
      const failureCount = this.healthMonitor.getServiceStatus(this.type).failures;
      
      if (failureCount >= 3) return 'error';
      if (error.message.includes('timeout')) return 'static';
      if (error.message.includes('unavailable')) return 'image';
      return 'text';
    }

    recordMetrics(status, duration) {
      const metrics = {
        type: this.type,
        status,
        duration,
        timestamp: new Date().toISOString()
      };
      
      // 发送到监控系统
      if (window.PhoenixMonitor) {
        window.PhoenixMonitor.record(metrics);
      }
    }
  }

  // ==========================
  // 智能路由器
  // ==========================
  class SmartRouter {
    constructor() {
      this.renderers = new Map();
      this.healthMonitor = new HealthMonitor();
      this.fallback = new FallbackRenderer();
    }

    async route(element) {
      const config = this.parseConfig(element);
      if (!config) return;

      const renderer = new MicroserviceRenderer(config.type, config);
      return await renderer.render(element);
    }

    parseConfig(element) {
      try {
        const chartData = element.dataset.chart;
        if (!chartData) return null;

        return JSON.parse(chartData);
      } catch (error) {
        console.error('配置解析失败:', error);
        return null;
      }
    }

    getSystemStatus() {
      return this.healthMonitor.getOverallHealth();
    }
  }

  // ==========================
  // 性能监控器
  // ==========================
  class PerformanceMonitor {
    constructor() {
      this.metrics = [];
      this.startTime = performance.now();
    }

    record(metric) {
      this.metrics.push(metric);
      
      // 保持最近100条记录
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }
    }

    getReport() {
      const recent = this.metrics.slice(-20);
      const successRate = recent.filter(m => m.status === 'success').length / recent.length * 100;
      const avgResponseTime = recent.reduce((sum, m) => sum + m.duration, 0) / recent.length;
      
      return {
        totalRequests: this.metrics.length,
        successRate: Math.round(successRate),
        avgResponseTime: Math.round(avgResponseTime),
        uptime: Math.round((performance.now() - this.startTime) / 1000),
        services: this.getServiceStats()
      };
    }

    getServiceStats() {
      const stats = {};
      const router = new SmartRouter();
      const health = router.getSystemStatus();
      
      return health;
    }
  }

  // ==========================
  // 主控制器
  // ==========================
  class PhoenixVisualization {
    constructor() {
      this.router = new SmartRouter();
      this.monitor = new PerformanceMonitor();
      this.observer = null;
      this.isInitialized = false;
    }

    async init() {
      if (this.isInitialized) return;
      
      // 初始化性能监控
      window.PhoenixMonitor = this.monitor;
      
      // 初始化Intersection Observer
      this.initObserver();
      
      // 处理现有图表
      await this.processExistingCharts();
      
      this.isInitialized = true;
      console.log('🚀 Phoenix Visualization initialized');
    }

    initObserver() {
      if (!('IntersectionObserver' in window)) {
        this.processAllCharts();
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.renderChart(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '200px',
          threshold: 0.1
        }
      );
    }

    async processExistingCharts() {
      const charts = document.querySelectorAll('[data-chart]');
      charts.forEach(chart => {
        if (this.isInViewport(chart)) {
          this.renderChart(chart);
        } else if (this.observer) {
          this.observer.observe(chart);
        }
      });
    }

    async renderChart(element) {
      if (element.dataset.rendered) return;
      
      element.dataset.rendered = 'true';
      element.classList.add('phoenix-chart-container');
      
      try {
        const result = await this.router.route(element);
        if (result) {
          element.innerHTML = result;
          element.classList.add('phoenix-chart-rendered');
        }
      } catch (error) {
        console.error('图表渲染失败:', error);
        element.innerHTML = this.router.fallback.render('error', element, {}, error);
      }
    }

    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    processAllCharts() {
      const charts = document.querySelectorAll('[data-chart]');
      charts.forEach(chart => this.renderChart(chart));
    }

    // 公共API
    retry(type) {
      console.log(`重试渲染 ${type} 图表`);
      this.processExistingCharts();
    }

    reportError(type, message) {
      console.error(`报告 ${type} 错误:`, message);
      // 这里可以发送到错误监控系统
    }

    getSystemStatus() {
      return this.router.getSystemStatus();
    }

    getPerformanceReport() {
      return this.monitor.getReport();
    }
  }

  // ==========================
  // 初始化
  // ==========================
  const phoenix = new PhoenixVisualization();

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => phoenix.init());
  } else {
    phoenix.init();
  }

  // 暴露全局API
  window.Phoenix = {
    init: () => phoenix.init(),
    retry: (type) => phoenix.retry(type),
    reportError: (type, message) => phoenix.reportError(type, message),
    getStatus: () => phoenix.getSystemStatus(),
    getReport: () => phoenix.getPerformanceReport()
  };

  // 主题切换支持
  document.addEventListener('themeChanged', () => {
    phoenix.processExistingCharts();
  });

})();
