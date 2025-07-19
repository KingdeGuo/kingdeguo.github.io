/**
 * 博客性能优化脚本
 * 包含懒加载、预加载、缓存优化等功能
 */

(function() {
  'use strict';

  // 性能配置
  const PERFORMANCE_CONFIG = {
    lazyLoadThreshold: 0.1,
    preloadDistance: 100,
    cacheTimeout: 5 * 60 * 1000, // 5分钟
    debounceDelay: 150
  };

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

    // 检查元素是否在视口中
    isInViewport(element, threshold = 0) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
      );
    },

    // 获取元素距离视口顶部的距离
    getDistanceFromTop(element) {
      const rect = element.getBoundingClientRect();
      return rect.top;
    }
  };

  // 图片懒加载
  class LazyLoader {
    constructor() {
      this.images = [];
      this.observer = null;
      this.init();
    }

    init() {
      this.images = document.querySelectorAll('img[data-src]');
      if (this.images.length === 0) return;

      // 使用 Intersection Observer API
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: '50px 0px',
            threshold: PERFORMANCE_CONFIG.lazyLoadThreshold
          }
        );

        this.images.forEach(img => this.observer.observe(img));
      } else {
        // 降级到滚动事件
        this.fallbackLazyLoad();
      }
    }

    loadImage(img) {
      const src = img.getAttribute('data-src');
      if (!src) return;

      // 预加载图片
      const tempImage = new Image();
      tempImage.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
      tempImage.src = src;
    }

    fallbackLazyLoad() {
      const checkImages = () => {
        this.images.forEach(img => {
          if (utils.isInViewport(img, 0.1)) {
            this.loadImage(img);
          }
        });
      };

      // 初始检查
      checkImages();

      // 滚动时检查
      window.addEventListener('scroll', utils.throttle(checkImages, 100));
    }
  }

  // 代码块优化
  class CodeBlockOptimizer {
    constructor() {
      this.init();
    }

    init() {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        this.optimizeCodeBlock(block);
      });
    }

    optimizeCodeBlock(block) {
      // 添加复制按钮
      this.addCopyButton(block);
      
      // 添加行号
      this.addLineNumbers(block);
      
      // 优化滚动
      this.optimizeScrolling(block);
    }

    addCopyButton(block) {
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.innerHTML = '📋';
      button.title = '复制代码';
      
      button.addEventListener('click', () => {
        this.copyToClipboard(block.textContent);
        button.innerHTML = '✅';
        button.title = '已复制';
        
        setTimeout(() => {
          button.innerHTML = '📋';
          button.title = '复制代码';
        }, 2000);
      });

      block.parentElement.style.position = 'relative';
      block.parentElement.appendChild(button);
    }

    addLineNumbers(block) {
      const lines = block.textContent.split('\n');
      if (lines.length > 10) {
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        for (let i = 1; i <= lines.length; i++) {
          const lineNumber = document.createElement('span');
          lineNumber.textContent = i;
          lineNumbers.appendChild(lineNumber);
        }
        
        block.parentElement.appendChild(lineNumbers);
      }
    }

    optimizeScrolling(block) {
      block.style.overflowX = 'auto';
      block.style.overflowY = 'auto';
      block.style.maxHeight = '400px';
    }

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    }
  }

  // 预加载优化
  class Preloader {
    constructor() {
      this.preloadedLinks = new Set();
      this.init();
    }

    init() {
      // 预加载关键资源
      this.preloadCriticalResources();
      
      // 预加载页面链接
      this.preloadPageLinks();
    }

    preloadCriticalResources() {
      const criticalResources = [
        '/assets/css/custom.css',
        '/assets/js/main.min.js'
      ];

      criticalResources.forEach(resource => {
        this.preloadResource(resource);
      });
    }

    preloadPageLinks() {
      const links = document.querySelectorAll('a[href^="/"]');
      const linkObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const link = entry.target;
              const href = link.getAttribute('href');
              if (href && !this.preloadedLinks.has(href)) {
                this.preloadPage(href);
                this.preloadedLinks.add(href);
              }
            }
          });
        },
        {
          rootMargin: `${PERFORMANCE_CONFIG.preloadDistance}px`
        }
      );

      links.forEach(link => linkObserver.observe(link));
    }

    preloadResource(url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = this.getResourceType(url);
      document.head.appendChild(link);
    }

    preloadPage(url) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    }

    getResourceType(url) {
      if (url.endsWith('.css')) return 'style';
      if (url.endsWith('.js')) return 'script';
      if (url.endsWith('.woff2')) return 'font';
      return 'fetch';
    }
  }

  // 缓存优化
  class CacheOptimizer {
    constructor() {
      this.cache = new Map();
      this.init();
    }

    init() {
      // 清理过期缓存
      this.cleanExpiredCache();
      
      // 定期清理缓存
      setInterval(() => this.cleanExpiredCache(), PERFORMANCE_CONFIG.cacheTimeout);
    }

    set(key, value, ttl = PERFORMANCE_CONFIG.cacheTimeout) {
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
        ttl
      });
    }

    get(key) {
      const item = this.cache.get(key);
      if (!item) return null;

      if (Date.now() - item.timestamp > item.ttl) {
        this.cache.delete(key);
        return null;
      }

      return item.value;
    }

    cleanExpiredCache() {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          this.cache.delete(key);
        }
      }
    }
  }

  // 性能监控
  class PerformanceMonitor {
    constructor() {
      this.metrics = {};
      this.init();
    }

    init() {
      // 监控页面加载性能
      this.monitorPageLoad();
      
      // 监控用户交互性能
      this.monitorUserInteractions();
      
      // 监控资源加载性能
      this.monitorResourceLoading();
    }

    monitorPageLoad() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          this.metrics.pageLoad = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
          };

          // 发送性能数据到分析服务
          this.sendMetrics();
        }, 0);
      });
    }

    monitorUserInteractions() {
      let lastInteraction = Date.now();
      
      const events = ['click', 'scroll', 'keydown', 'mousemove'];
      events.forEach(event => {
        document.addEventListener(event, utils.throttle(() => {
          lastInteraction = Date.now();
        }, 1000));
      });

      // 监控空闲时间
      setInterval(() => {
        const idleTime = Date.now() - lastInteraction;
        if (idleTime > 30000) { // 30秒空闲
          this.optimizeForIdle();
        }
      }, 10000);
    }

    monitorResourceLoading() {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.initiatorType === 'img' && entry.duration > 1000) {
            console.warn('Slow image load:', entry.name, entry.duration + 'ms');
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }

    optimizeForIdle() {
      // 在空闲时进行优化
      this.preloadVisibleImages();
      this.cleanupUnusedResources();
    }

    preloadVisibleImages() {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (utils.isInViewport(img, 0.5)) {
          const src = img.getAttribute('data-src');
          if (src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
          }
        }
      });
    }

    cleanupUnusedResources() {
      // 清理不需要的DOM元素
      const unusedElements = document.querySelectorAll('.lazy-load:not(.loaded)');
      if (unusedElements.length > 10) {
        // 可以在这里实现虚拟滚动或其他优化
      }
    }

    sendMetrics() {
      // 发送性能指标到分析服务
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance', {
          page_load_time: this.metrics.pageLoad?.loadComplete,
          first_paint: this.metrics.pageLoad?.firstPaint,
          first_contentful_paint: this.metrics.pageLoad?.firstContentfulPaint
        });
      }
    }
  }

  // 初始化所有优化功能
  function initPerformanceOptimizations() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initOptimizations);
    } else {
      initOptimizations();
    }
  }

  function initOptimizations() {
    // 初始化各个优化模块
    new LazyLoader();
    new CodeBlockOptimizer();
    new Preloader();
    new CacheOptimizer();
    new PerformanceMonitor();

    // 添加平滑滚动
    document.documentElement.style.scrollBehavior = 'smooth';

    // 优化字体加载
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    console.log('Performance optimizations initialized');
  }

  // 启动性能优化
  initPerformanceOptimizations();

})(); 