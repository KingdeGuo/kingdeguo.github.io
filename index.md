---
layout: modern-home
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
      
      <!-- 行动按钮 -->
      <div class="action-buttons">
        <a href="/posts/" class="btn btn-primary">浏览全部文章</a>
      </div>
    </div>
  </section>

  <!-- 精选文章 -->
  <section class="featured-posts">
    <h2 class="section-title">精选文章</h2>
    <div class="posts-grid">
      {% assign recent_posts = site.posts | sort: 'date' | reverse | limit: 8 %}
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
