// Main JavaScript for Hugo Blog

document.addEventListener('DOMContentLoaded', function() {
  // Reading Progress Bar
  initReadingProgress();
  
  // Code Copy Buttons
  initCodeCopyButtons();
  
  // Smooth Scrolling
  initSmoothScrolling();
  
  // Mobile Menu Toggle
  initMobileMenu();
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

// Code Copy Buttons
function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach((block) => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = '复制';
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
    
    block.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });
    
    block.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0';
    });
    
    copyButton.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || block.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = '已复制!';
        setTimeout(() => {
          copyButton.textContent = '复制';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        copyButton.textContent = '复制失败';
        setTimeout(() => {
          copyButton.textContent = '复制';
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
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');
  
  // Create mobile menu button
  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.className = 'mobile-menu-button';
  mobileMenuButton.innerHTML = '☰';
  mobileMenuButton.style.cssText = `
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-color);
  `;
  
  const nav = document.querySelector('.nav');
  nav.appendChild(mobileMenuButton);
  
  // Toggle mobile menu
  mobileMenuButton.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    mobileMenuButton.textContent = navMenu.classList.contains('mobile-open') ? '✕' : '☰';
  });
  
  // Close mobile menu when clicking on links
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        mobileMenuButton.textContent = '☰';
      }
    });
  });
  
  // Responsive styles for mobile menu
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .mobile-menu-button {
        display: block !important;
      }
      
      .nav-menu {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
        padding: var(--spacing-md);
        box-shadow: var(--shadow-lg);
      }
      
      .nav-menu.mobile-open {
        display: flex;
      }
      
      .nav-item {
        margin: var(--spacing-sm) 0;
      }
    }
  `;
  document.head.appendChild(style);
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
