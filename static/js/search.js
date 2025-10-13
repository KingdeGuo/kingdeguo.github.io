document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let postsData = null;

    // 获取文章数据
    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            postsData = data;
            // 初始状态显示所有文章
            displayAllPosts(postsData);
        })
        .catch(error => console.error('Error loading search index:', error));

    // 显示所有文章的函数
    function displayAllPosts(posts) {
        const postsListContainer = document.getElementById('posts-list');
        if (!postsListContainer) return;
        
        postsListContainer.innerHTML = '';
        const groupedPosts = groupByMonth(posts);
        
        groupedPosts.forEach(group => {
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
                link.textContent = post.title;
                li.appendChild(link);
                postsList.appendChild(li);
            });

            monthGroup.appendChild(postsList);
            postsListContainer.appendChild(monthGroup);
        });
    }

    // 搜索功能
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const postsList = document.getElementById('posts-list');
        
        if (!postsData || !postsList) return;
        
        // 清空现有内容
        postsList.innerHTML = '';
        
        // 如果搜索框为空，显示所有文章
        if (!searchTerm) {
            displayAllPosts(postsData);
            return;
        }
        
        // 过滤并显示搜索结果
        const results = postsData.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const contentMatch = post.content.toLowerCase().includes(searchTerm);
            const dateMatch = post.date.toLowerCase().includes(searchTerm);

            // 高亮显示内容预览（如果匹配到内容）
            if (contentMatch) {
                post.preview = generatePreview(post.content, searchTerm);
            }
            
            return titleMatch || contentMatch || dateMatch;
        });
        
// 为匹配的内容生成预览
function generatePreview(content, searchTerm) {
    const maxLength = 100; // 预览的最大长度
    const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return '';
    
    let start = Math.max(0, index - maxLength / 2);
    let end = Math.min(content.length, index + searchTerm.length + maxLength / 2);
    
    let preview = content.substring(start, end);
    
    // 添加省略号
    if (start > 0) preview = '...' + preview;
    if (end < content.length) preview = preview + '...';
    
    return preview;
}

        if (results.length === 0) {
            postsList.innerHTML = '<div class="no-results">没有找到相关文章</div>';
            return;
        }

        // 按日期分组显示结果
        const groupedResults = groupByMonth(results);
        
        // 渲染搜索结果
        const postsListContainer = document.getElementById('posts-list');
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

                // 如果有内容预览，添加预览文本
                if (post.preview) {
                    const preview = document.createElement('div');
                    preview.className = 'post-preview';
                    preview.innerHTML = highlightText(post.preview, searchTerm);
                    li.appendChild(preview);
                }

                postsList.appendChild(li);
            });

            monthGroup.appendChild(postsList);
            postsListContainer.appendChild(monthGroup);
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
        .map(([month, posts]) => ({
            month,
            monthSortKey: new Date(posts[0].date).getTime(),
            posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date))
        }))
        .sort((a, b) => b.monthSortKey - a.monthSortKey);
}