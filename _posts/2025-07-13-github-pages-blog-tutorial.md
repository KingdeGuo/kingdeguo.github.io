---
title: "GitHub Pages博客搭建完整指南"
date: 2025-07-13
layout: post
comments: true
author_profile: true
categories: [技术教程, tutorial]
tags: [GitHub, Jekyll, 博客搭建, 静态网站]
---

本文将从零开始教你搭建一个功能完整的GitHub Pages博客，包含详细配置示例、常见问题解决方案和进阶技巧。

## 1. 创建博客仓库

1. 登录GitHub → 点击右上角"+" → "New repository"
2. 仓库名格式：`你的用户名.github.io`（必须严格匹配）
3. 勾选"Initialize with README" → 创建仓库

**为什么重要**：GitHub会自动将`用户名.github.io`仓库发布为网站

## 2. 环境准备

### 安装Ruby
```bash
# macOS (使用Homebrew)
brew install ruby

# Windows
# 下载RubyInstaller：https://rubyinstaller.org/
```

### 安装Jekyll和Bundler
```bash
gem install jekyll bundler
```

### 验证安装
```bash
ruby -v  # 需要 Ruby 2.7+
jekyll -v  # 需要 Jekyll 4.0+
```

## 3. 博客配置详解

创建`/_config.yml`：
```yaml
title: 我的技术博客
url: "https://kingdeguo.github.io"  # 替换为你的地址
description: >- 
  分享Web开发与云技术心得

# 重要配置
theme: minima
plugins:
  - jekyll-feed
  - jekyll-seo-tag  # SEO优化

# 国际化
lang: zh-CN
encoding: utf-8  # 解决中文乱码

# 作者信息
author:
  name: 你的名字
  email: your@email.com
  github: yourusername
```

## 4. 主题和插件管理

创建`Gemfile`：
```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-archives"  # 文章归档插件
```

安装依赖：
```bash
bundle install
```

## 5. 撰写高质量文章

创建`/_posts/2025-07-13-welcome-to-jekyll.md`：
```markdown
---
layout: post
title: "我的第一篇技术博客"
date: 2025-07-13 14:30:00 +0800
categories: [技术分享]
tags: [github-pages, 入门教程]
---

## 内容示例
```python
def hello_world():
    print("欢迎访问我的博客！")
```

### 特色功能：
- 代码高亮
- 数学公式支持
- 响应式设计

![博客截图](https://via.placeholder.com/800x400?text=博客效果图)
```

## 6. 本地开发与测试

启动服务：
```bash
bundle exec jekyll serve --livereload
```

访问 `http://localhost:4000` 实时预览

## 7. 部署到GitHub
```bash
git add .
git commit -m "初始化博客"
git push origin main
```

部署后访问：`https://你的用户名.github.io`

## 8. 常见问题解决方案

### 问题1：本地运行报错
```bash
# 缺少依赖时
bundle add webrick
bundle exec jekyll serve
```

### 问题2：页面未更新
```bash
# 清除缓存
bundle exec jekyll clean
```

### 问题3：中文乱码
确保所有文件：
1. 使用UTF-8编码
2. 在`_config.yml`添加：`encoding: utf-8`

### 问题4：依赖冲突
```bash
bundle update
```

## 9. 进阶定制

### 添加自定义域名
1. 在仓库设置 → Pages → Custom domain
2. 添加DNS解析：
   ```dns
   CNAME yourdomain.com -> 用户名.github.io
   ```

### 添加Google Analytics
在`_config.yml`添加：
```yaml
google_analytics: UA-XXXXX-Y
```

### 启用评论系统
安装Giscus：
```html
<script src="https://giscus.app/client.js"
        data-repo="[在此输入仓库]"
        data-repo-id="R_kgD..."
        data-category="..."
        async>
</script>
```

## 10. 资源推荐
- [Jekyll官方文档](https://jekyllrb.com/docs/)
- [GitHub Pages指南](https://pages.github.com/)
- [免费Jekyll主题](https://jekyllthemes.io/free)

希望这篇指南能帮你顺利搭建博客！遇到问题欢迎在评论区留言讨论。
