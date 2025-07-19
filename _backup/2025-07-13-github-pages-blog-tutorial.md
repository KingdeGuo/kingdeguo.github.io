---
title: "GitHub Pages博客搭建教程 - 从零开始创建个人技术博客"
date: 2025-07-13
layout: post
comments: true
author_profile: true
description: "手把手教你使用GitHub Pages和Jekyll搭建免费个人博客，包含详细步骤、常见问题解决和SEO优化技巧"
keywords: "GitHub Pages教程,Jekyll博客搭建,免费个人博客,技术博客搭建,GitHub静态网站"
categories: [GitHub教程, 博客搭建]
tags: [GitHub Pages, Jekyll, 静态网站, 博客搭建, 技术博客]
og_image: "/assets/images/github-pages-demo.png"
---

本文将从零开始教你搭建一个功能完整的GitHub Pages博客，包含详细配置示例、常见问题解决方案和进阶技巧。通过本教程，你将学会如何创建一个专业的技术博客，支持代码高亮、数学公式、评论系统、SEO优化等高级功能。

## 为什么选择GitHub Pages？

**核心优势：**
- ✅ **完全免费** - 无需支付服务器费用
- ✅ **自动部署** - 推送代码即自动发布
- ✅ **版本控制** - 基于Git的完整历史记录
- ✅ **自定义域名** - 支持绑定个人域名
- ✅ **HTTPS支持** - 自动SSL证书配置
- ✅ **全球CDN** - 快速访问体验

**适用场景：**
- 技术博客和文档站点
- 个人作品集展示
- 开源项目官网
- 学习笔记分享

## 1. 创建博客仓库

### 1.1 新建仓库
1. 登录GitHub → 点击右上角"+" → "New repository"
2. 仓库名格式：`你的用户名.github.io`（必须严格匹配）
3. 勾选"Initialize with README" → 创建仓库

**为什么重要**：GitHub会自动将`用户名.github.io`仓库发布为网站

### 1.2 仓库结构预览
```
你的用户名.github.io/
├── _config.yml          # 站点配置文件
├── _posts/              # 博客文章目录
├── _layouts/            # 页面模板
├── _includes/           # 可复用组件
├── assets/              # 静态资源
├── Gemfile              # Ruby依赖管理
└── index.md             # 首页内容
```

## 2. 环境准备

### 2.1 安装Ruby
```bash
# macOS (使用Homebrew)
brew install ruby

# Windows
# 下载RubyInstaller：https://rubyinstaller.org/

# Ubuntu/Debian
sudo apt-get install ruby-full
```

### 2.2 安装Jekyll和Bundler
```bash
gem install jekyll bundler
```

### 2.3 验证安装
```bash
ruby -v  # 需要 Ruby 2.7+
jekyll -v  # 需要 Jekyll 4.0+
```

### 2.4 环境常见问题
**macOS权限问题：**
```bash
# 如果提示权限错误，使用：
sudo gem install -n /usr/local/bin jekyll bundler
```

**Windows路径问题：**
```bash
# 确保Ruby在系统PATH中
ruby -v  # 应该显示版本号
```

## 3. 博客配置详解

### 3.1 基础配置文件
创建`/_config.yml`：
```yaml
# 站点信息
title: 我的技术博客
url: "https://kingdeguo.github.io"  # 替换为你的地址
description: >- 
  分享Web开发与云技术心得，记录技术成长之路
baseurl: ""  # 子路径（如果有）

# 作者信息
author:
  name: 你的名字
  email: your@email.com
  github: yourusername
  twitter: yourtwitter  # 可选
  bio: "全栈开发工程师，热爱开源技术"

# 构建配置
markdown: kramdown
highlighter: rouge
permalink: /:categories/:year/:month/:day/:title/

# 分页
paginate: 10
paginate_path: "/page:num/"

# 插件配置
plugins:
  - jekyll-feed         # RSS订阅
  - jekyll-seo-tag      # SEO优化
  - jekyll-sitemap      # 站点地图
  - jekyll-paginate     # 分页功能

# 国际化
lang: zh-CN
encoding: utf-8  # 解决中文乱码
timezone: Asia/Shanghai

# 社交链接
social:
  github: yourusername
  linkedin: yourlinkedin
  twitter: yourtwitter

# 评论系统（后续配置）
comments:
  provider: "giscus"  # 或 "disqus"
```

### 3.2 环境配置
创建`.gitignore`：
```
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
.DS_Store
.bundle/
vendor/
```

## 4. 主题和插件管理

### 4.1 创建Gemfile
```ruby
source "https://rubygems.org"

# GitHub Pages兼容版本
gem "github-pages", group: :jekyll_plugins

# 额外插件
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-archives"  # 文章归档
  gem "jekyll-paginate"  # 分页
end

# Windows用户需要
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# macOS用户需要
gem "webrick", "~> 1.7"
```

### 4.2 安装依赖
```bash
bundle install
```

### 4.3 主题选择建议
**官方主题：**
- `minima` - 简洁现代
- `cayman` - 项目展示
- `merlot` - 文档风格

**第三方主题：**
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)
- [Beautiful Jekyll](https://beautifuljekyll.com/)
- [Chirpy](https://chirpy.cotes.page/)

## 5. 撰写高质量文章

### 5.1 文章模板
创建`/_posts/2025-07-13-welcome-to-jekyll.md`：
```markdown
---
layout: post
title: "我的第一篇技术博客：从零开始的GitHub Pages之旅"
date: 2025-07-13 14:30:00 +0800
categories: [技术分享, GitHub教程]
tags: [github-pages, 入门教程, jekyll, 静态网站]
author: yourname
description: "详细记录搭建GitHub Pages博客的全过程，包含踩坑记录和最佳实践"
image: /assets/images/post-cover.jpg
comments: true
toc: true  # 显示目录
---

## 前言

欢迎来到我的技术博客！在这篇文章中，我将分享如何使用GitHub Pages和Jekyll搭建一个专业的技术博客...

## 正文内容

### 代码示例
```python
def hello_world():
    """这是第一个函数示例"""
    print("欢迎访问我的博客！")
    return "Hello, World!"

# 调用函数
result = hello_world()
```

### 数学公式支持
$$
E = mc^2
$$

### 表格示例
| 功能 | 状态 | 备注 |
|------|------|------|
| 代码高亮 | ✅ | 支持200+语言 |
| 数学公式 | ✅ | MathJax支持 |
| 响应式设计 | ✅ | 移动端适配 |

### 图片插入
![博客截图](https://via.placeholder.com/800x400?text=博客效果图)
*图1：博客首页预览*

### 提示框
> **💡 小贴士**：使用`{: .notice--info}`可以创建更美观的提示框

### 特色功能清单
- [x] 代码高亮和行号
- [x] 数学公式支持
- [x] 响应式设计
- [x] 评论系统集成
- [x] SEO优化
- [ ] 搜索功能
- [ ] 文章归档

## 总结

通过本文的学习，你应该已经掌握了...
```

### 5.2 文章最佳实践
**文件命名规范：**
```
YYYY-MM-DD-文章标题.md
例如：2025-07-13-github-pages-setup-guide.md
```

**Front Matter完整配置：**
```yaml
---
layout: post
title: "文章标题"
subtitle: "副标题（可选）"
date: 2025-07-13 14:30:00 +0800
updated: 2025-07-14 10:00:00 +0800  # 更新日期
categories: [分类1, 分类2]
tags: [标签1, 标签2, 标签3]
author: 作者名
description: "文章描述，用于SEO"
image: /assets/images/cover.jpg
comments: true
toc: true
toc_sticky: true  # 目录固定
math: true  # 启用数学公式
mermaid: true  # 启用流程图
---
```

## 6. 本地开发与测试

### 6.1 启动开发服务器
```bash
# 基础启动
bundle exec jekyll serve

# 带实时重载
bundle exec jekyll serve --livereload

# 指定端口
bundle exec jekyll serve --port 4001

# 局域网访问
bundle exec jekyll serve --host 0.0.0.0
```

### 6.2 开发环境优化
创建`_drafts/`目录存放草稿：
```bash
# 启动时包含草稿
bundle exec jekyll serve --drafts
```

### 6.3 调试技巧
```bash
# 查看详细日志
bundle exec jekyll build --verbose

# 检查配置错误
bundle exec jekyll doctor
```

## 7. 部署到GitHub

### 7.1 首次部署
```bash
# 初始化git仓库（如果还没做）
git init
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git

# 添加文件
git add .
git commit -m "初始化博客：添加基础配置和第一篇文章"

# 推送到GitHub
git push -u origin main
```

### 7.2 自动部署流程
1. 推送代码到GitHub
2. GitHub Actions自动构建（约1-2分钟）
3. 访问 `https://你的用户名.github.io` 查看最新内容

### 7.3 部署状态检查
在仓库的 **Actions** 标签页查看构建状态：
- ✅ 绿色：部署成功
- ❌ 红色：构建失败，点击查看错误日志

## 8. 常见问题解决方案

### 8.1 本地运行报错

**问题1：缺少webrick**
```bash
# 错误信息：cannot load such file -- webrick
bundle add webrick
bundle exec jekyll serve
```

**问题2：权限错误**
```bash
# macOS/Linux
sudo gem install -n /usr/local/bin jekyll bundler

# Windows以管理员身份运行
```

**问题3：端口占用**
```bash
# 指定其他端口
bundle exec jekyll serve --port 4001
```

### 8.2 页面未更新

**问题1：缓存问题**
```bash
# 清除所有缓存
bundle exec jekyll clean
bundle exec jekyll serve
```

**问题2：浏览器缓存**
- 强制刷新：Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
- 无痕模式访问

### 8.3 中文乱码

**解决方案：**
1. 确保所有文件使用UTF-8编码
2. 在`_config.yml`添加：
   ```yaml
   encoding: utf-8
   ```
3. 检查文件头部是否有：
   ```
   lang: zh-CN
   ```

### 8.4 依赖冲突

**问题：bundle install失败**
```bash
# 更新依赖
bundle update

# 删除Gemfile.lock重新安装
rm Gemfile.lock
bundle install

# 使用特定平台
bundle lock --add-platform x86_64-linux
```

### 8.5 图片显示问题

**相对路径问题：**
```markdown
<!-- 正确方式 -->
![图片描述]({{ '/assets/images/screenshot.png' | relative_url }})

<!-- 或者 -->
![图片描述](/assets/images/screenshot.png)
```

## 9. 进阶定制

### 9.1 添加自定义域名

**步骤1：DNS配置**
```dns
# A记录（根域名）
@     185.199.108.153
@     185.199.109.153
@     185.199.110.153
@     185.199.111.153

# CNAME记录（子域名）
www   你的用户名.github.io
```

**步骤2：仓库设置**
1. 仓库 → Settings → Pages → Custom domain
2. 输入你的域名：`yourdomain.com`
3. 勾选 "Enforce HTTPS"

**步骤3：创建CNAME文件**
在仓库根目录创建`CNAME`文件：
```
yourdomain.com
```

### 9.2 添加Google Analytics

**步骤1：获取跟踪ID**
1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建属性，获取跟踪ID：`G-XXXXXXXXXX`

**步骤2：配置**
在`_config.yml`添加：
```yaml
google_analytics: G-XXXXXXXXXX
```

**步骤3：验证**
部署后24-48小时，在Analytics后台查看数据

### 9.3 启用评论系统

**方案1：Giscus（推荐）**
```html
<!-- 在_includes/comments.html中添加 -->
<script src="https://giscus.app/client.js"
        data-repo="你的用户名/你的用户名.github.io"
        data-repo-id="R_kgDO..."
        data-category="General"
        data-category-id="DIC_kwDO..."
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
```

**方案2：Disqus**
```yaml
# _config.yml
comments:
  provider: "disqus"
  disqus:
    shortname: "your-disqus-shortname"
```

### 9.4 SEO优化配置

**完整SEO配置：**
```yaml
# _config.yml
twitter:
  username: yourtwitter
  card: summary_large_image

facebook:
  app_id: 1234567890
  publisher: yourfacebook

social:
  name: 你的名字
  links:
    - https://twitter.com/yourtwitter
    - https://github.com/yourgithub

webmaster_verifications:
  google: abc123
  bing: def456
```

### 9.5 添加搜索功能

**方案1：Simple Jekyll Search**
1. 下载 [simple-jekyll-search](https://github.com/christian-fei/Simple-Jekyll-Search)
2. 创建`search.json`：
   ```json
   ---
   layout: null
   ---
   [
     {% for post in site.posts %}
     {
       "title": "{{ post.title | escape }}",
       "url": "{{ post.url | relative_url }}",
       "date": "{{ post.date | date: "%B %e, %Y" }}",
       "excerpt": "{{ post.excerpt | strip_html | strip_newlines | truncate: 160 }}",
       "categories": "{{ post.categories | join: ', ' }}",
       "tags": "{{ post.tags | join: ', ' }}"
     }{% unless forloop.last %},{% endunless %}
     {% endfor %}
   ]
   ```
3. 添加搜索框到页面

### 9.6 性能优化

**图片优化：**
```yaml
# 使用WebP格式
plugins:
  - jekyll-webp

# 压缩HTML
plugins:
  - jekyll-compress-html
```

**CDN加速：**
```yaml
# 使用jsDelivr
assets:
  source_maps: false
  destination: "/assets"
  compression: true
```

## 10. 监控和维护

### 10.1 性能监控
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

### 10.2 链接检查
```bash
# 安装html-proofer
gem install html-proofer

# 检查死链
htmlproofer ./_site --check-html --check-img-http
```

### 10.3 定期维护清单
- [ ] 每月更新依赖
- [ ] 检查并修复死链
- [ ] 备份重要文章
- [ ] 更新个人信息
- [ ] 监控网站性能

## 11. 资源推荐

### 11.1 官方文档
- [Jekyll官方文档](https://jekyllrb.com/docs/)
- [GitHub Pages指南](https://pages.github.com/)
- [Liquid模板语言](https://shopify.github.io/liquid/)

### 11.2 免费主题推荐
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) - 功能最全
- [Chirpy](https://chirpy.cotes.page/) - 现代化设计
- [Beautiful Jekyll](https://beautifuljekyll.com/) - 易于定制

### 11.3 学习资源
- [Jekyll中文文档](https://jekyllcn.com/)
- [GitHub Pages社区](https://github.community/c/github-pages/32)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/jekyll)

### 11.4 工具推荐
- [Typora](https://typora.io/) - Markdown编辑器

## 总结

通过这篇详细的GitHub Pages博客搭建教程，你已经学会了：

1. **从零开始** - 创建GitHub仓库到完整部署
2. **环境配置** - Ruby、Jekyll的完整安装指南
3. **专业配置** - SEO优化、评论系统、自定义域名
4. **问题解决** - 常见错误的详细解决方案
5. **进阶技巧** - 性能优化、监控维护、主题定制

**下一步建议：**
- 立即动手创建你的第一个博客仓库
- 尝试撰写第一篇技术文章
- 探索更多Jekyll主题和插件
- 加入GitHub Pages社区交流经验

**持续学习：**
- 关注Jekyll官方更新
- 学习Markdown高级语法
- 研究SEO优化技巧
- 探索静态网站生成器的更多可能性

记住，搭建博客只是开始，持续创作优质内容才是关键。祝你写作愉快！

{% include related_posts.html 
   posts="2025-07-14-intro-to-llm-agent-hr.md,2025-07-13-test-categories-tags.md"
   titles="大模型Agent开发指南,博客分类标签管理"
%}
