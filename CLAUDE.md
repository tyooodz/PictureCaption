# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**图片字幕生成器** - 一个网页工具，用于为图片添加自定义字幕。用户可以上传图片、配置字幕样式和内容，生成带有字幕的新图片。

- **技术栈**：原生 HTML5 + CSS3 + JavaScript（无依赖）
- **图片处理**：HTML5 Canvas API
- **架构**：单页应用，基于类的组件结构

## 快速开始

### 启动本地服务器
```bash
# Python 3
python -m http.server 8000

# 然后访问：http://localhost:8000
```

## 核心架构

### 布局系统
- **两栏布局**：左侧控制面板（47.6%）+ 右侧预览区域（52.4%）
- **响应式**：屏幕 ≤1024px 时垂直堆叠
- **页面标题**："图片字幕生成器"显示在主容器上方，左对齐

### 字幕渲染核心逻辑

Canvas 高度扩展方案：
```
新高度 = 原图高度 + (字幕行数 × 字幕高度) + (字幕行数 - 1) × 2px
```

关键步骤：
1. **位置**：字幕显示在原图**下方**（不覆盖原图）
2. **背景**：从原图底部切割 1×字幕高度 的像素作为基础背景
3. **视觉效果**：
   - 半透明黑色遮罩（rgba(0,0,0,0.5)）确保文字可读
   - 字幕行之间 2px 间隙
   - 文字水平和垂直居中

### 实时预览
- 颜色选择器改变时自动触发 `generateSubtitleImage()`
- 提供即时视觉反馈

### 占位符样式
- 使用 Flexbox 居中（`justify-content: center` + `align-items: center`）
- 绝对定位在预览面板内
- 左右各 80px padding 增加视觉留白

## 文件结构

| 文件 | 用途 |
|------|------|
| `index.html` | 页面结构和表单 |
| `styles.css` | 布局、样式、响应式设计 |
| `script.js` | 应用逻辑（PicCaptionApp 类） |
| `prd.md` | 产品需求文档 |

## 关键方法（script.js）

| 方法 | 功能 |
|------|------|
| `generateSubtitleImage()` | 主要字幕生成逻辑；扩展 canvas 并调用 drawSubtitles |
| `drawSubtitles()` | 在原图下方渲染字幕行（背景、遮罩、文字） |
| `handleFileUpload()` | 处理上传的图片文件 |
| `saveImage()` | 下载生成的图片为 PNG |
| `getParameters()` | 收集表单中的所有字幕设置 |

## 约束条件

- 字幕高度：20-200px
- 字体大小：10-100px
- 最大图片尺寸：5000×5000px
- 最多字幕行数：50 行
- 单行字幕最长：200 字符
- 最大文件大小：10MB

## CSS 变量

`:root` 中定义的关键变量：
- `--primary-color`: #0066ff（按钮、焦点状态）
- `--border-color`: #d0d0d0（表单输入框）
- `--text-secondary`: #999（占位符文本）
- `--padding-size`: 24px（控制面板内边距）
- `--gap-size`: 16px（面板间距）

## 修改指南

### UI/布局修改
编辑 `styles.css`：
- 调整布局比例：修改 `.control-panel` 和 `.preview-panel` 的 `width`
- 修改颜色：更新 `:root` 中的 CSS 变量
- 调整间距：修改 `--padding-size` 和 `--gap-size`

### 功能修改
编辑 `script.js`：
- 字幕渲染：修改 `drawSubtitles()` 方法
- 图片处理：修改 `generateSubtitleImage()` 方法
- 参数验证：修改 `getParameters()` 方法

### 表单字段修改
编辑 `index.html`：
- 添加新的字幕参数：在 `.section` 中添加表单控件
- 更新 `script.js` 中的 `initElements()` 获取新元素

## 浏览器支持

- Chrome、Firefox、Safari、Edge（现代版本）
- 需要 Canvas API 支持
- 全屏模式需要 Fullscreen API 支持

## 实现细节

- 应用使用单个 `PicCaptionApp` 类，在页面加载时实例化
- 所有 DOM 元素在 `initElements()` 中缓存以提升性能
- Toast 通知替代传统 alert 提升用户体验
- 支持拖拽上传和文件选择器两种上传方式
- Ctrl+S / Cmd+S 快捷键保存生成的图片
