document.addEventListener('DOMContentLoaded', () => {

  const themeSwitcher = document.querySelector('.theme-switcher a');

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // particles.js is no longer used, so its handling logic is removed.
    localStorage.setItem('theme', theme);
  };

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(currentTheme);
    });
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  const cards = document.querySelectorAll('.home-container, .post-card, .archive-group');

  cards.forEach(card => {
    // Add dynamic shine effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      // Reset properties if needed, though opacity change handles hiding
    });

    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });

  // --- Proactive UX Improvements by Cline ---

  // 1. Lazy Loading for post images
  const postContent = document.querySelector('.post-content');
  if (postContent) {
    const images = postContent.querySelectorAll('img');
    images.forEach(img => {
      if (img.src) {
        img.setAttribute('data-src', img.src);
        img.removeAttribute('src');
        img.classList.add('lazyload');
      }
    });
  }

  // 2. Back to Top Button
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.style.visibility = 'visible';
        backToTopButton.style.opacity = '1';
      } else {
        backToTopButton.style.visibility = 'hidden';
        backToTopButton.style.opacity = '0';
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Code Block Copy Button
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach((highlight, index) => {
    const code = highlight.querySelector('pre').innerText;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerText = 'Copy';
    btn.setAttribute('data-clipboard-text', code);
    
    highlight.appendChild(btn);
  });

  const clipboard = new ClipboardJS('.copy-btn');

  clipboard.on('success', function(e) {
    e.clearSelection();
    e.trigger.innerText = 'Copied!';
    setTimeout(() => {
      e.trigger.innerText = 'Copy';
    }, 2000);
  });

  clipboard.on('error', function(e) {
    e.trigger.innerText = 'Error';
    setTimeout(() => {
      e.trigger.innerText = 'Copy';
    }, 2000);
  });
});
