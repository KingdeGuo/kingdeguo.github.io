/**
 * 图片懒加载修复
 * 解决图片渲染错误和控制器注册问题
 */

(function() {
  'use strict';

  // 图片懒加载实现
  function initLazyLoading() {
    // 检查是否支持 Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // 观察所有懒加载图片
      const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 回退方案：直接加载所有图片
      const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy]');
      lazyImages.forEach(img => {
        loadImage(img);
      });
    }
  }

  // 加载图片
  function loadImage(img) {
    const src = img.dataset.src || img.dataset.lazy;
    if (!src) return;

    // 使用AbortController来管理加载
    const signal = img.controller.signal;
    
    // 如果已经有加载请求，先中止
    if (img.loadingPromise) {
      img.controller.abort();
      img.controller = new AbortController();
    }

    // 检查是否已经加载过
    if (img.src === src) {
      return;
    }

    // 确保每个图片都有自己的控制器
    if (!img.controller) {
      img.controller = new AbortController();
    }

    // 添加加载完成的类
    img.onload = () => {
      img.classList.add('loaded');
      img.setAttribute('loading', 'eager');
    };

    // 添加错误处理
    img.onerror = () => {
      console.error(`图片加载失败: ${src}`);
      img.src = '/assets/images/placeholder.svg';
      img.alt = '加载失败';
    };

    // 开始加载
    img.src = src;
  }

  // 修复图片控制器注册问题
  function fixImageControllers() {
    // 移除可能存在的错误控制器
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // 清理可能存在的错误属性
      if (img.hasAttribute('data-controller')) {
        const controller = img.getAttribute('data-controller');
        if (controller === 'undefined' || controller === 'null') {
          img.removeAttribute('data-controller');
        }
      }
    });
  }

  // 优化图片加载性能
  function optimizeImageLoading() {
    // 为图片添加加载状态
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.classList.add('loading');
        
        img.addEventListener('load', function() {
          this.classList.remove('loading');
          this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
          this.classList.remove('loading');
          this.classList.add('error');
        });
      } else {
        img.classList.add('loaded');
      }
    });
  }

  // 响应式图片处理
  function handleResponsiveImages() {
    const images = document.querySelectorAll('img[data-srcset]');
    images.forEach(img => {
      const srcset = img.dataset.srcset;
      if (srcset) {
        img.srcset = srcset;
        img.removeAttribute('data-srcset');
      }
    });
  }

  // 图片压缩和优化
  function optimizeImages() {
    // 检查是否支持 WebP
    const webpSupported = checkWebPSupport();
    
    if (webpSupported) {
      const images = document.querySelectorAll('img[data-webp]');
      images.forEach(img => {
        const webpSrc = img.dataset.webp;
        if (webpSrc) {
          img.src = webpSrc;
          img.removeAttribute('data-webp');
        }
      });
    }
  }

  // 检查 WebP 支持
  function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // 图片加载进度
  function showImageProgress() {
    const images = document.querySelectorAll('img[data-src]');
    let loadedCount = 0;
    const totalCount = images.length;

    if (totalCount === 0) return;

    // 创建进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'image-loading-progress';
    progressBar.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text">加载中... ${loadedCount}/${totalCount}</div>
    `;
    document.body.appendChild(progressBar);

    // 监听图片加载
    const updateProgress = () => {
      loadedCount++;
      const percentage = (loadedCount / totalCount) * 100;
      
      const progressFill = progressBar.querySelector('.progress-fill');
      const progressText = progressBar.querySelector('.progress-text');
      
      progressFill.style.width = percentage + '%';
      progressText.textContent = `加载中... ${loadedCount}/${totalCount}`;
      
      if (loadedCount >= totalCount) {
        setTimeout(() => {
          progressBar.remove();
        }, 1000);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        updateProgress();
      } else {
        img.addEventListener('load', updateProgress);
        img.addEventListener('error', updateProgress);
      }
    });
  }

  // 初始化所有功能
  function init() {
    initLazyLoading();
    optimizeImageLoading();
    handleResponsiveImages();
    optimizeImages();
    showImageProgress();
  }

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 导出到全局
  window.ImageLoader = {
    init: init,
    loadImage: loadImage,
    fixImageControllers: fixImageControllers,
    optimizeImageLoading: optimizeImageLoading
  };

})(); 