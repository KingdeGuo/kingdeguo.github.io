// iPhone Glassmorphism Theme JavaScript

// Theme management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeToggle();
    this.setupBackToTop();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    // Show/hide back to top button
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    // Scroll to top functionality
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Glass effect enhancements
class GlassEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupParallax();
    this.setupHoverEffects();
    this.setupScrollAnimations();
  }

  setupParallax() {
    // Subtle parallax effect for background
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('body::before');
      if (parallax) {
        const speed = scrolled * 0.5;
        document.body.style.setProperty('--parallax-offset', `${speed}px`);
      }
    });
  }

  setupHoverEffects() {
    // Enhanced hover effects for glass cards
    const cards = document.querySelectorAll('.post-card, .glass-container');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createGlowEffect(e.target);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.removeGlowEffect(e.target);
      });
    });
  }

  createGlowEffect(element) {
    element.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)';
  }

  removeGlowEffect(element) {
    element.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)';
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.post-card, .glass-container');
    animateElements.forEach(el => observer.observe(el));
  }
}

// Smooth scrolling for anchor links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Loading animations
class LoadingAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupPageLoad();
    this.setupCardLoading();
  }

  setupPageLoad() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
      }, 300);
    });
  }

  setupCardLoading() {
    // Add staggered loading animation for cards
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }
}

// Touch gestures for mobile
class TouchGestures {
  constructor() {
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.init();
  }

  init() {
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartY - this.touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe up - hide nav
        this.hideNavigation();
      } else {
        // Swipe down - show nav
        this.showNavigation();
      }
    }
  }

  hideNavigation() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
      nav.style.transform = 'translateY(-100%)';
    }
  }

  showNavigation() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
      nav.style.transform = 'translateY(0)';
    }
  }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new GlassEffects();
  new SmoothScroll();
  new LoadingAnimations();
  new TouchGestures();
});

// Utility functions
const Utils = {
  // Debounce function for performance
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

  // Throttle function for scroll events
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
  }
};

// Export for global use
window.GlassmorphismTheme = {
  ThemeManager,
  GlassEffects,
  SmoothScroll,
  LoadingAnimations,
  TouchGestures,
  Utils
};
