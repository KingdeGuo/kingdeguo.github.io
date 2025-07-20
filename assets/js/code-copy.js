(function() {
  'use strict';

  function getLang() {
    const lang = document.documentElement.lang || navigator.language || 'zh';
    return lang.startsWith('zh') ? 'zh' : 'en';
  }

  function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }

  function addCopyButtons() {
    document.querySelectorAll('div.highlight').forEach(function(highlightDiv) {
      if (highlightDiv.querySelector('.code-block-copy')) {
        return; // Already processed
      }

      const codeEl = highlightDiv.querySelector('code');
      if (!codeEl) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-block-copy';
      copyBtn.type = 'button';
      copyBtn.textContent = getLang() === 'zh' ? '复制' : 'Copy';
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(codeEl.innerText).then(() => {
          copyBtn.textContent = getLang() === 'zh' ? '已复制!' : 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = getLang() === 'zh' ? '复制' : 'Copy';
            copyBtn.classList.remove('copied');
          }, 1200);
        });
      });

      highlightDiv.appendChild(copyBtn);
    });
  }

  function init() {
    addCopyButtons();
    // If using a dynamic content loader like Turbo/Turbolinks, listen for page changes
    document.addEventListener('turbo:load', addCopyButtons);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
