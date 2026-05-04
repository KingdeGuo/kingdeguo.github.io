---
title: "WebLinkSniffer"
description: "一键提取并批量管理网页中的所有超链接"
date: 2025-01-01
type: "project"
weight: 1
---

**WebLinkSniffer** 是一款浏览器扩展和油猴脚本，帮助你在几秒钟内提取并管理网页中的所有超链接。

## 功能特性

| 特性 | 说明 |
|------|------|
| ⚡ 一键提取 | 即时抓取网页所有链接，无需手动复制 |
| 🧹 智能去重 | 自动移除重复链接并合并锚点变体 |
| 📄 智能分页 | 每页 5 个链接，不会滚动疲劳 |
| 🛡️ 高级过滤 | 按域名、关键词或正则表达式屏蔽 |
| ☑️ 批量操作 | 一键选择多个链接，批量打开/复制/屏蔽 |
| 🔍 实时搜索 | 输入即搜，秒级定位目标链接 |
| 🌍 多语言 | 原生支持中文和 English |
| 💾 会话记忆 | 自动记录已打开的链接，永不重复 |

## 安装方式

**方式一：浏览器扩展（推荐）**

支持 Chrome / Edge / Brave 等 Chromium 内核浏览器。

```bash
git clone https://github.com/KingdeGuo/WebLinkSniffer.git
```

然后进入 `chrome://extensions/` → 开启开发者模式 → 加载已解压的扩展。

**方式二：油猴脚本**

1. 安装 [Tampermonkey 扩展](https://www.tampermonkey.net/)
2. 打开 [tampermonkey_script.js](https://github.com/KingdeGuo/WebLinkSniffer/blob/main/tampermonkey_script.js)
3. 复制全部代码 → Tampermonkey → 创建新脚本 → 粘贴保存

安装后所有网页右下角会出现 🔗 浮动按钮，点击即可使用。

## 快速上手

1. 访问任意网页
2. 点击 🔗 图标（或油猴脚本的浮动按钮）
3. 浏览分页后的链接列表
4. 点击 🚫 屏蔽不需要的链接，☑️ 选择多个
5. 点击 "Open Selected" 批量打开

## 相关链接

- [GitHub 仓库](https://github.com/KingdeGuo/WebLinkSniffer)
- [I18N Integration Guide](https://github.com/KingdeGuo/WebLinkSniffer/blob/main/docs/I18N_GUIDE.md)
- [License: MIT](https://github.com/KingdeGuo/WebLinkSniffer/blob/main/LICENSE)