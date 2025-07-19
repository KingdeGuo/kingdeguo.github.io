/**
 * 主要JavaScript功能
 * 替代有问题的main.min.js
 */

(function() {
  'use strict';

  // 等待DOM加载完成
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // 首页动画效果
  function initHomeAnimations() {
    // 数字动画
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
      statNumbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target')) || 0;
        animateNumber(number, target);
      });
    }

    // 3D卡片动画
    const cards = document.querySelectorAll('.card-3d');
    if (cards.length > 0) {
      cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-in');
      });
    }

    // 滚动动画
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.featured-card, .category-card, .skill-category');
    if (animatedElements.length > 0) {
      animatedElements.forEach(el => observer.observe(el));
    }
  }

  // 数字动画函数
  function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 30);
  }

  // 平滑滚动
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // 主题切换功能
  function initThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle, .theme-switcher button');
    if (!themeToggle) return;

    // 检查本地存储的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // 搜索功能
  function initSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    if (!searchInput || !searchResults) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    // 点击外部关闭搜索结果
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  // 执行搜索
  function performSearch(query) {
    // 这里可以集成实际的搜索功能
    // 目前只是示例
    const searchResults = document.querySelector('#search-results');
    searchResults.innerHTML = `
      <div class="search-result-item">
        <div class="search-result-title">搜索: ${query}</div>
        <div class="search-result-snippet">正在开发中...</div>
      </div>
    `;
    searchResults.style.display = 'block';
  }

  // 返回顶部功能
  function initBackToTop() {
    const backToTop = document.querySelector('#back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.style.display = 'block';
      } else {
        backToTop.style.display = 'none';
      }
    });

    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 图片懒加载
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazyload');
            img.classList.add('lazyloaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // 回退方案
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazyload');
        img.classList.add('lazyloaded');
      });
    }
  }

  // 移动端菜单
  function initMobileMenu() {
    const menuToggle = document.querySelector('.greedy-nav__toggle');
    const hiddenLinks = document.querySelector('.hidden-links');
    
    if (!menuToggle || !hiddenLinks) return;

    menuToggle.addEventListener('click', function() {
      hiddenLinks.classList.toggle('hidden');
      this.classList.toggle('close');
    });
  }

  // 初始化函数
  function init() {
    initLazyLoading(); // 首先初始化懒加载，避免图片加载影响动画
    initHomeAnimations(); // 首页动画
    initSmoothScroll(); // 平滑滚动
    initThemeToggle(); // 主题切换
    initSearch(); // 搜索功能
    initBackToTop(); // 返回顶部
    initMobileMenu(); // 移动端菜单
  }

  // 确保DOM加载完成后初始化
  ready(init);

  // 导出到全局
  window.MainJS = {
    init: init,
    initHomeAnimations: initHomeAnimations,
    initSmoothScroll: initSmoothScroll,
    initThemeToggle: initThemeToggle,
    initSearch: initSearch,
    initBackToTop: initBackToTop,
    initLazyLoading: initLazyLoading,
    initMobileMenu: initMobileMenu
  };

})(); 