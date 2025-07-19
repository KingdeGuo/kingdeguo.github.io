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
      // 创建复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = '复制';
      copyBtn.setAttribute('data-index', index);
      
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

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initCodeCopy();
    detectCodeLanguage();
    addCodeBlockAnimations();
    addLineHighlighting();
  }

  // 导出函数供其他脚本使用
  window.codeCopy = {
    init: initCodeCopy,
    copyToClipboard: copyToClipboard
  };

})(); 