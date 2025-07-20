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
          <div class="stat-number">{{ site.posts.size }}</div>
          <div class="stat-label">技术文章</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ site.categories.size }}</div>
          <div class="stat-label">知识分类</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ site.tags.size }}</div>
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




}

.card-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: float-card 6s ease-in-out infinite;
}

.card-2 {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: float-card 6s ease-in-out infinite 2s;
}

.card-3 {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation: float-card 6s ease-in-out infinite 4s;
}

.card-3d:hover {
  transform: scale(1.05) translateY(-10px);
  box-shadow: var(--shadow-heavy);
}

.card-content {
  padding: 1.5rem;
  text-align: center;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes float-card {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 特色文章区域 */
.featured-section {
  padding: 4rem 2rem;
  background: var(--bg-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.title-icon {
  margin-right: 0.5rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);


.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.category-info h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.category-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.category-preview {
  margin-bottom: 1.5rem;
}

.preview-item {
  margin-bottom: 0.75rem;
}

.preview-item a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  display: block;
  padding: 0.5rem 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.preview-item a:hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.05);
  padding-left: 0.5rem;
}

.category-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.3s ease;
}

.category-link:hover {
  gap: 0.5rem;
}

.link-arrow {
  transition: transform 0.3s ease;
}

.category-link:hover .link-arrow {
  transform: translateX(5px);
}

/* 技术栈展示 */
.skills-section {
  padding: 4rem 2rem;
  background: var(--bg-secondary);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.skill-category {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.skill-category:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.skill-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.skill-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.skill-icon {
  font-size: 1.5rem;
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  font-weight: 500;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

.skill-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--gradient-primary);
  width: var(--skill-level);
  transition: width 1s ease;
}

.skill-item span {
  position: relative;
  z-index: 1;
}

/* 联系区域 */
.contact-section {
  padding: 4rem 2rem;
  background: white;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-content {
  text-align: center;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.contact-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.contact-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  text-align: left;
}

.contact-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.contact-info p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.contact-arrow {
  font-size: 1.5rem;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.contact-card:hover .contact-arrow {
  transform: translateX(5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .title-highlight {
    font-size: 3rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .featured-grid,
  .categories-grid,
  .skills-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .floating-cards {
    width: 250px;
    height: 250px;
  }
  
  .card-3d {
    width: 150px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .welcome-section,
  .featured-section,
  .categories-section,
  .skills-section,
  .contact-section {
    padding: 2rem 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .title-highlight {
    font-size: 2.5rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-outline {
    justify-content: center;
  }
}

/* 暗色主题适配 */
[data-theme="dark"] {
  .welcome-section {
    background: rgba(26, 32, 44, 0.95);
  }
  
  .featured-section {
    background: var(--bg-secondary);
  }
  
  .categories-section {
    background: var(--bg-primary);
  }
  
  .skills-section {
    background: var(--bg-secondary);
  }
  
  .contact-section {
    background: var(--bg-primary);
  }
  
  .featured-card,
  .category-card,
  .skill-category,
  .contact-card {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }
  
  .stat-item {
    background: rgba(45, 55, 72, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .card-3d {
    background: rgba(45, 55, 72, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>

<script>
// 数字动画
function animateNumbers() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current);
    }, 16);
  });
}

// 技能条动画
function animateSkills() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    const level = item.getAttribute('data-level');
    item.style.setProperty('--skill-level', level + '%');
  });
}

// 页面加载完成后执行动画
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateNumbers, 500);
  setTimeout(animateSkills, 1000);
});

// 滚动动画
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// 观察所有需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.featured-card, .category-card, .skill-category, .contact-card');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
</script>

