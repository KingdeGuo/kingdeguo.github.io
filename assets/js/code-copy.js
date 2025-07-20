(function() {
  'use strict';

  function getLang() {
    const lang = document.documentElement.lang || navigator.language || 'zh';
    return lang.startsWith('zh') ? 'zh' : 'en';
  }

  function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }

  function enhanceCodeBlocks() {
    document.querySelectorAll('div.highlight').forEach(function(highlightDiv) {
      if (highlightDiv.querySelector('.code-block-header')) {
        return; // Already processed
      }

      const pre = highlightDiv.querySelector('pre');
      if (!pre) return;

      const codeEl = pre.querySelector('code');
      if (!codeEl) return;

      const code = codeEl.textContent.trim();
      const langMatch = highlightDiv.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : 'code';

      highlightDiv.classList.add('code-block-wrapper');

      const header = document.createElement('div');
      header.className = 'code-block-header';

      const langSpan = document.createElement('span');
      langSpan.className = 'code-block-lang';
      langSpan.textContent = lang.toUpperCase();

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

      header.appendChild(langSpan);
      header.appendChild(copyBtn);

      highlightDiv.insertBefore(header, highlightDiv.firstChild);
    });
  }

  function init() {
    enhanceCodeBlocks();
    // If using a dynamic content loader like Turbo/Turbolinks, listen for page changes
    document.addEventListener('turbo:load', enhanceCodeBlocks);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
