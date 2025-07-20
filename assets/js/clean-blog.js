/**
 * KingdeGuo's Blog - 简洁优雅的JavaScript系统
 * 修复错误，确保功能完整
 */

// 配置
const CONFIG = {
  theme: {
    storageKey: 'blog-theme',
    default: 'light'
  },
  performance: {
    debounceDelay: 150,
    throttleDelay: 100
  }
};

// 工具函数
const Utils = {
  // 防抖
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

  // 节流
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // 获取当前主题
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || CONFIG.theme.default;
  },

  // 设置主题
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.theme.storageKey, theme);
  },

  // 切换主题
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }
};

// 主题管理器
class ThemeManager {
  constructor() {
    this.currentTheme = Utils.getCurrentTheme();
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupSystemThemeListener();
    this.applyTheme(this.currentTheme);
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const newTheme = Utils.toggleTheme();
        this.applyTheme(newTheme);
        this.updateToggleIcon(newTheme);
      });
    }
  }

  setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (!localStorage.getItem(CONFIG.theme.storageKey)) {
          const newTheme = e.matches ? 'dark' : 'light';
          Utils.setTheme(newTheme);
          this.applyTheme(newTheme);
        }
      });
    }
  }

  applyTheme(theme) {
    // 触发主题变化事件
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  updateToggleIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icons = themeToggle.querySelectorAll('i');
      icons.forEach(icon => {
        icon.style.display = icon.classList.contains(theme === 'light' ? 'fa-moon' : 'fa-sun') 
          ? 'inline-block' 
          : 'none';
      });
    }
  }
}

// 滚动管理器
class ScrollManager {
  constructor() {
    this.backToTop = document.getElementById('back-to-top');
    this.lastScrollTop = 0;
    
    this.init();
  }

  init() {
    this.setupScrollListeners();
    this.setupBackToTop();
  }

  setupScrollListeners() {
    window.addEventListener('scroll', Utils.throttle(() => {
      this.handleScroll();
    }, CONFIG.performance.throttleDelay));
  }

  handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // 返回顶部按钮
    if (this.backToTop) {
      if (scrollTop > 300) {
        this.backToTop.classList.add('visible');
      } else {
        this.backToTop.classList.remove('visible');
      }
    }

    // 头部导航栏效果
    this.handleHeaderScroll(scrollTop);
    
    this.lastScrollTop = scrollTop;
  }

  handleHeaderScroll(scrollTop) {
    const header = document.querySelector('.site-header');
    if (!header) return;

    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  setupBackToTop() {
    if (this.backToTop) {
      this.backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
}

// 可视化管理器
class VisualizationManager {
  constructor() {
    this.renderedElements = new Map();
    this.init();
  }

  init() {
    this.setupObserver();
    this.setupThemeListener();
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderElement(entry.target);
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

  setupThemeListener() {
    // 监听主题变化
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
    try {
      element.classList.add('loading');
      
      const config = this.parseConfig(element);
      const result = await this.renderChart(element, config);
      
      this.renderedElements.set(element, { config, result });
      element.classList.remove('loading');
      element.classList.add('success');
      
    } catch (error) {
      console.error('Failed to render element:', error);
      element.classList.remove('loading');
      element.classList.add('error');
      element.setAttribute('data-error', error.message);
    }
  }

  parseConfig(element) {
    const chartData = element.getAttribute('data-chart');
    let config;
    
    try {
      config = JSON.parse(chartData);
    } catch (error) {
      console.error('Invalid chart configuration:', error);
      config = { type: 'echarts', options: {} };
    }

    if (!config.type) {
      config.type = 'echarts';
    }

    return config;
  }

  async renderChart(element, config) {
    switch (config.type) {
      case 'echarts':
        return await this.renderECharts(element, config);
      case 'chartjs':
        return await this.renderChartJS(element, config);
      case 'mermaid':
        return await this.renderMermaid(element, config);
      case 'plotly':
        return await this.renderPlotly(element, config);
      default:
        throw new Error(`Unknown chart type: ${config.type}`);
    }
  }

  async renderECharts(element, config) {
    const echarts = await this.loadLibrary('echarts');
    const chart = echarts.init(element);
    
    // 主题适配
    const theme = Utils.getCurrentTheme();
    if (theme === 'dark') {
      config.options.backgroundColor = 'transparent';
      if (config.options.textStyle) {
        config.options.textStyle.color = '#e2e8f0';
      }
    }
    
    chart.setOption(config.options);
    
    // 响应式处理
    const resizeHandler = Utils.debounce(() => chart.resize(), 100);
    window.addEventListener('resize', resizeHandler);
    
    return chart;
  }

  async renderChartJS(element, config) {
    const Chart = await this.loadLibrary('chartjs');
    
    // 为Chart.js创建canvas元素
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, config);
    
    return chart;
  }

  async renderMermaid(element, config) {
    const mermaid = await this.loadLibrary('mermaid');
    
    // 配置Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: Utils.getCurrentTheme(),
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true, wrap: true }
    });

    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
    element.id = id;
    
    const { svg } = await mermaid.render(id, config.code || config.mermaid || '');
    element.innerHTML = svg;
    
    return svg;
  }

  async renderPlotly(element, config) {
    const Plotly = await this.loadLibrary('plotly');
    
    const layout = config.layout || {};
    const theme = Utils.getCurrentTheme();
    
    if (theme === 'dark') {
      layout.paper_bgcolor = 'rgba(0,0,0,0)';
      layout.plot_bgcolor = 'rgba(0,0,0,0)';
      layout.font = { color: '#e2e8f0' };
    }
    
    return Plotly.newPlot(element, config.data || [], layout, config.config || {});
  }

  async loadLibrary(libraryName) {
    const libraries = {
      echarts: {
        url: 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
        local: '/assets/lib/echarts.min.js'
      },
      chartjs: {
        url: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
        local: '/assets/lib/chart.min.js'
      },
      mermaid: {
        url: 'https://cdn.jsdelivr.net/npm/mermaid@10.7.0/dist/mermaid.min.js',
        local: '/assets/lib/mermaid.min.js'
      },
      plotly: {
        url: 'https://cdn.plot.ly/plotly-2.27.1.min.js',
        local: '/assets/lib/plotly.min.js'
      }
    };

    const library = libraries[libraryName];
    if (!library) {
      throw new Error(`Unknown library: ${libraryName}`);
    }

    // 检查是否已加载
    if (window[libraryName]) {
      return window[libraryName];
    }

    // 加载库
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = library.local;
      script.onload = () => resolve(window[libraryName]);
      script.onerror = () => {
        // 本地加载失败，尝试CDN
        script.src = library.url;
        script.onload = () => resolve(window[libraryName]);
        script.onerror = () => reject(new Error(`Failed to load ${libraryName}`));
      };
      document.head.appendChild(script);
    });
  }

  async reRenderAll() {
    // 清理现有图表
    this.renderedElements.forEach(({ result }, element) => {
      if (result && result.destroy) {
        result.destroy();
      }
      element.innerHTML = '';
      element.classList.remove('success', 'error');
    });
    
    this.renderedElements.clear();

    // 重新渲染
    document.querySelectorAll('[data-chart]').forEach(element => {
      this.renderElement(element);
    });
  }
}

// 主应用类
class CleanBlog {
  constructor() {
    this.managers = {};
    this.init();
  }

  init() {
    // 初始化各个管理器
    this.managers.theme = new ThemeManager();
    this.managers.scroll = new ScrollManager();
    this.managers.visualization = new VisualizationManager();

    // 触发初始化完成事件
    window.dispatchEvent(new CustomEvent('blog:ready'));
    
    console.log('Clean Blog initialized successfully!');
  }
}

// 全局API
window.BlogAPI = {
  theme: {
    get: () => Utils.getCurrentTheme(),
    set: (theme) => Utils.setTheme(theme),
    toggle: () => Utils.toggleTheme()
  },
  
  scroll: {
    toTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
  }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.blogApp = new CleanBlog();
}); 