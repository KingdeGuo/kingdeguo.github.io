/**
 * KingdeGuo's Blog v3.0 - 现代化JavaScript系统
 * 统一的功能管理、性能优化和用户体验
 */

// 配置管理
const CONFIG = {
  // 主题配置
  theme: {
    default: 'light',
    storageKey: 'blog-theme',
    transitionDuration: 300
  },
  
  // 性能配置
  performance: {
    lazyLoading: true,
    intersectionThreshold: 0.1,
    debounceDelay: 150,
    throttleDelay: 100
  },
  
  // 动画配置
  animation: {
    enabled: true,
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
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
  },

  // 检查元素是否在视口中
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // 平滑滚动到元素
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
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
    document.documentElement.style.setProperty(
      '--transition-duration', 
      `${CONFIG.theme.transitionDuration}ms`
    );
    
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

// 搜索管理器
class SearchManager {
  constructor() {
    this.searchPanel = document.getElementById('search-panel');
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.searchBtn = document.querySelector('.search-btn');
    this.searchClose = document.querySelector('.search-close');
    
    this.init();
  }

  init() {
    if (!this.searchPanel) return;
    
    this.setupEventListeners();
    this.loadSearchIndex();
  }

  setupEventListeners() {
    // 搜索按钮点击
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.openSearch());
    }

    // 关闭搜索
    if (this.searchClose) {
      this.searchClose.addEventListener('click', () => this.closeSearch());
    }

    // ESC键关闭搜索
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchPanel.classList.contains('active')) {
        this.closeSearch();
      }
    });

    // 搜索输入
    if (this.searchInput) {
      this.searchInput.addEventListener('input', Utils.debounce((e) => {
        this.performSearch(e.target.value);
      }, CONFIG.performance.debounceDelay));
    }
  }

  openSearch() {
    this.searchPanel.classList.add('active');
    this.searchInput?.focus();
    document.body.style.overflow = 'hidden';
  }

  closeSearch() {
    this.searchPanel.classList.remove('active');
    document.body.style.overflow = '';
    if (this.searchInput) {
      this.searchInput.value = '';
      this.clearResults();
    }
  }

  async loadSearchIndex() {
    try {
      const response = await fetch('/search.json');
      this.searchIndex = await response.json();
    } catch (error) {
      console.warn('Failed to load search index:', error);
    }
  }

  performSearch(query) {
    if (!this.searchIndex || !query.trim()) {
      this.clearResults();
      return;
    }

    const results = this.searchIndex.filter(item => {
      const searchText = `${item.title} ${item.content}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    }).slice(0, 10);

    this.displayResults(results, query);
  }

  displayResults(results, query) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-no-results">
          <p>没有找到相关结果</p>
        </div>
      `;
      return;
    }

    const html = results.map(item => `
      <div class="search-result-item">
        <h4><a href="${item.url}">${this.highlightText(item.title, query)}</a></h4>
        <p>${this.highlightText(item.content.substring(0, 150), query)}...</p>
        <span class="search-result-meta">${item.categories?.join(', ') || ''}</span>
      </div>
    `).join('');

    this.searchResults.innerHTML = html;
  }

  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  clearResults() {
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
    }
  }
}

// 滚动管理器
class ScrollManager {
  constructor() {
    this.backToTop = document.getElementById('back-to-top');
    this.readingProgress = document.querySelector('.reading-progress-bar');
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
    
    // 阅读进度条
    if (this.readingProgress) {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      this.readingProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

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

// 动画管理器
class AnimationManager {
  constructor() {
    this.animatedElements = new Set();
    this.init();
  }

  init() {
    if (!CONFIG.animation.enabled) return;
    
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.performance.intersectionThreshold,
      rootMargin: '50px'
    });

    // 观察需要动画的元素
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

  setupScrollAnimations() {
    // 视差滚动效果
    document.querySelectorAll('[data-parallax]').forEach(el => {
      window.addEventListener('scroll', Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        el.style.transform = `translateY(${rate}px)`;
      }, CONFIG.performance.throttleDelay));
    });
  }

  animateElement(element) {
    const animationType = element.getAttribute('data-animate') || 'fade-in-up';
    
    element.style.animation = `${animationType} ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    this.animatedElements.add(element);
  }

  // 数字动画
  animateNumbers() {
    document.querySelectorAll('[data-target]').forEach(element => {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 16);
    });
  }
}

// 移动端管理器
class MobileManager {
  constructor() {
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.navbarMenu = document.querySelector('.navbar-menu');
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupTouchGestures();
  }

  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.navbarMenu) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!this.mobileMenuBtn.contains(e.target) && !this.navbarMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuBtn.classList.toggle('active');
    this.navbarMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  closeMobileMenu() {
    this.mobileMenuBtn.classList.remove('active');
    this.navbarMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  setupTouchGestures() {
    // 移动端手势支持
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // 左滑关闭移动菜单
      if (diffX > 50 && Math.abs(diffY) < 50 && this.navbarMenu?.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }
}

// 性能监控器
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureCoreWebVitals();
    this.setupErrorTracking();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoad = {
        total: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      };
      
      console.log('Page Load Metrics:', this.metrics.pageLoad);
    });
  }

  measureCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      console.log('LCP:', this.metrics.lcp);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        console.log('FID:', this.metrics.fid);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      let cls = 0;
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      this.metrics.cls = cls;
      console.log('CLS:', this.metrics.cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  setupErrorTracking() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
    });
  }
}

// 主应用类
class ModernBlog {
  constructor() {
    this.managers = {};
    this.init();
  }

  init() {
    // 初始化各个管理器
    this.managers.theme = new ThemeManager();
    this.managers.search = new SearchManager();
    this.managers.scroll = new ScrollManager();
    this.managers.animation = new AnimationManager();
    this.managers.mobile = new MobileManager();
    this.managers.performance = new PerformanceMonitor();

    // 初始化页面特定功能
    this.initPageSpecificFeatures();
    
    // 触发初始化完成事件
    window.dispatchEvent(new CustomEvent('blog:ready'));
    
    console.log('Modern Blog v3.0 initialized successfully!');
  }

  initPageSpecificFeatures() {
    const pageType = this.getPageType();
    
    switch (pageType) {
      case 'home':
        this.initHomePage();
        break;
      case 'post':
        this.initPostPage();
        break;
      case 'archive':
        this.initArchivePage();
        break;
    }
  }

  getPageType() {
    if (document.body.classList.contains('home')) return 'home';
    if (document.body.classList.contains('post')) return 'post';
    if (document.body.classList.contains('archive')) return 'archive';
    return 'default';
  }

  initHomePage() {
    // 首页特定功能
    this.managers.animation.animateNumbers();
    
    // 特色文章卡片动画
    document.querySelectorAll('.featured-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.setAttribute('data-animate', 'fade-in-up');
    });
  }

  initPostPage() {
    // 文章页面特定功能
    this.initTableOfContents();
    this.initRelatedPosts();
    this.initSocialSharing();
  }

  initArchivePage() {
    // 归档页面特定功能
    this.initFiltering();
    this.initSorting();
  }

  initTableOfContents() {
    const tocNav = document.getElementById('toc-nav');
    if (!tocNav) return;

    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
    const toc = document.createElement('ul');
    
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent;
      a.style.paddingLeft = `${(parseInt(heading.tagName[1]) - 1) * 20}px`;
      
      li.appendChild(a);
      toc.appendChild(li);
    });
    
    tocNav.appendChild(toc);
  }

  initRelatedPosts() {
    // 相关文章功能
    const relatedPostsContainer = document.getElementById('related-posts');
    if (!relatedPostsContainer) return;

    // 这里可以实现相关文章算法
    // 目前显示最新文章
    const posts = [
      { title: '相关文章1', url: '/post1', excerpt: '这是相关文章1的摘要...' },
      { title: '相关文章2', url: '/post2', excerpt: '这是相关文章2的摘要...' },
      { title: '相关文章3', url: '/post3', excerpt: '这是相关文章3的摘要...' }
    ];

    const html = posts.map(post => `
      <div class="related-post">
        <h5><a href="${post.url}">${post.title}</a></h5>
        <p>${post.excerpt}</p>
      </div>
    `).join('');

    relatedPostsContainer.innerHTML = html;
  }

  initSocialSharing() {
    // 社交分享功能
    document.querySelectorAll('.sharing-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 可以在这里添加分享统计
        console.log('Share clicked:', btn.classList[1]);
      });
    });
  }

  initFiltering() {
    // 归档页面筛选功能
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.filterPosts(filter);
      });
    });
  }

  initSorting() {
    // 归档页面排序功能
    const sortSelect = document.querySelector('[data-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        this.sortPosts(sortBy);
      });
    }
  }

  filterPosts(filter) {
    // 实现文章筛选逻辑
    console.log('Filtering posts by:', filter);
  }

  sortPosts(sortBy) {
    // 实现文章排序逻辑
    console.log('Sorting posts by:', sortBy);
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
    toTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    toElement: (element, offset) => Utils.scrollToElement(element, offset)
  },
  
  search: {
    open: () => window.blogApp?.managers.search?.openSearch(),
    close: () => window.blogApp?.managers.search?.closeSearch()
  }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.blogApp = new ModernBlog();
});

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ModernBlog,
    ThemeManager,
    SearchManager,
    ScrollManager,
    AnimationManager,
    MobileManager,
    PerformanceMonitor,
    Utils
  };
} 