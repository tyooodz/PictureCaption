class PicCaptionApp {
    constructor() {
        this.uploadedImage = null;
        this.generatedCanvas = null;
        // 改进：添加生成状态标志，防止重复点击生成按钮
        this.isGenerating = false;
        // 改进：定义常量，便于维护和修改限制条件
        this.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        this.MAX_IMAGE_WIDTH = 5000;
        this.MAX_IMAGE_HEIGHT = 5000;
        this.MAX_SUBTITLE_LINES = 50;
        this.MAX_SUBTITLE_LENGTH = 200;

        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileStatus = document.getElementById('fileStatus');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.placeholder = document.getElementById('placeholder');
        this.generateBtn = document.getElementById('generateBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.previewPanel = document.getElementById('previewPanel');
        // 改进：获取 toast 容器，用于显示通知
        this.toastContainer = document.getElementById('toastContainer');

        // 字幕设置
        this.subtitleHeight = document.getElementById('subtitleHeight');
        this.fontSize = document.getElementById('fontSize');
        this.fontColor = document.getElementById('fontColor');
        this.outlineColor = document.getElementById('outlineColor');
        this.fontFamily = document.getElementById('fontFamily');
        this.fontWeight = document.getElementById('fontWeight');
        this.subtitleText = document.getElementById('subtitleText');
    }

    attachEventListeners() {
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.generateBtn.addEventListener('click', () => this.generateSubtitleImage());
        this.saveBtn.addEventListener('click', () => this.saveImage());
        this.canvas.addEventListener('click', () => this.enterFullscreen());
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // 改进：添加拖拽上传功能，提升用户体验
        this.previewPanel.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.previewPanel.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.previewPanel.addEventListener('drop', (e) => this.handleDrop(e));

        // 改进：添加快捷键支持 (Ctrl+S 保存)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveImage();
            }
        });

        // 改进：添加颜色选择器实时预览
        this.fontColor.addEventListener('change', () => this.generateSubtitleImage());
        this.outlineColor.addEventListener('change', () => this.generateSubtitleImage());
    }

    // 改进：添加 toast 通知系统，替代 alert()
    // 原因：alert() 阻塞用户交互，toast 通知更友好
    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);

        // 使用 requestAnimationFrame 确保动画流畅
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // 3 秒后自动移除通知
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 改进：添加拖拽上传处理
    // 原因：提升用户体验，支持更多上传方式
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.previewPanel.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.previewPanel.style.backgroundColor = '';
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.previewPanel.style.backgroundColor = '';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.fileInput.files = files;
            this.handleFileUpload({ target: this.fileInput });
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 改进：验证文件类型
        if (!file.type.startsWith('image/')) {
            this.showNotification('请选择图片文件', 'error');
            return;
        }

        // 改进：验证文件大小，防止内存溢出
        // 原因：大文件可能导致浏览器卡顿或崩溃
        if (file.size > this.MAX_FILE_SIZE) {
            this.showNotification(`文件过大，最大支持 ${this.MAX_FILE_SIZE / 1024 / 1024}MB`, 'error');
            return;
        }

        const reader = new FileReader();

        // 改进：添加错误处理
        // 原因：文件读取可能失败，需要捕获异常
        reader.onerror = () => {
            this.showNotification('文件读取失败', 'error');
        };

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // 改进：验证图片尺寸
                if (img.width > this.MAX_IMAGE_WIDTH || img.height > this.MAX_IMAGE_HEIGHT) {
                    this.showNotification(
                        `图片尺寸过大，最大支持 ${this.MAX_IMAGE_WIDTH}x${this.MAX_IMAGE_HEIGHT}px`,
                        'error'
                    );
                    return;
                }
                this.uploadedImage = img;
                this.fileStatus.textContent = `已选择：${file.name}`;
                this.previewImage();
                this.showNotification('图片上传成功', 'success');
            };

            // 改进：添加图片加载错误处理
            img.onerror = () => {
                this.showNotification('图片加载失败', 'error');
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    previewImage() {
        if (!this.uploadedImage) return;

        this.canvas.width = this.uploadedImage.width;
        this.canvas.height = this.uploadedImage.height;
        this.ctx.drawImage(this.uploadedImage, 0, 0);
        this.placeholder.style.display = 'none';
        this.canvas.style.display = 'block';
    }

    generateSubtitleImage() {
        if (!this.uploadedImage) {
            this.showNotification('请先上传图片', 'error');
            return;
        }

        // 改进：防止重复点击生成按钮
        if (this.isGenerating) {
            this.showNotification('正在生成中，请稍候...', 'info');
            return;
        }

        const subtitles = this.subtitleText.value.trim().split('\n').filter(line => line.trim());
        if (subtitles.length === 0) {
            this.showNotification('请输入字幕内容', 'error');
            return;
        }

        // 改进：验证字幕行数
        if (subtitles.length > this.MAX_SUBTITLE_LINES) {
            this.showNotification(`字幕行数不能超过 ${this.MAX_SUBTITLE_LINES} 行`, 'error');
            return;
        }

        // 改进：验证单行字幕长度
        // 原因：过长的字幕可能导致文字溢出或显示不全
        if (subtitles.some(s => s.length > this.MAX_SUBTITLE_LENGTH)) {
            this.showNotification(
                `单行字幕不能超过 ${this.MAX_SUBTITLE_LENGTH} 个字符`,
                'error'
            );
            return;
        }

        // 改进：设置生成状态，禁用按钮
        this.isGenerating = true;
        this.generateBtn.disabled = true;

        try {
            const params = this.getParameters();

            // 改进：Canvas 高度 = 原图高度 + 字幕总高度（扩展高度）
            // 原因：字幕显示在原图下方，不覆盖原图
            const subtitleTotalHeight = subtitles.length * params.subtitleHeight + (subtitles.length - 1) * 1;
            const newCanvas = document.createElement('canvas');
            newCanvas.width = this.uploadedImage.width;
            newCanvas.height = this.uploadedImage.height + subtitleTotalHeight;
            const newCtx = newCanvas.getContext('2d');

            // 绘制原始图片
            newCtx.drawImage(this.uploadedImage, 0, 0);

            // 绘制字幕条和文字
            this.drawSubtitles(newCtx, subtitles, params);

            // 更新显示
            this.canvas.width = newCanvas.width;
            this.canvas.height = newCanvas.height;
            this.ctx.drawImage(newCanvas, 0, 0);
            this.generatedCanvas = newCanvas;
            this.saveBtn.disabled = false;

            this.showNotification('字幕生成成功', 'success');
        } catch (error) {
            // 改进：添加异常处理
            // 原因：Canvas 操作可能失败，需要捕获并报告错误
            console.error('生成字幕失败:', error);
            this.showNotification('生成字幕失败，请重试', 'error');
        } finally {
            // 改进：恢复生成状态
            this.isGenerating = false;
            this.generateBtn.disabled = false;
        }
    }

    drawSubtitles(ctx, subtitles, params) {
        // 改进：从原图底部切割基础背景（1×字幕行高）
        // 原因：所有字幕行使用相同的背景
        const baseBackgroundY = Math.max(0, this.uploadedImage.height - params.subtitleHeight);
        const originalImageHeight = this.uploadedImage.height;
        const gapHeight = 1;

        subtitles.forEach((subtitle, index) => {
            // 改进：从上往下堆叠字幕（显示在原图下方）
            // 原因：字幕显示在原图下方，不覆盖原图
            const y = originalImageHeight + index * (params.subtitleHeight + gapHeight);

            // 改进：复制基础背景到字幕位置
            // 原因：所有字幕行背景一致
            ctx.drawImage(
                this.uploadedImage,
                0, baseBackgroundY,  // 源图片的起始位置（原图底部）
                this.uploadedImage.width, params.subtitleHeight,  // 源图片的宽高
                0, y,  // 目标位置
                ctx.canvas.width, params.subtitleHeight  // 目标宽高
            );

            // 改进：绘制半透明阴影遮罩
            // 原因：确保文字清晰可读，同时保留原图的视觉信息
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';  // 半透明黑色遮罩
            ctx.fillRect(0, y, ctx.canvas.width, params.subtitleHeight);

            // 绘制字幕文字
            ctx.fillStyle = params.fontColor;
            ctx.font = `${params.fontWeight} ${params.fontSize}px ${params.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textX = ctx.canvas.width / 2;
            const textY = y + params.subtitleHeight / 2;
            ctx.fillText(subtitle.trim(), textX, textY);

            // 改进：绘制字幕间隙（浅灰色）
            // 原因：使字幕行之间的间隙更明显
            if (index < subtitles.length - 1) {
                ctx.fillStyle = '#f0f0f0';  // 非常浅的灰色
                ctx.fillRect(0, y + params.subtitleHeight, ctx.canvas.width, gapHeight);
            }
        });
    }

    getParameters() {
        return {
            subtitleHeight: Math.max(20, Math.min(200, parseInt(this.subtitleHeight.value) || 40)),
            fontSize: Math.max(10, Math.min(100, parseInt(this.fontSize.value) || 20)),
            fontColor: this.fontColor.value,
            outlineColor: this.outlineColor.value,
            fontFamily: this.fontFamily.value,
            fontWeight: this.fontWeight.value
        };
    }

    saveImage() {
        if (!this.generatedCanvas) {
            this.showNotification('请先生成字幕图片', 'error');
            return;
        }

        try {
            // 改进：添加 try-catch 处理保存过程中的异常
            this.generatedCanvas.toBlob((blob) => {
                if (!blob) {
                    this.showNotification('图片转换失败', 'error');
                    return;
                }

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `caption_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // 改进：及时释放 Object URL，防止内存泄漏
                // 原因：未释放的 Object URL 会占用内存
                URL.revokeObjectURL(url);

                this.showNotification('图片已保存', 'success');
            }, 'image/png');
        } catch (error) {
            // 改进：捕获保存过程中的异常
            console.error('保存图片失败:', error);
            this.showNotification('保存图片失败', 'error');
        }
    }

    enterFullscreen() {
        if (!this.generatedCanvas && !this.uploadedImage) return;

        const elem = this.previewPanel;

        // 改进：兼容不同浏览器的全屏 API
        // 原因：不同浏览器使用不同的前缀
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    handleFullscreenChange() {
        // 全屏状态变化时的处理
    }

    handleKeydown(event) {
        // 改进：处理 Esc 键退出全屏
        if (event.key === 'Escape') {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }
}

// 改进：等待 DOM 加载完成后初始化应用
// 原因：确保所有 DOM 元素都已加载
document.addEventListener('DOMContentLoaded', () => {
    new PicCaptionApp();
});
