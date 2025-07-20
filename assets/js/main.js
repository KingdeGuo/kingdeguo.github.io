/**
 * 主JavaScript文件
 * 整合所有博客功能
 */

(function() {
  'use strict';

  // 全局配置
  const CONFIG = {
    // 动画配置
    animation: {
      duration: 300,
      easing: 'ease-in-out'
    },
    
    // 搜索配置
    search: {
      debounceDelay: 300,
      minQueryLength: 2
    },
    
    // 滚动配置
    scroll: {
      threshold: 300,
      smooth: true
    }
  };

  // 工具函数
  const Utils = {
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

    // 节流函数
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

    // 元素是否在视口中
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    // 平滑滚动
    smoothScrollTo(target, duration = 500) {
      const targetPosition = target.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = Utils.ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  };

  // 主题管理器
  const ThemeManager = {
    init() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.currentTheme = this.getCurrentTheme();
      
      this.setTheme(this.currentTheme);
      this.bindEvents();
    },

    getCurrentTheme() {
      return localStorage.getItem('theme') || 'light';
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.updateThemeIcon(theme);
      
      // 更新图表主题
      if (window.updateChartTheme) {
        window.updateChartTheme(theme);
      }
    },

    toggleTheme() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.currentTheme = newTheme;
      this.setTheme(newTheme);
    },

    updateThemeIcon(theme) {
      if (!this.themeToggle) return;
      
      const sunIcon = this.themeToggle.querySelector('.fa-sun');
      const moonIcon = this.themeToggle.querySelector('.fa-moon');
      
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    },

    bindEvents() {
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
    }
  };

  // 滚动管理器
  const ScrollManager = {
    init() {
      this.backToTop = document.getElementById('back-to-top');
      this.bindEvents();
    },

    bindEvents() {
      // 返回顶部按钮
      if (this.backToTop) {
        window.addEventListener('scroll', Utils.throttle(() => {
          this.handleScroll();
        }, 100));
        
        this.backToTop.addEventListener('click', () => {
          this.scrollToTop();
        });
      }

      // 平滑滚动到锚点
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            e.preventDefault();
            Utils.smoothScrollTo(target);
          }
        });
      });
    },

    handleScroll() {
      if (window.pageYOffset > CONFIG.scroll.threshold) {
        this.backToTop.classList.add('visible');
      } else {
        this.backToTop.classList.remove('visible');
      }
    },

    scrollToTop() {
      if (CONFIG.scroll.smooth) {
        Utils.smoothScrollTo(document.body, 500);
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  // 搜索管理器
  const SearchManager = {
    init() {
      this.searchInput = document.getElementById('search-input');
      this.searchResults = document.getElementById('search-results');
      this.bindEvents();
    },

    bindEvents() {
      if (this.searchInput) {
        this.searchInput.addEventListener('input', Utils.debounce((e) => {
          this.handleSearch(e.target.value);
        }, CONFIG.search.debounceDelay));
        
        this.searchInput.addEventListener('focus', () => {
          this.showSearchResults();
        });
        
        document.addEventListener('click', (e) => {
          if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
            this.hideSearchResults();
          }
        });
      }
    },

    async handleSearch(query) {
      if (query.length < CONFIG.search.minQueryLength) {
        this.hideSearchResults();
        return;
      }

      try {
        const results = await this.searchPosts(query);
        this.displayResults(results);
      } catch (error) {
        console.error('搜索失败:', error);
      }
    },

    async searchPosts(query) {
      // 这里可以实现实际的搜索逻辑
      // 目前返回模拟数据
      return [
        { title: '搜索结果1', url: '/post1', excerpt: '这是搜索结果1的摘要...' },
        { title: '搜索结果2', url: '/post2', excerpt: '这是搜索结果2的摘要...' }
      ];
    },

    displayResults(results) {
      if (!this.searchResults) return;
      
      this.searchResults.innerHTML = results.map(result => `
        <div class="search-result">
          <h4><a href="${result.url}">${result.title}</a></h4>
          <p>${result.excerpt}</p>
        </div>
      `).join('');
      
      this.showSearchResults();
    },

    showSearchResults() {
      if (this.searchResults) {
        this.searchResults.style.display = 'block';
      }
    },

    hideSearchResults() {
      if (this.searchResults) {
        this.searchResults.style.display = 'none';
      }
    }
  };

  // 动画管理器
  const AnimationManager = {
    init() {
      this.observeElements();
    },

    observeElements() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '50px'
        });

        // 观察需要动画的元素
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          observer.observe(el);
        });
      }
    },

    addAnimation(element, animation) {
      element.style.animation = `${animation} ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
    }
  };

  // 图片懒加载管理器
  const ImageLazyLoader = {
    init() {
      if ('IntersectionObserver' in window) {
        this.observeImages();
      } else {
        this.loadAllImages();
      }
    },

    observeImages() {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    },

    loadImage(img) {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      img.classList.add('loaded');
      
      img.addEventListener('load', () => {
        img.classList.add('fade-in');
      });
    },

    loadAllImages() {
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img);
      });
    }
  };

  // 代码高亮管理器
  const CodeHighlightManager = {
    init() {
      this.addCopyButtons();
      this.highlightCode();
    },

    addCopyButtons() {
      document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.setAttribute('aria-label', '复制代码');
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', () => {
          this.copyToClipboard(block.textContent, button);
        });
      });
    },

    async copyToClipboard(text, button) {
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = '已复制';
        button.classList.add('copied');
        
        setTimeout(() => {
          button.textContent = '复制';
          button.classList.remove('copied');
        }, 2000);
      } catch (error) {
        console.error('复制失败:', error);
        button.textContent = '复制失败';
      }
    },

    highlightCode() {
      // 这里可以集成代码高亮库
      // 例如 Prism.js 或 highlight.js
    }
  };

  // 性能监控器
  const PerformanceMonitor = {
    init() {
      this.startTime = performance.now();
      this.monitorPageLoad();
      this.monitorResources();
    },

    monitorPageLoad() {
      window.addEventListener('load', () => {
        const loadTime = performance.now() - this.startTime;
        console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
        
        // 发送性能数据到分析服务
        this.sendPerformanceData({
          type: 'page_load',
          duration: loadTime
        });
      });
    },

    monitorResources() {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource' && entry.duration > 1000) {
              console.warn(`慢资源加载: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
      }
    },

    sendPerformanceData(data) {
      // 发送性能数据到分析服务
      // 这里可以实现实际的数据发送逻辑
    }
  };

  // 主应用类
  class BlogApp {
    constructor() {
      this.modules = [
        ThemeManager,
        ScrollManager,
        SearchManager,
        AnimationManager,
        ImageLazyLoader,
        CodeHighlightManager,
        PerformanceMonitor
      ];
    }

    init() {
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.start();
        });
      } else {
        this.start();
      }
    }

    start() {
      console.log('博客应用启动中...');
      
      // 初始化所有模块
      this.modules.forEach(module => {
        if (module.init) {
          module.init();
        }
      });
      
      // 初始化可视化引擎
      if (window.VisualizationEngine) {
        window.VisualizationEngine.init();
      }
      
      console.log('博客应用启动完成');
    }
  }

  // 启动应用
  const app = new BlogApp();
  app.init();

  // 暴露全局API
  window.BlogApp = {
    Utils,
    ThemeManager,
    ScrollManager,
    SearchManager,
    AnimationManager,
    ImageLazyLoader,
    CodeHighlightManager,
    PerformanceMonitor
  };

})(); 