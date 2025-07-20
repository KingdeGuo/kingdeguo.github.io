/**
 * 简约风格主JavaScript文件
 * 包含基本的交互功能和工具函数
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化所有功能
  initSmoothScrolling();
  initCodeCopy();
  initTableOfContents();
  initLazyLoading();
});

/**
 * 平滑滚动功能
 */
function initSmoothScrolling() {
  // 为所有锚点链接添加平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * 代码复制功能
 */
function initCodeCopy() {
  // 为所有代码块添加复制按钮
  document.querySelectorAll('pre').forEach(pre => {
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = '复制';
    copyButton.setAttribute('aria-label', '复制代码');
    
    // 添加按钮样式
    copyButton.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: var(--accent-color);
      color: white;
      border: none;
      border-radius: var(--border-radius-sm);
      font-size: 0.8rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity var(--transition-fast);
    `;
    
    // 设置代码块为相对定位
    pre.style.position = 'relative';
    
    // 鼠标悬停时显示按钮
    pre.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });
    
    pre.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0';
    });
    
    // 复制功能
    copyButton.addEventListener('click', async () => {
      const code = pre.querySelector('code') || pre;
      const text = code.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = '已复制';
        copyButton.style.background = 'var(--success-color)';
        
        setTimeout(() => {
          copyButton.textContent = '复制';
          copyButton.style.background = 'var(--accent-color)';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        copyButton.textContent = '失败';
        copyButton.style.background = 'var(--danger-color)';
        
        setTimeout(() => {
          copyButton.textContent = '复制';
          copyButton.style.background = 'var(--accent-color)';
        }, 2000);
      }
    });
    
    pre.appendChild(copyButton);
  });
}

/**
 * 目录导航功能
 */
function initTableOfContents() {
  const toc = document.querySelector('.toc');
  if (!toc) return;
  
  // 为所有标题添加ID
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
  });
  
  // 创建目录链接
  const headings = document.querySelectorAll('h2, h3, h4');
  const tocList = document.createElement('ul');
  
  headings.forEach(heading => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 2) * 1}rem`;
    
    li.appendChild(a);
    tocList.appendChild(li);
  });
  
  // 清空原有内容并添加新目录
  toc.innerHTML = '';
  toc.appendChild(tocList);
  
  // 高亮当前章节
  const observerOptions = {
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const tocLink = toc.querySelector(`a[href="#${id}"]`);
      
      if (entry.isIntersecting) {
        // 移除所有活动状态
        toc.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
        });
        
        // 添加活动状态
        if (tocLink) {
          tocLink.classList.add('active');
        }
      }
    });
  }, observerOptions);
  
  headings.forEach(heading => {
    observer.observe(heading);
  });
}

/**
 * 图片懒加载功能
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
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
}

/**
 * 工具函数：格式化日期
 */
function formatDate(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('zh-CN', options);
}

/**
 * 工具函数：获取元素位置
 */
function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset
  };
}

// 导出函数供其他脚本使用
window.BlogUtils = {
  debounce,
  throttle,
  formatDate,
  getElementPosition
}; 