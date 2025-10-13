document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let postsData = null;

    // 获取文章数据
    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            postsData = data;
        })
        .catch(error => console.error('Error loading search index:', error));

    // 搜索功能
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const postsList = document.getElementById('posts-list');
        
        if (!postsData || !postsList) return;
        
        // 如果搜索框为空，显示原始文章列表
        if (!searchTerm) {
            location.reload();
            return;
        }

        // 清空现有内容
        postsList.innerHTML = '';
        
        // 过滤并显示搜索结果
        const results = postsData.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const contentMatch = post.content.toLowerCase().includes(searchTerm);
            const dateMatch = post.date.toLowerCase().includes(searchTerm);
            return titleMatch || contentMatch || dateMatch;
        });

        if (results.length === 0) {
            postsList.innerHTML = '<div class="no-results">没有找到相关文章</div>';
            return;
        }

        // 按日期分组显示结果
        const groupedResults = groupByMonth(results);
        
        // 渲染搜索结果
        groupedResults.forEach(group => {
            const monthGroup = document.createElement('div');
            monthGroup.className = 'month-group';
            
            const monthTitle = document.createElement('h3');
            monthTitle.className = 'month-title';
            monthTitle.textContent = group.month;
            monthGroup.appendChild(monthTitle);

            const postsList = document.createElement('ul');
            postsList.className = 'post-titles';
            
            group.posts.forEach(post => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = post.permalink;
                link.innerHTML = highlightText(post.title, searchTerm);
                li.appendChild(link);
                postsList.appendChild(li);
            });

            monthGroup.appendChild(postsList);
            postsList.appendChild(monthGroup);
        });
    });
});

// 文本高亮函数
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// 按月份分组函数
function groupByMonth(posts) {
    const groups = {};
    
    posts.forEach(post => {
        const date = new Date(post.date);
        const month = date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit' });
        
        if (!groups[month]) {
            groups[month] = [];
        }
        groups[month].push(post);
    });

    return Object.entries(groups)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, posts]) => ({
            month,
            posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date))
        }));
}