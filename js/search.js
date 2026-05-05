document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const postsContainer = document.getElementById('posts-list');
    if (!searchInput || !postsContainer) return;

    let postsData = [];
    let originalHTML = postsContainer.innerHTML;

    function getQueryParam() {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('q') || '';
        } catch (e) {
            return '';
        }
    }

    function updateURLParam(q) {
        const url = new URL(window.location.href);
        if (q) url.searchParams.set('q', q);
        else url.searchParams.delete('q');
        history.replaceState({}, document.title, url.toString());
    }

    fetch('/index.json')
        .then(r => r.json())
        .then(data => {
            postsData = data;
            const q = getQueryParam();
            if (q) {
                searchInput.value = q;
                performSearch(q);
                searchInput.focus();
                searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
            }
        })
        .catch(err => console.error('Error loading search index:', err));

    function debounce(fn, wait) {
        let t = null;
        return function(...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        }
    }

    function performSearch(rawQuery) {
        const q = (rawQuery || '').trim().toLowerCase();

        if (!q) {
            postsContainer.innerHTML = originalHTML;
            updateURLParam('');
            setTimeout(() => searchInput.focus(), 0);
            return;
        }

        const results = postsData.filter(post => {
            const title = (post.title || '').toLowerCase();
            const content = (post.content || '').toLowerCase();
            const date = (post.date || '').toLowerCase();
            return title.includes(q) || content.includes(q) || date.includes(q);
        });

        if (!results.length) {
            postsContainer.innerHTML = '<div class="no-results">没有找到相关文章</div>';
            updateURLParam(q);
            return;
        }

        const grouped = groupByMonth(results);
        postsContainer.innerHTML = '';
        grouped.forEach(g => {
            const monthGroup = document.createElement('div');
            monthGroup.className = 'month-group';

            const monthTitle = document.createElement('h3');
            monthTitle.className = 'month-title';
            monthTitle.textContent = g.month;
            monthGroup.appendChild(monthTitle);

            const ul = document.createElement('ul');
            ul.className = 'post-titles';

            g.posts.forEach(post => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = post.permalink;
                a.innerHTML = highlightText(post.title || '', q);
                li.appendChild(a);
                ul.appendChild(li);
            });

            monthGroup.appendChild(ul);
            postsContainer.appendChild(monthGroup);
        });

        updateURLParam(q);
    }

    const debouncedSearch = debounce(function(e) {
        performSearch(e.target.value);
    }, 180);

    searchInput.addEventListener('input', function(e) {
        debouncedSearch(e);
    });

    searchInput.addEventListener('search', function(e) {
        if (!e.target.value) performSearch('');
    });

    function highlightText(text, q) {
        if (!q) return escapeHtml(text);
        const esc = q.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
        const re = new RegExp('(' + esc + ')', 'gi');
        return escapeHtml(text).replace(re, '<span class="search-highlight">$1</span>');
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function(s) {
            return ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[s];
        });
    }

    function groupByMonth(posts) {
        const groups = {};
        posts.forEach(p => {
            const date = new Date(p.date);
            const month = date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit' });
            if (!groups[month]) groups[month] = [];
            groups[month].push(p);
        });
        return Object.entries(groups)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([month, items]) => ({ month, posts: items.sort((a, b) => new Date(b.date) - new Date(a.date)) }));
    }

});