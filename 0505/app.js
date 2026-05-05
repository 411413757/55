// 主應用程式邏輯
class WasteClassificationApp {
    constructor() {
        this.currentTab = 'search';
        this.history = [];
        this.model = null;
        this.cameraActive = false;
        this.currentStream = null;
        this.init();
    }

    async init() {
        this.loadHistory();
        this.setupEventListeners();
        this.renderCategories();
        this.updateHistoryDisplay();
        
        // 加載 AI 模型
        await this.loadAIModel();
    }

    // 加載 TensorFlow 模型
    async loadAIModel() {
        try {
            console.log('加載 MobileNet 模型...');
            this.model = await mobilenet.load();
            console.log('模型加載成功！');
        } catch (e) {
            console.error('模型載入失敗:', e);
        }
    }

    // 事件監聽器設定
    setupEventListeners() {
        // 標籤切換
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 搜尋功能
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // 快速搜尋按鈕
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById('searchInput').value = e.target.dataset.item;
                this.performSearch();
            });
        });

        // 分類卡片點擊
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-card')) {
                const categoryId = e.target.closest('.category-card').dataset.id;
                this.showCategoryDetails(categoryId);
            }
        });

        // 結果卡片點擊
        document.addEventListener('click', (e) => {
            if (e.target.closest('.result-card')) {
                const itemName = e.target.closest('.result-card').dataset.item;
                this.showItemDetails(itemName);
            }
        });

        // 彈窗關閉
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('resultModal').addEventListener('click', (e) => {
            if (e.target.id === 'resultModal') this.closeModal();
        });

        // 清除歷史紀錄
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // 歷史項目刪除
        document.addEventListener('click', (e) => {
            if (e.target.closest('.history-delete')) {
                const index = e.target.closest('.history-item').dataset.index;
                this.removeHistoryItem(index);
            }
        });

        // AI 分類事件
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });

        document.getElementById('cameraBtn').addEventListener('click', () => this.openCamera());
        document.getElementById('captureBtn').addEventListener('click', () => this.capturePhoto());
        document.getElementById('closeCameraBtn').addEventListener('click', () => this.closeCamera());
        document.getElementById('clearImageBtn').addEventListener('click', () => this.clearImage());
    }

    // 切換標籤
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // 更新標籤按鈕
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) btn.classList.add('active');
        });

        // 更新內容顯示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // 執行搜尋
    performSearch() {
        const keyword = document.getElementById('searchInput').value.trim();
        
        if (!keyword) {
            this.showMessage('請輸入垃圾名稱');
            return;
        }

        const results = wasteData.search(keyword);
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-message">
                    <p>🔍 找不到相關結果</p>
                    <p style="font-size: 12px; margin-top: 10px;">請嘗試其他關鍵詞</p>
                </div>
            `;
            return;
        }

        // 組裝結果卡片
        resultsContainer.innerHTML = results.map((item, index) => `
            <div class="result-card" data-item="${item.name}" data-index="${index}">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 24px;">${item.icon}</span>
                    <div class="result-name">${item.name}</div>
                </div>
                <span class="result-category" style="background: ${item.color};">${item.category}</span>
                <div class="result-description">${item.tips}</div>
            </div>
        `).join('');

        // 自動添加到歷史
        this.addToHistory(keyword);
    }

    // 顯示分類詳情
    showCategoryDetails(categoryId) {
        const category = wasteData.getCategoryById(categoryId);
        if (!category) return;

        const itemsList = category.items.map(item => 
            `<li><strong>${item.name}</strong> - ${item.tips}</li>`
        ).join('');

        this.showModal(`
            <h2>${category.icon} ${category.name}</h2>
            <p>${category.description}</p>
            <p style="margin-top: 15px; font-weight: 600; color: #333;">包含物品 (${category.items.length}個)：</p>
            <ul class="items-list">
                ${itemsList}
            </ul>
            <div class="tips">
                <strong>💡 分類提示：</strong>
                <ul style="margin-top: 8px; padding-left: 15px;">
                    <li>確保投放的垃圾屬於該類別</li>
                    <li>檢查物品狀態和清潔度</li>
                    <li>遵守社區垃圾分類規則</li>
                </ul>
            </div>
        `);
    }

    // 顯示物品詳情
    showItemDetails(itemName) {
        const item = wasteData.searchDatabase.find(i => i.name === itemName);
        if (!item) return;

        this.showModal(`
            <h2>${item.icon} ${item.name}</h2>
            <p><strong>分類：</strong> <span style="background: ${item.color}; color: white; padding: 5px 10px; border-radius: 20px;">${item.category}</span></p>
            <p style="margin-top: 15px;"><strong>處理方法：</strong></p>
            <p>${item.tips}</p>
            <div class="tips">
                <strong>📋 詳細說明：</strong>
                <ul style="margin-top: 8px; padding-left: 15px;">
                    ${this.getDetailedTips(item.category).map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `);

        // 添加到歷史
        this.addToHistory(itemName);
    }

    // 獲取詳細提示
    getDetailedTips(category) {
        const tips = {
            '可回收垃圾': [
                '清空容器內的物質',
                '如可能，清洗乾淨',
                '壓扁大型物品以節省空間',
                '移除不可回收的部分',
                '檢查回收編碼確認可回收性'
            ],
            '廚餘/生物垃圾': [
                '瀝乾水分以減少重量',
                '移除包裝和非食品垃圾',
                '避免投放油膩的食物',
                '生物垃圾將進行堆肥處理',
                '定期清理容器以防異味'
            ],
            '一般垃圾': [
                '無法回收或分解的物品',
                '放入指定的一般垃圾桶',
                '確保物品不含有害物質',
                '一般垃圾將進行填埋處理',
                '請勿混入其他分類垃圾'
            ],
            '有害垃圾': [
                '需要小心妥善處理',
                '防止洩漏和污染環境',
                '使用密閉容器盛放',
                '查看本地有害廢物回收點',
                '有害垃圾需進行特殊處理'
            ]
        };
        return tips[category] || ['請遵循本地垃圾分類規則'];
    }

    // 渲染分類卡片
    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = wasteData.categories.map(category => `
            <div class="category-card" data-id="${category.id}">
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.items.length} 個物品</div>
            </div>
        `).join('');
    }

    // 顯示彈窗
    showModal(content) {
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('resultModal').classList.add('active');
    }

    // 關閉彈窗
    closeModal() {
        document.getElementById('resultModal').classList.remove('active');
    }

    // 添加到歷史
    addToHistory(item) {
        // 避免重複和最多保存50項
        this.history = this.history.filter(h => h.item !== item);
        this.history.unshift({
            item: item,
            timestamp: new Date().getTime()
        });
        
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    // 移除歷史項目
    removeHistoryItem(index) {
        this.history.splice(parseInt(index), 1);
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    // 清除所有歷史
    clearHistory() {
        if (confirm('確定要清除所有查詢歷史嗎？')) {
            this.history = [];
            this.saveHistory();
            this.updateHistoryDisplay();
        }
    }

    // 更新歷史顯示
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<div class="empty-message">暫無查詢歷史</div>';
            return;
        }

        historyList.innerHTML = this.history.map((item, index) => {
            const date = new Date(item.timestamp);
            const timeStr = this.formatTime(date);
            
            return `
                <div class="history-item" data-index="${index}">
                    <div class="history-text">
                        <div class="history-name">${item.item}</div>
                        <div class="history-time">${timeStr}</div>
                    </div>
                    <button class="history-delete">刪除</button>
                </div>
            `;
        }).join('');
    }

    // 格式化時間
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '剛剛';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} 分鐘前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小時前`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
        
        return date.toLocaleDateString('zh-Hant', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 保存歷史到本地存儲
    saveHistory() {
        localStorage.setItem('wasteClassificationHistory', JSON.stringify(this.history));
    }

    // 從本地存儲載入歷史
    loadHistory() {
        const saved = localStorage.getItem('wasteClassificationHistory');
        if (saved) {
            try {
                this.history = JSON.parse(saved);
            } catch (e) {
                console.error('載入歷史失敗:', e);
                this.history = [];
            }
        }
    }

    // 顯示提示訊息
    showMessage(message) {
        alert(message);
    }

    // ========== AI 分類相關功能 ==========

    // 處理圖片上傳
    async handleImageUpload(file) {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = new Image();
                img.onload = async () => {
                    this.displayPreview(img.src);
                    await this.analyzeImage(img);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('上傳圖片錯誤:', error);
            this.showAIError('上傳圖片失敗');
        }
    }

    // 顯示圖片預覽
    displayPreview(src) {
        document.getElementById('previewImage').src = src;
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('aiResults').style.display = 'block';
    }

    // 清除圖片
    clearImage() {
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('aiResults').style.display = 'none';
        document.getElementById('imageInput').value = '';
    }

    // 打開相機
    async openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            this.currentStream = stream;
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            document.getElementById('cameraContainer').style.display = 'block';
            this.cameraActive = true;
        } catch (error) {
            console.error('相機打開失敗:', error);
            this.showAIError('無法打開相機。請檢查權限。');
        }
    }

    // 關閉相機
    closeCamera() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
        document.getElementById('cameraContainer').style.display = 'none';
        this.cameraActive = false;
    }

    // 拍照
    async capturePhoto() {
        try {
            const video = document.getElementById('cameraVideo');
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            const img = new Image();
            img.onload = async () => {
                this.displayPreview(img.src);
                await this.analyzeImage(img);
                this.closeCamera();
            };
            img.src = canvas.toDataURL();
        } catch (error) {
            console.error('拍照失敗:', error);
            this.showAIError('拍照失敗');
        }
    }

    // 分析圖片
    async analyzeImage(img) {
        try {
            if (!this.model) {
                this.showAIError('AI 模型還未載入，請稍候...');
                return;
            }

            // 顯示加載中
            document.getElementById('loadingSpinner').style.display = 'block';
            document.getElementById('classificationResult').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';

            // 進行預測
            const predictions = await this.model.classify(img);
            
            // 將結果轉換為垃圾分類
            const wasteClassification = this.mapToWasteCategory(predictions);
            
            // 隱藏加載
            document.getElementById('loadingSpinner').style.display = 'none';
            
            // 顯示結果
            this.displayAIResults(wasteClassification, predictions);
            
        } catch (error) {
            console.error('分析圖片錯誤:', error);
            document.getElementById('loadingSpinner').style.display = 'none';
            this.showAIError('圖片分析失敗，請重試');
        }
    }

    // 將 ImageNet 分類轉換到垃圾分類
    mapToWasteCategory(predictions) {
        const prediction = predictions[0].className.toLowerCase();
        
        // 垃圾分類映射表
        const categoryMap = {
            recyclable: ['bottle', 'plastic bottle', 'can', 'aluminum can', 'cardboard', 'paper', 'newspaper', 'magazine', 'glass', 'jar', 'metal'],
            compostable: ['apple', 'banana', 'orange', 'food', 'fruit', 'vegetable', 'carrot', 'lettuce', 'leaf', 'plant', 'flower'],
            hazardous: ['battery', 'light bulb', 'fluorescent', 'electronic', 'phone', 'computer', 'lamp', 'pesticide'],
            general: ['plastic bag', 'diaper', 'tissue', 'paper towel', 'ceramic', 'shoe', 'toy']
        };

        // 根據預測結果判斷分類
        for (let category in categoryMap) {
            if (categoryMap[category].some(keyword => prediction.includes(keyword))) {
                return category;
            }
        }

        // 根據置信度進行更智能的判斷
        if (predictions[0].probability > 0.7) {
            if (prediction.includes('plastic') || prediction.includes('metal')) {
                return 'recyclable';
            } else if (prediction.includes('food') || prediction.includes('leaf')) {
                return 'compostable';
            }
        }

        return 'general';
    }

    // 顯示 AI 結果
    displayAIResults(categoryId, predictions) {
        document.getElementById('classificationResult').style.display = 'block';
        
        const category = wasteData.getCategoryById(categoryId);
        
        // 顯示預測分類
        document.getElementById('predictedCategoryName').textContent = `${category.icon} ${category.name}`;
        document.getElementById('predictedCategoryDesc').textContent = category.description;
        
        // 顯示處理提示
        document.getElementById('recycleTips').textContent = this.getDetailedTips(category.name)[0];
        
        // 計算垃圾分類的預測概率
        const categoryProbabilities = this.calculateCategoryProbabilities(predictions);
        
        // 繪製概率柱狀圖
        let barsHTML = '';
        categoryProbabilities.forEach(prob => {
            const categoryData = wasteData.getCategoryById(prob.categoryId);
            barsHTML += `
                <div class="probability-bar">
                    <div class="bar-label">
                        <span class="bar-label-name">${categoryData.name}</span>
                        <span class="bar-label-percent">${(prob.score * 100).toFixed(1)}%</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${prob.score * 100}%; background: ${categoryData.color};">
                            ${prob.score > 0.2 ? (prob.score * 100).toFixed(0) + '%' : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        document.getElementById('probabilityBars').innerHTML = barsHTML;
        
        // 添加到歷史
        this.addToHistory(`AI識別: ${category.name}`);
    }

    // 計算各分類的概率
    calculateCategoryProbabilities(predictions) {
        const scores = {
            recyclable: 0,
            compostable: 0,
            general: 0,
            hazardous: 0
        };

        predictions.slice(0, 5).forEach((pred, index) => {
            const weight = 1 / (index + 1);
            const className = pred.className.toLowerCase();
            
            if (['bottle', 'can', 'cardboard', 'paper', 'glass', 'jar', 'metal'].some(k => className.includes(k))) {
                scores.recyclable += pred.probability * weight;
            } else if (['food', 'fruit', 'vegetable', 'leaf', 'plant'].some(k => className.includes(k))) {
                scores.compostable += pred.probability * weight;
            } else if (['battery', 'light', 'electronic', 'phone', 'computer'].some(k => className.includes(k))) {
                scores.hazardous += pred.probability * weight;
            } else {
                scores.general += pred.probability * weight;
            }
        });

        // 歸一化
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        for (let key in scores) {
            scores[key] = Math.max(0, Math.min(1, scores[key] / (total || 1)));
        }

        return [
            { categoryId: 'recyclable', score: scores.recyclable },
            { categoryId: 'compostable', score: scores.compostable },
            { categoryId: 'hazardous', score: scores.hazardous },
            { categoryId: 'general', score: scores.general }
        ].sort((a, b) => b.score - a.score);
    }

    // 顯示 AI 錯誤
    showAIError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('classificationResult').style.display = 'none';
    }
}

// 應用初始化
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WasteClassificationApp();
});
