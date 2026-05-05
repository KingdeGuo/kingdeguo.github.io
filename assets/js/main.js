// Main JavaScript for Hugo Blog

document.addEventListener('DOMContentLoaded', function() {
  // Reading Progress Bar
  initReadingProgress();
  
// Donate / Reward QR Toggle (click to reveal - anti-scraper)
function initDonateToggle() {
  document.querySelectorAll('.donate-wrapper').forEach(function(wrapper) {
    var toggle = wrapper.querySelector('.donate-toggle');
    var content = wrapper.querySelector('.donate-content');
    var qrContainer = wrapper.querySelector('.donate-qr-container');
    if (!toggle || !content) return;

    toggle.addEventListener('click', function() {
      var isVisible = content.classList.contains('is-visible');
      if (isVisible) {
        content.classList.remove('is-visible');
        return;
      }

      content.classList.add('is-visible');

      if (qrContainer && !qrContainer.querySelector('img')) {
        var src = toggle.getAttribute('data-donate-src');
        if (src) {
          var img = document.createElement('img');
          img.className = 'donate-qr-image';
          img.alt = window.i18n?.donateAlt || '微信赞赏码';
          img.loading = 'lazy';
          img.src = src;
          qrContainer.appendChild(img);
        }
      }
    });
  });
}

// Code Copy Buttons
  initCodeCopyButtons();
  
  // Image Lazy Loading
  initLazyLoading();
  
  // Smooth Scrolling
  initSmoothScrolling();
  
  // Mobile Menu Toggle
  initMobileMenu();
  
  // Theme Toggle
  initThemeToggle();

  // Donate / Reward Toggle
  initDonateToggle();
});

// Reading Progress Bar
function initReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
  document.body.prepend(progressBar);
  
  const progressBarElement = document.querySelector('.reading-progress-bar');
  
  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = (scrollTop / documentHeight) * 100;
    
    progressBarElement.style.width = progress + '%';
  });
}

// Theme Toggle
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  };

  // Load preference: localStorage -> system preference -> light
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// Code Copy Buttons
function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach((block) => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = window.i18n?.copy || '复制';
    copyButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    block.style.position = 'relative';
    block.appendChild(copyButton);
    
    const showCopyButton = () => { copyButton.style.opacity = '1'; };
    const hideCopyButton = () => { copyButton.style.opacity = '0'; };
    
    block.addEventListener('mouseenter', showCopyButton);
    block.addEventListener('mouseleave', hideCopyButton);
    
    // 移动端支持：点击代码块时显示/隐藏复制按钮
    block.addEventListener('touchstart', (e) => {
      if (copyButton.style.opacity === '1') {
        hideCopyButton();
      } else {
        showCopyButton();
      }
    });
    
    copyButton.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || block.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = window.i18n?.copied || '已复制!';
        setTimeout(() => {
          copyButton.textContent = window.i18n?.copy || '复制';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        copyButton.textContent = window.i18n?.copyFailed || '复制失败';
        setTimeout(() => {
          copyButton.textContent = window.i18n?.copy || '复制';
        }, 2000);
      }
    });
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!hamburger || !navMenu) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // 点击菜单项时关闭菜单
  document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 点击菜单外部时关闭菜单
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-menu') && !event.target.closest('.hamburger') && navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
}

// Image Lazy Loading
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Table of Contents
function initTableOfContents() {
  const tocContainer = document.querySelector('.table-of-contents');
  if (!tocContainer) return;
  
  const headings = document.querySelectorAll('h2, h3');
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  headings.forEach((heading, index) => {
    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;
    
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    
    const listItem = document.createElement('li');
    listItem.className = `toc-item toc-${level}`;
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = text;
    link.className = 'toc-link';
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });
  
  tocContainer.appendChild(tocList);
}

// Initialize additional features when needed
if (document.querySelector('.table-of-contents')) {
  initTableOfContents();
}

if (document.querySelector('img[data-src]')) {
  initLazyLoading();
}
