---
layout: home
title: KingdeGuo's Blog
author_profile: true
---

<div class="welcome-section">
  <div class="welcome-content">
    <h1 class="welcome-title">欢迎来到我的技术博客</h1>
    <p class="welcome-subtitle">分享技术、生活和思考的地方</p>
    <div class="welcome-stats">
      <div class="stat-item">
        <span class="stat-number">{{ site.posts.size }}</span>
        <span class="stat-label">文章</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ site.categories.size }}</span>
        <span class="stat-label">分类</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ site.tags.size }}</span>
        <span class="stat-label">标签</span>
      </div>
    </div>
  </div>
</div>

<div class="featured-section">
  <h2 class="section-title">最新文章</h2>
  <div class="featured-posts">
    {% assign recent_posts = site.posts | sort: 'date' | reverse | limit: 6 %}
    {% for post in recent_posts %}
      <div class="post-card">
        <div class="post-card-header">
          <h3 class="post-card-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          <div class="post-card-meta">
            <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
            {% if post.categories %}
              <span class="post-categories">
                {% for category in post.categories limit: 2 %}
                  <a href="/categories/#{{ category | slugify }}">{{ category }}</a>
                  {% unless forloop.last %}, {% endunless %}
                {% endfor %}
              </span>
            {% endif %}
          </div>
        </div>
        {% if post.description %}
          <div class="post-card-excerpt">
            {{ post.description }}
          </div>
        {% endif %}
        {% if post.tags %}
          <div class="post-card-tags">
            {% for tag in post.tags limit: 3 %}
              <a href="/tags/#{{ tag | slugify }}" class="tag">{{ tag }}</a>
            {% endfor %}
          </div>
        {% endif %}
      </div>
    {% endfor %}
  </div>
  <div class="view-all-posts">
    <a href="/posts/" class="btn-primary">查看所有文章</a>
  </div>
</div>

<div class="categories-section">
  <h2 class="section-title">文章分类</h2>
  <div class="categories-grid">
    {% assign categories = site.categories | sort %}
    {% for category in categories %}
      <div class="category-card">
        <h3 class="category-title">
          <a href="/categories/#{{ category[0] | slugify }}">{{ category[0] }}</a>
        </h3>
        <div class="category-count">{{ category[1].size }} 篇文章</div>
        <div class="category-posts">
          {% for post in category[1] limit: 3 %}
            <div class="category-post">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </div>
          {% endfor %}
        </div>
      </div>
    {% endfor %}
  </div>
</div>

<style>
/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.welcome-subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.welcome-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Featured Section */
.featured-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.featured-posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.post-card-header {
  margin-bottom: 15px;
}

.post-card-title {
  margin-bottom: 10px;
}

.post-card-title a {
  color: #333;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.post-card-title a:hover {
  color: #667eea;
}

.post-card-meta {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
}

.post-date {
  color: #999;
}

.post-categories a {
  color: #667eea;
  text-decoration: none;
}

.post-categories a:hover {
  text-decoration: underline;
}

.post-card-excerpt {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
}

.view-all-posts {
  text-align: center;
}

.btn-primary {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  color: white;
}

/* Categories Section */
.categories-section {
  margin-bottom: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.category-title {
  margin-bottom: 10px;
}

.category-title a {
  color: #333;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 600;
}

.category-title a:hover {
  color: #667eea;
}

.category-count {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.category-posts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-post a {
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.4;
}

.category-post a:hover {
  color: #667eea;
  text-decoration: underline;
}

/* Dark Theme */
[data-theme="dark"] .welcome-section {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

[data-theme="dark"] .post-card,
[data-theme="dark"] .category-card {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

[data-theme="dark"] .post-card-title a,
[data-theme="dark"] .category-title a {
  color: #e2e8f0;
}

[data-theme="dark"] .post-card-title a:hover,
[data-theme="dark"] .category-title a:hover {
  color: #81e6d9;
}

[data-theme="dark"] .post-card-excerpt,
[data-theme="dark"] .category-post a {
  color: #cbd5e0;
}

[data-theme="dark"] .tag {
  background: #4a5568;
  color: #cbd5e0;
}

[data-theme="dark"] .tag:hover {
  background: #81e6d9;
  color: #2d3748;
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-stats {
    gap: 20px;
  }
  
  .featured-posts {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .post-card-meta {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .welcome-section {
    padding: 40px 15px;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .welcome-stats {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
