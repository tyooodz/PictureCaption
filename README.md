# 图片字幕生成器

一个简洁高效的网页工具，用于为图片添加自定义字幕。无需安装任何依赖，直接在浏览器中使用。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ 功能特性

- 📤 **图片上传** - 支持拖拽和文件选择两种方式上传图片
- 🎨 **自定义字幕** - 灵活配置字幕样式（高度、字体、颜色等）
- 👁️ **实时预览** - 修改参数时即时更新预览效果
- 💾 **一键保存** - 生成的图片可直接下载到本地
- 🖥️ **全屏模式** - 点击预览区域进入全屏查看
- ⌨️ **快捷键支持** - Ctrl+S / Cmd+S 快速保存
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🚀 **零依赖** - 纯原生 HTML5 + CSS3 + JavaScript

## 🚀 快速开始

### 在线使用
直接在浏览器中打开 `index.html` 文件即可使用。

### 本地开发
```bash
# 克隆项目
git clone https://github.com/yourusername/pic_caption.git
cd pic_caption

# 启动本地服务器（Python 3）
python -m http.server 8000

# 访问 http://localhost:8000
```

## 📖 使用方法

1. **上传图片**
   - 点击"选择图片"按钮或拖拽图片到预览区域
   - 支持 JPG、PNG、GIF、WebP 格式

2. **配置字幕**
   - 设置字幕高度（20-200px）
   - 选择字体大小（10-100px）
   - 选择字体颜色和背景颜色
   - 选择字体样式和粗细

3. **输入字幕内容**
   - 在文本框中输入字幕，每行作为一个独立字幕条
   - 最多支持 50 行，每行最长 200 字符

4. **生成和保存**
   - 点击"生成字幕图片"预览效果
   - 满意后点击"保存图片"下载

## 🛠️ 技术栈

- **前端框架**：原生 HTML5 + CSS3 + JavaScript
- **图片处理**：HTML5 Canvas API
- **布局**：Flexbox 响应式设计
- **浏览器兼容**：Chrome、Firefox、Safari、Edge（现代版本）

## 📁 项目结构

```
pic_caption/
├── index.html          # 页面结构
├── styles.css          # 样式表（布局、响应式设计）
├── script.js           # 应用逻辑（PicCaptionApp 类）
├── prd.md             # 产品需求文档
├── CLAUDE.md          # 开发指南
├── .gitignore         # Git 忽略配置
└── README.md          # 本文件
```

## 🎯 核心特性详解

### 字幕渲染
- 字幕显示在原图**下方**，不覆盖原图内容
- Canvas 高度自动扩展以容纳字幕
- 每行字幕使用原图底部像素作为背景，确保视觉一致性
- 半透明黑色遮罩确保文字清晰可读
- 字幕行之间 2px 间隙，视觉效果更佳

### 实时预览
- 颜色选择器改变时自动更新预览
- 无需手动点击生成按钮即可看到效果

### 用户体验
- Toast 通知替代传统 alert，更友好
- 支持拖拽上传，操作更便捷
- 快捷键支持，提升效率

## 📋 约束条件

| 项目 | 限制 |
|------|------|
| 字幕高度 | 20-200px |
| 字体大小 | 10-100px |
| 最大图片尺寸 | 5000×5000px |
| 最多字幕行数 | 50 行 |
| 单行字幕长度 | 200 字符 |
| 最大文件大小 | 10MB |

## 🔧 开发指南

详见 [CLAUDE.md](./CLAUDE.md) 文件，包含：
- 项目架构说明
- 关键方法文档
- 修改指南
- CSS 变量说明

## 📸 截图

### 主界面
- 左侧：字幕参数配置面板
- 右侧：图片预览区域
- 顶部：项目标题

### 功能演示
1. 上传图片 → 2. 配置参数 → 3. 输入字幕 → 4. 生成预览 → 5. 保存下载

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

## 💡 常见问题

**Q: 支持哪些图片格式？**
A: 支持 JPG、PNG、GIF、WebP 等现代浏览器支持的格式。

**Q: 生成的图片质量如何？**
A: 使用 Canvas API 生成，质量与原图相同，字幕部分为新增内容。

**Q: 可以离线使用吗？**
A: 可以，下载所有文件后在本地打开 index.html 即可使用。

**Q: 支持批量处理吗？**
A: 目前不支持，但可以逐个处理多张图片。

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交 Issue
- 发送邮件

## 🙏 致谢

感谢所有贡献者和用户的支持！

---

**Made with ❤️ by Claude Code**
