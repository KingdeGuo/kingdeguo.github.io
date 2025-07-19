(function() {
  // 搜索配置
  const SEARCH_CONFIG = {
    minQueryLength: 2,
    maxResults: 10,
    highlightClass: 'search-highlight',
    debounceDelay: 300
  };

  // 防抖函数
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

  // 高亮搜索关键词
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, `<span class="${SEARCH_CONFIG.highlightClass}">$1</span>`);
  }

  // 截取文本摘要
  function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 获取搜索摘要
  function getSearchSnippet(content, query, maxLength = 200) {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryIndex = lowerContent.indexOf(lowerQuery);
    
    if (queryIndex === -1) {
      return truncateText(content, maxLength);
    }
    
    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + query.length + 50);
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return highlightText(snippet, query);
  }

  // 显示搜索结果
  function displaySearchResults(results, store, query) {
    const searchResults = document.getElementById('search-results');
    const searchContainer = document.getElementById('search-container');
    
    if (!searchResults || !searchContainer) return;

    if (results.length) {
      let resultList = '';
      results.slice(0, SEARCH_CONFIG.maxResults).forEach(result => {
        const item = store[result.ref];
        const score = result.score;
        const snippet = getSearchSnippet(item.content, query);
        const formattedDate = formatDate(item.date);
        
        resultList += `
          <li class="search-result-item" data-score="${score}">
            <div class="search-result-header">
              <a href="${item.url}" class="search-result-title">
                ${highlightText(item.title, query)}
              </a>
              <span class="search-result-date">${formattedDate}</span>
            </div>
            <div class="search-result-snippet">${snippet}</div>
            ${item.categories ? `<div class="search-result-categories">
              ${item.categories.map(cat => `<span class="search-category">${cat}</span>`).join('')}
            </div>` : ''}
          </li>
        `;
      });
      
      searchResults.innerHTML = resultList;
      searchContainer.classList.add('has-results');
    } else {
      searchResults.innerHTML = `
        <li class="no-results">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">
            <p>未找到相关结果</p>
            <p class="no-results-suggestions">
              尝试使用不同的关键词，或者检查拼写是否正确
            </p>
          </div>
        </li>
      `;
      searchContainer.classList.remove('has-results');
    }
  }

  // 显示搜索建议
  function showSearchSuggestions(store, query) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults || query.length < SEARCH_CONFIG.minQueryLength) {
      searchResults.innerHTML = '';
      return;
    }

    // 生成搜索建议
    const suggestions = generateSuggestions(store, query);
    if (suggestions.length > 0) {
      let suggestionList = '';
      suggestions.forEach(suggestion => {
        suggestionList += `
          <li class="search-suggestion">
            <a href="${suggestion.url}">
              <span class="suggestion-title">${highlightText(suggestion.title, query)}</span>
              <span class="suggestion-type">${suggestion.type}</span>
            </a>
          </li>
        `;
      });
      searchResults.innerHTML = suggestionList;
    }
  }

  // 生成搜索建议
  function generateSuggestions(store, query) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();
    
    Object.values(store).forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const contentMatch = item.content.toLowerCase().includes(lowerQuery);
      const categoryMatch = item.categories && item.categories.some(cat => 
        cat.toLowerCase().includes(lowerQuery)
      );
      
      if (titleMatch || contentMatch || categoryMatch) {
        suggestions.push({
          url: item.url,
          title: item.title,
          type: titleMatch ? '标题匹配' : contentMatch ? '内容匹配' : '分类匹配'
        });
      }
    });
    
    return suggestions.slice(0, 5);
  }

  // 初始化搜索
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.getElementById('search-container');
    
    if (!searchInput || !searchContainer) {
      console.warn('Search elements not found');
      return;
    }

    let idx = null;
    let store = {};

    // 加载搜索数据
    fetch('/search.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load search data');
        }
        return response.json();
      })
      .then(data => {
        store = data.reduce((acc, item, i) => {
          acc[i] = item;
          return acc;
        }, {});

        // 初始化 Lunr 索引
        idx = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 10 });
          this.field('categories', { boost: 5 });
          this.field('tags', { boost: 3 });
          this.field('content', { boost: 1 });

          data.forEach((doc, i) => {
            this.add({ ...doc, id: i });
          });
        });

        console.log('Search index initialized with', data.length, 'documents');
      })
      .catch(error => {
        console.error('Error loading search data:', error);
        searchContainer.innerHTML = '<div class="search-error">搜索功能暂时不可用</div>';
      });

    // 搜索处理函数
    const performSearch = debounce(function(query) {
      if (!idx || query.length < SEARCH_CONFIG.minQueryLength) {
        showSearchSuggestions(store, query);
        return;
      }

      try {
        const results = idx.search(query);
        displaySearchResults(results, store, query);
      } catch (error) {
        console.error('Search error:', error);
        showSearchSuggestions(store, query);
      }
    }, SEARCH_CONFIG.debounceDelay);

    // 搜索输入事件
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      performSearch(query);
    });

    // 搜索框焦点事件
    searchInput.addEventListener('focus', function() {
      searchContainer.classList.add('focused');
      if (this.value.trim().length >= SEARCH_CONFIG.minQueryLength) {
        performSearch(this.value.trim());
      }
    });

    searchInput.addEventListener('blur', function() {
      // 延迟隐藏结果，允许点击搜索结果
      setTimeout(() => {
        searchContainer.classList.remove('focused');
      }, 200);
    });

    // 键盘导航
    searchInput.addEventListener('keydown', function(e) {
      const results = document.querySelectorAll('.search-result-item, .search-suggestion');
      const currentIndex = Array.from(results).findIndex(item => 
        item.classList.contains('selected')
      );

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < results.length - 1) {
            if (currentIndex >= 0) results[currentIndex].classList.remove('selected');
            results[currentIndex + 1].classList.add('selected');
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            results[currentIndex].classList.remove('selected');
            results[currentIndex - 1].classList.add('selected');
          }
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = document.querySelector('.search-result-item.selected, .search-suggestion.selected');
          if (selectedItem) {
            const link = selectedItem.querySelector('a');
            if (link) window.location.href = link.href;
          }
          break;
        case 'Escape':
          this.blur();
          break;
      }
    });
  }

  // 页面加载完成后初始化搜索
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
