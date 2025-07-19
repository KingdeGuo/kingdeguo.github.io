/**
 * 代码块复制功能
 * 为所有代码块添加复制按钮和复制功能
 */

(function() {
  'use strict';

  // 初始化代码块复制功能
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('.highlight');
    
    codeBlocks.forEach((block, index) => {
      // 检查是否已经有复制按钮，避免重复
      if (block.querySelector('.copy-btn')) {
        return;
      }
      
      // 创建复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = '复制';
      copyBtn.setAttribute('data-index', index);
      copyBtn.setAttribute('type', 'button'); // 防止表单提交
      
      // 添加到代码块
      block.appendChild(copyBtn);
      
      // 添加点击事件
      copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const codeElement = block.querySelector('pre code') || block.querySelector('pre');
        const textToCopy = codeElement ? codeElement.textContent : block.textContent;
        
        copyToClipboard(textToCopy, copyBtn);
      });
    });
  }

  // 复制到剪贴板
  async function copyToClipboard(text, button) {
    try {
      // 尝试使用现代API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showCopySuccess(button);
      } else {
        // 回退到传统方法
        fallbackCopyTextToClipboard(text, button);
      }
    } catch (err) {
      console.error('复制失败:', err);
      fallbackCopyTextToClipboard(text, button);
    }
  }

  // 回退复制方法
  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopySuccess(button);
      } else {
        showCopyError(button);
      }
    } catch (err) {
      console.error('回退复制失败:', err);
      showCopyError(button);
    }
    
    document.body.removeChild(textArea);
  }

  // 显示复制成功
  function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '已复制!';
    button.classList.add('copied');
    
    // 2秒后恢复
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }

  // 显示复制错误
  function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = '复制失败';
    button.style.background = '#ef4444';
    button.style.color = 'white';
    
    // 2秒后恢复
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 2000);
  }

  // 检测代码块语言并设置标识
  function detectCodeLanguage() {
    const codeBlocks = document.querySelectorAll('.highlight');
    
    codeBlocks.forEach(block => {
      const codeElement = block.querySelector('pre code') || block.querySelector('pre');
      if (codeElement) {
        // 从class中提取语言信息
        const classes = codeElement.className.split(' ');
        const langClass = classes.find(cls => cls.startsWith('language-'));
        
        if (langClass) {
          const language = langClass.replace('language-', '');
          block.setAttribute('data-lang', language);
        } else {
          // 尝试从其他class中提取
          const otherLangClass = classes.find(cls => 
            ['python', 'javascript', 'js', 'html', 'css', 'java', 'cpp', 'c', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'ts', 'json', 'xml', 'yaml', 'yml', 'markdown', 'md', 'bash', 'shell', 'sql'].includes(cls)
          );
          
          if (otherLangClass) {
            block.setAttribute('data-lang', otherLangClass);
          } else {
            block.setAttribute('data-lang', 'code');
          }
        }
      }
    });
  }

  // 清理重复的复制按钮
  function cleanupDuplicateButtons() {
    const codeBlocks = document.querySelectorAll('.highlight');
    
    codeBlocks.forEach(block => {
      const copyButtons = block.querySelectorAll('.copy-btn');
      if (copyButtons.length > 1) {
        // 保留第一个，删除其他的
        for (let i = 1; i < copyButtons.length; i++) {
          copyButtons[i].remove();
        }
      }
    });
  }

  // 添加代码块动画效果
  function addCodeBlockAnimations() {
    const codeBlocks = document.querySelectorAll('.highlight');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    codeBlocks.forEach(block => {
      block.style.opacity = '0';
      block.style.transform = 'translateY(20px)';
      block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(block);
    });
  }

  // 添加代码块行号高亮
  function addLineHighlighting() {
    const codeBlocks = document.querySelectorAll('.highlight pre');
    
    codeBlocks.forEach(block => {
      const lines = block.querySelectorAll('.lineno');
      
      lines.forEach(line => {
        line.addEventListener('mouseenter', () => {
          line.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        });
        
        line.addEventListener('mouseleave', () => {
          line.style.backgroundColor = '';
        });
      });
    });
  }

  // 生成行号HTML
  function generateLineNumbers(code) {
    const lines = code.split('\n').length;
    let html = '';
    for (let i = 1; i <= lines; i++) {
      html += `<span class="line-number">${i}</span>\n`;
    }
    return html;
  }

  // 包裹所有代码块
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre > code');
    codeBlocks.forEach(code => {
      const pre = code.parentElement;
      if (pre.classList.contains('code-block-inner')) return; // 已处理

      // 获取语言
      let lang = code.className.match(/language-([\w\d]+)/);
      lang = lang ? lang[1] : '';
      const langLabel = lang ? lang.toUpperCase() : 'CODE';

      // 代码内容
      const codeText = code.textContent;
      const lines = codeText.split('\n');
      const numberedCode = lines.map((line, idx) => `<span>${line}</span>`).join('\n');
      const lineNumbers = generateLineNumbers(codeText);

      // 构建卡片结构
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      wrapper.innerHTML = `
        <div class="code-block-header">
          <span class="code-block-lang">${langLabel}</span>
          <button class="code-block-copy" title="复制代码">复制</button>
        </div>
        <pre class="code-block-inner"><code>${numberedCode}</code></pre>
      `;
      // 插入行号
      const preEl = wrapper.querySelector('.code-block-inner');
      const lineNumDiv = document.createElement('div');
      lineNumDiv.style.position = 'absolute';
      lineNumDiv.style.left = '0';
      lineNumDiv.style.top = '1.2em';
      lineNumDiv.style.textAlign = 'right';
      lineNumDiv.style.pointerEvents = 'none';
      lineNumDiv.innerHTML = lineNumbers;
      preEl.appendChild(lineNumDiv);

      // 替换原有pre
      pre.replaceWith(wrapper);
    });
  }

  // 复制按钮事件
  function bindCopyEvents() {
    document.body.addEventListener('click', function(e) {
      if (e.target.classList.contains('code-block-copy')) {
        const wrapper = e.target.closest('.code-block-wrapper');
        const code = wrapper.querySelector('pre code').innerText;
        copyToClipboard(code).then(() => {
          e.target.textContent = '已复制!';
          setTimeout(() => {
            e.target.textContent = '复制';
          }, 1200);
        });
      }
    });
  }

  // 主题切换时刷新代码块样式
  function bindThemeListener() {
    const observer = new MutationObserver(() => {
      enhanceCodeBlocks();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // 初始化
  function init() {
    enhanceCodeBlocks();
    bindCopyEvents();
    bindThemeListener();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 导出函数供其他脚本使用
  window.codeCopy = {
    init: initCodeCopy,
    copyToClipboard: copyToClipboard,
    cleanup: cleanupDuplicateButtons
  };

})(); 