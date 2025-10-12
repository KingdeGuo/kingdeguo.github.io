# KingdeGuo's Blog - Hugo Version

这是一个使用Hugo框架重构的个人博客，专注于SEO优化和性能提升。

## 🚀 特性

### SEO优化
- ✅ 自动生成sitemap.xml
- ✅ Open Graph和Twitter Card支持
- ✅ 结构化数据（Schema.org）
- ✅ 规范的URL结构
- ✅ 优化的meta标签
- ✅ 自动生成robots.txt

### 性能优化
- ⚡ 极速构建（Hugo比Jekyll快10-100倍）
- 📱 响应式设计
- 🎨 现代化CSS设计系统
- 🔍 内置搜索功能
- 💬 Giscus评论系统
- 📊 Google Analytics集成

### 用户体验
- 📖 阅读进度条
- 📋 代码复制按钮
- 📱 移动端优化
- 🎯 平滑滚动
- 🔗 内部链接优化

## 📁 项目结构

```
kingdeguo.github.io/
├── content/              # 内容文件
│   ├── _index.md        # 首页内容
│   ├── about.md         # 关于页面
│   └── posts/           # 博客文章
├── layouts/             # 模板文件
│   ├── _default/        # 默认布局
│   └── index.html       # 首页布局
├── assets/              # 静态资源
│   ├── css/             # 样式文件
│   └── js/              # JavaScript文件
├── static/              # 静态文件
│   ├── robots.txt       # 搜索引擎爬虫配置
│   └── favicon.ico      # 网站图标
├── .github/workflows/   # GitHub Actions
│   └── hugo.yml         # 自动部署配置
└── hugo.toml           # Hugo配置文件
```

## 🛠️ 本地开发

### 安装Hugo

```bash
# macOS
brew install hugo

# Windows
choco install hugo-extended

# Linux
sudo snap install hugo
```

### 本地运行

```bash
# 启动开发服务器
hugo server -D

# 构建静态文件
hugo
```

### 访问地址
- 开发服务器: http://localhost:1313
- 生产网站: https://kingdeguo.github.io

## 📝 内容管理

### 创建新文章

```bash
hugo new posts/文章标题.md
```

### 文章Front Matter示例

```yaml
---
title: "文章标题"
description: "文章描述"
date: 2025-10-12
categories: ["分类"]
tags: ["标签1", "标签2"]
draft: false
---
```

## 🔧 部署

网站通过GitHub Actions自动部署：

1. 推送到`master`分支
2. GitHub Actions自动构建Hugo网站
3. 部署到GitHub Pages

## 📊 SEO检查清单

- [x] 所有页面都有唯一的title和description
- [x] 支持Open Graph和Twitter Card
- [x] 结构化数据实现
- [x] 规范的URL结构
- [x] robots.txt配置
- [x] sitemap.xml自动生成
- [x] 图片alt标签
- [x] 内部链接优化
- [x] 移动端友好
- [x] 页面加载速度优化

## 🎯 下一步计划

- [ ] 迁移旧Jekyll文章
- [ ] 添加更多可视化组件
- [ ] 实现高级搜索功能
- [ ] 添加暗色主题
- [ ] 优化图片处理管道
- [ ] 添加PWA支持

## 📞 联系方式

- 邮箱: kingdeguo@gmail.com
- GitHub: [kingdeguo](https://github.com/kingdeguo)
- 博客: [https://kingdeguo.github.io](https://kingdeguo.github.io)

---

**注意**: 这是一个从Jekyll迁移到Hugo的项目，旨在提供更好的SEO优化和性能表现。
