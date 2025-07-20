---
layout: modern-home
---

<!-- 动态背景区域 -->
<div class="hero-background">
  <div class="animated-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
    <div class="shape shape-4"></div>
    <div class="shape shape-5"></div>
  </div>
  <div class="particles-overlay"></div>
</div>

<!-- 主要内容区域 -->
<main class="main-content">
  <!-- 欢迎区域 -->
  <section class="welcome-section">
    <div class="welcome-container">
      <div class="welcome-text">
        <h1 class="main-title">
          <span class="title-line">Hello, I'm</span>
          <span class="title-highlight">KingdeGuo</span>
          <span class="title-line">👋</span>
        </h1>
        <p class="main-subtitle">
          技术博主 | AI 研究者 | 量化投资者
        </p>
        <p class="main-description">
          在这里分享技术见解、生活感悟和成长历程<br>
          专注于人工智能、量化投资、时间管理等领域的深度探索
        </p>
        
        <!-- 动态统计 -->
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number" data-target="{{ site.posts.size }}">0</div>
            <div class="stat-label">技术文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-target="{{ site.categories.size }}">0</div>
            <div class="stat-label">知识分类</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-target="{{ site.tags.size }}">0</div>
            <div class="stat-label">技术标签</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-target="365">0</div>
            <div class="stat-label">学习天数</div>
          </div>
        </div>
        
        <!-- 行动按钮 -->
        <div class="action-buttons">
          <a href="/posts/" class="btn-primary">
            <span class="btn-icon">📚</span>
            <span class="btn-text">浏览文章</span>
          </a>
          <a href="/about/" class="btn-secondary">
            <span class="btn-icon">👤</span>
            <span class="btn-text">关于我</span>
          </a>
          <a href="#featured" class="btn-outline">
            <span class="btn-icon">⭐</span>
            <span class="btn-text">精选内容</span>
          </a>
        </div>
      </div>
      
      <!-- 3D 卡片展示 -->
      <div class="welcome-visual">
        <div class="floating-cards">
          <div class="card-3d card-1">
            <div class="card-content">
              <div class="card-icon">🚀</div>
              <div class="card-title">技术分享</div>
              <div class="card-desc">前沿技术解析</div>
            </div>
          </div>
          <div class="card-3d card-2">
            <div class="card-content">
              <div class="card-icon">💡</div>
              <div class="card-title">思考感悟</div>
              <div class="card-desc">深度思考记录</div>
            </div>
          </div>
          <div class="card-3d card-3">
            <div class="card-content">
              <div class="card-icon">📈</div>
              <div class="card-title">成长轨迹</div>
              <div class="card-desc">个人成长历程</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 特色文章区域 -->
  <section id="featured" class="featured-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">✨</span>
        精选文章
      </h2>
      <p class="section-subtitle">最新发布的技术文章和深度思考</p>
    </div>
    
    <div class="featured-grid">
      {% assign recent_posts = site.posts | sort: 'date' | reverse | limit: 6 %}
      {% for post in recent_posts %}
        <article class="featured-card" data-category="{{ post.categories | first }}">
          <div class="card-header">
            <div class="card-meta">
              <span class="post-date">{{ post.date | date: "%m.%d" }}</span>
              {% if post.categories %}
                <span class="post-category">{{ post.categories | first }}</span>
              {% endif %}
            </div>
            <div class="card-badge">
              <span class="badge-icon">📝</span>
            </div>
          </div>
          
          <div class="card-body">
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
              阅读全文 <span class="arrow">→</span>
            </a>
          </div>
          
          <!-- 悬停效果 -->
          <div class="card-hover"></div>
        </article>
      {% endfor %}
    </div>
    
    <div class="section-footer">
      <a href="/posts/" class="btn-view-all">
        <span>查看所有文章</span>
        <span class="btn-arrow">→</span>
      </a>
    </div>
  </section>

  <!-- 分类展示区域 -->
  <section class="categories-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">📂</span>
        文章分类
      </h2>
      <p class="section-subtitle">按主题浏览感兴趣的内容</p>
    </div>
    
    <div class="categories-grid">
      {% assign categories = site.categories | sort %}
      {% for category in categories %}
        <div class="category-card" data-category="{{ category[0] }}">
          <div class="category-header">
            <div class="category-icon">
              {% case category[0] %}
                {% when 'AI' %}🤖
                {% when '技术' %}💻
                {% when '投资' %}📊
                {% when '时间管理' %}⏰
                {% when '思考' %}🧠
                {% else %}📝
              {% endcase %}
            </div>
            <div class="category-info">
              <h3 class="category-title">{{ category[0] }}</h3>
              <div class="category-count">{{ category[1].size }} 篇文章</div>
            </div>
          </div>
          
          <div class="category-preview">
            {% for post in category[1] limit: 3 %}
              <div class="preview-item">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </div>
            {% endfor %}
          </div>
          
          <a href="/categories/#{{ category[0] | slugify }}" class="category-link">
            查看全部 <span class="link-arrow">→</span>
          </a>
        </div>
      {% endfor %}
    </div>
  </section>

  <!-- 技术栈展示 -->
  <section class="skills-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">🛠️</span>
        技术栈
      </h2>
      <p class="section-subtitle">我擅长的技术领域和工具</p>
    </div>
    
    <div class="skills-grid">
      <div class="skill-category">
        <div class="skill-header">
          <h3>前端技术</h3>
          <div class="skill-icon">🎨</div>
        </div>
        <div class="skill-items">
          <span class="skill-item" data-level="90">React</span>
          <span class="skill-item" data-level="85">Vue</span>
          <span class="skill-item" data-level="88">TypeScript</span>
          <span class="skill-item" data-level="82">ECharts</span>
        </div>
      </div>
      
      <div class="skill-category">
        <div class="skill-header">
          <h3>后端技术</h3>
          <div class="skill-icon">⚙️</div>
        </div>
        <div class="skill-items">
          <span class="skill-item" data-level="92">Python</span>
          <span class="skill-item" data-level="85">Node.js</span>
          <span class="skill-item" data-level="80">Java</span>
          <span class="skill-item" data-level="88">Docker</span>
        </div>
      </div>
      
      <div class="skill-category">
        <div class="skill-header">
          <h3>AI/ML</h3>
          <div class="skill-icon">🤖</div>
        </div>
        <div class="skill-items">
          <span class="skill-item" data-level="90">TensorFlow</span>
          <span class="skill-item" data-level="88">PyTorch</span>
          <span class="skill-item" data-level="85">LangChain</span>
          <span class="skill-item" data-level="92">OpenAI</span>
        </div>
      </div>
      
      <div class="skill-category">
        <div class="skill-header">
          <h3>数据科学</h3>
          <div class="skill-icon">📊</div>
        </div>
        <div class="skill-items">
          <span class="skill-item" data-level="95">Pandas</span>
          <span class="skill-item" data-level="90">NumPy</span>
          <span class="skill-item" data-level="85">SQL</span>
          <span class="skill-item" data-level="88">Redis</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 联系区域 -->
  <section class="contact-section">
    <div class="contact-container">
      <div class="contact-content">
        <h2 class="contact-title">让我们一起交流</h2>
        <p class="contact-subtitle">有任何问题或想法，欢迎联系我</p>
        
        <div class="contact-grid">
          <a href="https://github.com/KingdeGuo" class="contact-card" target="_blank">
            <div class="contact-icon">📱</div>
            <div class="contact-info">
              <h3>GitHub</h3>
              <p>查看我的开源项目</p>
            </div>
            <div class="contact-arrow">→</div>
          </a>
          
          <a href="mailto:your-email@example.com" class="contact-card">
            <div class="contact-icon">📧</div>
            <div class="contact-info">
              <h3>Email</h3>
              <p>直接邮件联系</p>
            </div>
            <div class="contact-arrow">→</div>
          </a>
          
          <a href="/about/" class="contact-card">
            <div class="contact-icon">👤</div>
            <div class="contact-info">
              <h3>关于我</h3>
              <p>了解更多信息</p>
            </div>
            <div class="contact-arrow">→</div>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
/* 全局样式 */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --text-light: #718096;
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --bg-dark: #1a202c;
  --border-color: #e2e8f0;
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.1);
  --shadow-heavy: 0 20px 40px rgba(0, 0, 0, 0.15);
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

[data-theme="dark"] {
  --text-primary: #e2e8f0;
  --text-secondary: #cbd5e0;
  --text-light: #a0aec0;
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --border-color: #4a5568;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
  overflow-x: hidden;
}

/* 动态背景 */
.hero-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: var(--gradient-primary);
  overflow: hidden;
}

.animated-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 15s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 40%;
  left: 60%;
  animation-delay: 20s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

/* 主要内容区域 */
.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* 欢迎区域 */
.welcome-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.welcome-container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.welcome-text {
  text-align: left;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.title-line {
  display: block;
  color: var(--text-primary);
}

.title-highlight {
  display: block;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 4rem;
}

.main-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.main-description {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* 统计容器 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 行动按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-outline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-medium);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.btn-secondary {
  background: var(--gradient-secondary);
  color: white;
  box-shadow: var(--shadow-medium);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* 3D 卡片展示 */
.welcome-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-cards {
  position: relative;
  width: 300px;
  height: 300px;
}

.card-3d {
  position: absolute;
  width: 200px;
  height: 120px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
  cursor: pointer;
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
  max-width: 600px;
  margin: 0 auto;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.featured-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.post-date {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
}

.post-category {
  background: var(--gradient-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-badge {
  width: 40px;
  height: 40px;
  background: var(--gradient-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.card-body {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.card-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-title a:hover {
  color: var(--primary-color);
}

.card-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.3s ease;
}

.read-more:hover {
  gap: 0.5rem;
}

.arrow {
  transition: transform 0.3s ease;
}

.read-more:hover .arrow {
  transform: translateX(5px);
}

.section-footer {
  text-align: center;
  margin-top: 3rem;
}

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--gradient-primary);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-medium);
}

.btn-view-all:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn-view-all:hover .btn-arrow {
  transform: translateX(5px);
}

/* 分类展示区域 */
.categories-section {
  padding: 4rem 2rem;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

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

