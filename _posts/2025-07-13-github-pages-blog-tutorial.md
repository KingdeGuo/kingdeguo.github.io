---
title: "GitHub Pages博客搭建教程"
date: 2025-07-13
layout: post
comments: true
author_profile: true
categories: [技术教程]
tags: [GitHub, Jekyll, 博客搭建]
---

嗨，最近有不少朋友问我怎么用GitHub Pages搭建个人博客。其实我之前也是折腾了好久才搞明白，今天就把我的经验分享给大家，希望能帮你少走弯路～

## 第一步：创建你的博客仓库

1. 登录GitHub，点击右上角"+"号新建仓库
2. 仓库名必须为`你的用户名.github.io`（比如我的是kingdeguo.github.io）
3. 勾选"Initialize this repository with a README"

小提示：这个仓库名是固定的，改了就没办法自动发布啦！

## 第二步：安装必要的工具

在电脑上安装：
1. Ruby（建议2.7以上版本）
2. Bundler（安装命令：`gem install bundler`）

```bash
# 检查是否安装成功
ruby -v
bundle -v
```

## 第三步：基础配置

在仓库根目录创建`_config.yml`文件：

```yaml
title: 我的个人博客
url: "https://你的用户名.github.io"
theme: minima  # 这是最简单的主题

# 插件配置
plugins:
  - jekyll-feed
```

## 第四步：安装主题和插件

创建`Gemfile`文件：

```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
```

然后运行：
```bash
bundle install
```

## 第五步：写你的第一篇文章

在`_posts`目录下新建文件，命名格式为`YYYY-MM-DD-标题.md`：

```markdown
---
layout: post
title: "我的第一篇文章"
date: 2025-07-13
---
大家好！这是我的第一篇博客文章～
```

## 第六步：本地预览

运行：
```bash
bundle exec jekyll serve
```
打开浏览器访问`http://localhost:4000`就能看到效果啦！

## 常见问题

1. 如果页面没更新，试试`bundle exec jekyll clean`
2. 部署后可能要等几分钟才能看到变化
3. 中文乱码问题可以在文件开头加`encoding: utf-8`

刚开始可能会遇到各种问题，别着急，我当初也是这样。有什么问题欢迎留言交流～
