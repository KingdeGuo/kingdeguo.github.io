---
layout: home
title: KingdeGuo's Blog
author_profile: true
---

<!-- 英雄区域 -->
<section class="hero-section">
  <div class="hero-background">
    <div class="hero-particles"></div>
  </div>
  <div class="hero-content">
    <div class="hero-text">
      <h1 class="hero-title">
        <span class="gradient-text">KingdeGuo</span>
        <span class="hero-subtitle">技术博客</span>
      </h1>
      <p class="hero-description">
        分享技术、生活和思考的地方<br>
        专注于AI、量化投资、时间管理等领域
      </p>
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-number">{{ site.posts.size }}</div>
          <div class="stat-label">文章</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ site.categories.size }}</div>
          <div class="stat-label">分类</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ site.tags.size }}</div>
          <div class="stat-label">标签</div>
        </div>
      </div>
      <div class="hero-actions">
        <a href="/posts/" class="btn-primary">浏览文章</a>
        <a href="/about/" class="btn-secondary">关于我</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="floating-card">
        <div class="card-icon">🚀</div>
        <div class="card-text">技术分享</div>
      </div>
      <div class="floating-card">
        <div class="card-icon">💡</div>
        <div class="card-text">思考感悟</div>
      </div>
      <div class="floating-card">
        <div class="card-icon">📈</div>
        <div class="card-text">成长记录</div>
      </div>
    </div>
  </div>
</section>

<!-- 特色内容区域 -->
<section class="featured-section">
  <div class="section-header">
    <h2 class="section-title">最新文章</h2>
    <p class="section-subtitle">精选技术文章和深度思考</p>
  </div>
  
  <div class="featured-grid">
    {% assign recent_posts = site.posts | sort: 'date' | reverse | limit: 6 %}
    {% for post in recent_posts %}
      <article class="featured-card">
        <div class="card-header">
          <div class="card-categories">
            {% if post.categories %}
              {% for category in post.categories limit: 2 %}
                <span class="category-tag">{{ category }}</span>
              {% endfor %}
            {% endif %}
          </div>
          <div class="card-date">{{ post.date | date: "%m.%d" }}</div>
        </div>
        <div class="card-content">
          <h3 class="card-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          {% if post.description %}
            <p class="card-excerpt">{{ post.description }}</p>
          {% endif %}
        </div>
        <div class="card-footer">
          {% if post.tags %}
            <div class="card-tags">
              {% for tag in post.tags limit: 3 %}
                <span class="tag">{{ tag }}</span>
              {% endfor %}
            </div>
          {% endif %}
          <a href="{{ post.url | relative_url }}" class="read-more">
            阅读全文 <span>→</span>
          </a>
        </div>
      </article>
    {% endfor %}
  </div>
  
  <div class="section-footer">
    <a href="/posts/" class="btn-outline">查看所有文章</a>
  </div>
</section>

<!-- 分类展示区域 -->
<section class="categories-section">
  <div class="section-header">
    <h2 class="section-title">文章分类</h2>
    <p class="section-subtitle">按主题浏览感兴趣的内容</p>
  </div>
  
  <div class="categories-grid">
    {% assign categories = site.categories | sort %}
    {% for category in categories %}
      <div class="category-card">
        <div class="category-header">
          <h3 class="category-title">{{ category[0] }}</h3>
          <div class="category-count">{{ category[1].size }} 篇文章</div>
        </div>
        <div class="category-preview">
          {% for post in category[1] limit: 3 %}
            <div class="preview-item">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </div>
          {% endfor %}
        </div>
        <a href="/categories/#{{ category[0] | slugify }}" class="category-link">
          查看全部 <span>→</span>
        </a>
      </div>
    {% endfor %}
  </div>
</section>

<!-- 技术栈展示 -->
<section class="tech-stack-section">
  <div class="section-header">
    <h2 class="section-title">技术栈</h2>
    <p class="section-subtitle">我擅长的技术领域</p>
  </div>
  
  <div class="tech-grid">
    <div class="tech-category">
      <h3>前端技术</h3>
      <div class="tech-items">
        <span class="tech-item">React</span>
        <span class="tech-item">Vue</span>
        <span class="tech-item">TypeScript</span>
        <span class="tech-item">ECharts</span>
      </div>
    </div>
    
    <div class="tech-category">
      <h3>后端技术</h3>
      <div class="tech-items">
        <span class="tech-item">Python</span>
        <span class="tech-item">Node.js</span>
        <span class="tech-item">Java</span>
        <span class="tech-item">Docker</span>
      </div>
    </div>
    
    <div class="tech-category">
      <h3>AI/ML</h3>
      <div class="tech-items">
        <span class="tech-item">TensorFlow</span>
        <span class="tech-item">PyTorch</span>
        <span class="tech-item">LangChain</span>
        <span class="tech-item">OpenAI</span>
      </div>
    </div>
    
    <div class="tech-category">
      <h3>数据科学</h3>
      <div class="tech-items">
        <span class="tech-item">Pandas</span>
        <span class="tech-item">NumPy</span>
        <span class="tech-item">SQL</span>
        <span class="tech-item">Redis</span>
      </div>
    </div>
  </div>
</section>

<!-- 联系区域 -->
<section class="contact-section">
  <div class="contact-content">
    <h2>让我们一起交流</h2>
    <p>有任何问题或想法，欢迎联系我</p>
    <div class="contact-links">
      <a href="https://github.com/KingdeGuo" class="contact-link">
        <span class="contact-icon">📱</span>
        <span>GitHub</span>
      </a>
      <a href="mailto:your-email@example.com" class="contact-link">
        <span class="contact-icon">📧</span>
        <span>Email</span>
      </a>
      <a href="/about/" class="contact-link">
        <span class="contact-icon">👤</span>
        <span>关于我</span>
      </a>
    </div>
  </div>
</section>

<style>
/* 英雄区域样式 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px, 80px 80px, 120px 120px;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  align-items: center;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  display: block;
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.9;
  margin-top: 10px;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

.btn-primary, .btn-secondary {
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(255,255,255,0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,255,255,0.4);
}

.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.2);
  animation: float 6s ease-in-out infinite;
}

.floating-card:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-card:nth-child(2) {
  top: 50%;
  right: 20%;
  animation-delay: 2s;
}

.floating-card:nth-child(3) {
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.card-text {
  color: white;
  font-weight: 600;
}

/* 特色内容区域 */
.featured-section {
  padding: 80px 20px;
  background: #f8f9fa;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto 50px;
}

.featured-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #667eea;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-categories {
  display: flex;
  gap: 8px;
}

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-date {
  color: #999;
  font-size: 0.9rem;
}

.card-title {
  margin-bottom: 15px;
}

.card-title a {
  color: #333;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.4;
}

.card-title a:hover {
  color: #667eea;
}

.card-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-tags {
  display: flex;
  gap: 5px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.read-more {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.read-more:hover {
  text-decoration: underline;
}

.section-footer {
  text-align: center;
}

.btn-outline {
  display: inline-block;
  padding: 15px 30px;
  border: 2px solid #667eea;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* 分类展示区域 */
.categories-section {
  padding: 80px 20px;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 30px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-color: #667eea;
}

.category-header {
  margin-bottom: 20px;
}

.category-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.category-count {
  color: #666;
  font-size: 0.9rem;
}

.category-preview {
  margin-bottom: 20px;
}

.preview-item {
  margin-bottom: 8px;
}

.preview-item a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.4;
}

.preview-item a:hover {
  color: #667eea;
}

.category-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.category-link:hover {
  text-decoration: underline;
}

/* 技术栈展示 */
.tech-stack-section {
  padding: 80px 20px;
  background: #f8f9fa;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.tech-category {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.tech-category:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.tech-category h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.tech-item {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 联系区域 */
.contact-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.contact-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.contact-content p {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.contact-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}

.contact-link:hover {
  transform: translateY(-3px);
  background: rgba(255,255,255,0.2);
}

.contact-icon {
  font-size: 2rem;
}

/* 暗色主题适配 */
[data-theme="dark"] .featured-section {
  background: #1a1a1a;
}

[data-theme="dark"] .section-title {
  color: #e2e8f0;
}

[data-theme="dark"] .section-subtitle {
  color: #cbd5e0;
}

[data-theme="dark"] .featured-card {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

[data-theme="dark"] .featured-card:hover {
  border-color: #81e6d9;
}

[data-theme="dark"] .card-title a {
  color: #e2e8f0;
}

[data-theme="dark"] .card-title a:hover {
  color: #81e6d9;
}

[data-theme="dark"] .card-excerpt {
  color: #cbd5e0;
}

[data-theme="dark"] .tag {
  background: #4a5568;
  color: #cbd5e0;
}

[data-theme="dark"] .read-more {
  color: #81e6d9;
}

[data-theme="dark"] .categories-section {
  background: #1a1a1a;
}

[data-theme="dark"] .category-card {
  background: #2d3748;
  border-color: #4a5568;
}

[data-theme="dark"] .category-card:hover {
  border-color: #81e6d9;
}

[data-theme="dark"] .category-title {
  color: #e2e8f0;
}

[data-theme="dark"] .preview-item a {
  color: #cbd5e0;
}

[data-theme="dark"] .preview-item a:hover {
  color: #81e6d9;
}

[data-theme="dark"] .category-link {
  color: #81e6d9;
}

[data-theme="dark"] .tech-stack-section {
  background: #1a1a1a;
}

[data-theme="dark"] .tech-category {
  background: #2d3748;
  color: #e2e8f0;
}

[data-theme="dark"] .tech-category h3 {
  color: #e2e8f0;
}

[data-theme="dark"] .tech-item {
  background: #4a5568;
  color: #81e6d9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-visual {
    height: 300px;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-links {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>
