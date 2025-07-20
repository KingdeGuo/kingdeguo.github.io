---
layout: default
---

<!-- 简洁首页 -->
<div class="content-container">
  <!-- 欢迎区域 -->
  <section class="welcome-section">
    <div class="welcome-content">
      <h1 class="welcome-title">Hello, I'm KingdeGuo 👋</h1>
      <p class="welcome-subtitle">技术博主 | AI 研究者 | 量化投资者</p>
      <p class="welcome-description">
        在这里分享技术见解、生活感悟和成长历程<br>
        专注于人工智能、量化投资、时间管理等领域的深度探索
      </p>
      
      <!-- 统计信息 -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ site.posts | size }}</div>
          <div class="stat-label">技术文章</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ site.categories | size }}</div>
          <div class="stat-label">知识分类</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ site.tags | size }}</div>
          <div class="stat-label">技术标签</div>
        </div>
      </div>
      
      <!-- 行动按钮 -->
      <div class="action-buttons">
        <a href="/posts/" class="btn btn-primary">浏览文章</a>
        <a href="/about/" class="btn btn-secondary">关于我</a>
      </div>
    </div>
  </section>

  <!-- 最新文章 -->
  <section class="recent-posts">
    <h2 class="section-title">最新文章</h2>
    <div class="posts-grid">
      {% assign recent_posts = site.posts | sort: 'date' | reverse | limit: 6 %}
      {% for post in recent_posts %}
        <article class="post-card">
          <div class="post-meta">
            <time>{{ post.date | date: "%Y年%m月%d日" }}</time>
            {% if post.categories %}
              <span class="category">{{ post.categories | first }}</span>
            {% endif %}
          </div>
          <h3 class="post-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          {% if post.description %}
            <p class="post-excerpt">{{ post.description }}</p>
          {% endif %}
          <a href="{{ post.url | relative_url }}" class="read-more">阅读全文 →</a>
        </article>
      {% endfor %}
    </div>
    <div class="section-footer">
      <a href="/posts/" class="btn btn-outline">查看所有文章</a>
    </div>
  </section>
</div>

<style>
/* 简洁首页样式 */
.welcome-section {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  margin-bottom: var(--spacing-3xl);
}

.welcome-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--gray-900);
}

[data-theme="dark"] .welcome-title {
  color: var(--gray-100);
}

.welcome-subtitle {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  font-weight: var(--font-weight-medium);
}

.welcome-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  margin-bottom: var(--spacing-2xl);
  line-height: var(--line-height-relaxed);
}

[data-theme="dark"] .welcome-description {
  color: var(--gray-400);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

[data-theme="dark"] .stat-label {
  color: var(--gray-400);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: white;
}

.btn-outline {
  background: transparent;
  color: var(--gray-600);
  border-color: var(--gray-300);
}

[data-theme="dark"] .btn-outline {
  color: var(--gray-400);
  border-color: var(--gray-600);
}

.btn-outline:hover {
  background: var(--gray-100);
  color: var(--gray-800);
}

[data-theme="dark"] .btn-outline:hover {
  background: var(--gray-800);
  color: var(--gray-200);
}

.recent-posts {
  margin-bottom: var(--spacing-3xl);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-xl);
  color: var(--gray-900);
  text-align: center;
}

[data-theme="dark"] .section-title {
  color: var(--gray-100);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.post-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: all var(--transition-normal);
}

[data-theme="dark"] .post-card {
  background: var(--gray-800);
  border-color: var(--gray-700);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.post-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

[data-theme="dark"] .post-meta {
  color: var(--gray-400);
}

.category {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.post-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.post-title a {
  color: var(--gray-900);
  text-decoration: none;
}

[data-theme="dark"] .post-title a {
  color: var(--gray-100);
}

.post-title a:hover {
  color: var(--primary-color);
}

.post-excerpt {
  color: var(--gray-600);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-relaxed);
}

[data-theme="dark"] .post-excerpt {
  color: var(--gray-400);
}

.read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.read-more:hover {
  text-decoration: underline;
}

.section-footer {
  text-align: center;
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: var(--font-size-3xl);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>

