// 垃圾分類資料庫
const wasteData = {
    categories: [
        {
            id: 'recyclable',
            name: '可回收垃圾',
            icon: '♻️',
            color: '#4CAF50',
            description: '可以進行回收利用的垃圾',
            items: [
                {
                    name: '寶特瓶',
                    category: '可回收垃圾',
                    tips: '清空、壓扁、去標籤後投放'
                },
                {
                    name: '紙箱',
                    category: '可回收垃圾',
                    tips: '折疊、打包、保持乾燥'
                },
                {
                    name: '玻璃瓶',
                    category: '可回收垃圾',
                    tips: '清洗乾淨，避免破損受傷'
                },
                {
                    name: '鋁罐',
                    category: '可回收垃圾',
                    tips: '清空、壓扁後投放'
                },
                {
                    name: '報紙',
                    category: '可回收垃圾',
                    tips: '疊整齊、不要弄濕'
                },
                {
                    name: '雜誌',
                    category: '可回收垃圾',
                    tips: '保持乾燥、綁捆整齊'
                },
                {
                    name: '牛奶盒',
                    category: '可回收垃圾',
                    tips: '清洗乾淨、壓扁'
                },
                {
                    name: '舊衣物',
                    category: '可回收垃圾',
                    tips: '乾淨整潔的衣物可回收'
                },
                {
                    name: '塑膠容器',
                    category: '可回收垃圾',
                    tips: '清洗乾淨後投放'
                },
                {
                    name: '金屬罐頭',
                    category: '可回收垃圾',
                    tips: '清空、清洗後投放'
                }
            ]
        },
        {
            id: 'compostable',
            name: '廚餘/生物垃圾',
            icon: '🌱',
            color: '#FF9800',
            description: '可進行堆肥或生物分解的垃圾',
            items: [
                {
                    name: '食物殘渣',
                    category: '廚餘/生物垃圾',
                    tips: '瀝乾、去除包裝後投放'
                },
                {
                    name: '果皮',
                    category: '廚餘/生物垃圾',
                    tips: '可直接投放'
                },
                {
                    name: '菜葉',
                    category: '廚餘/生物垃圾',
                    tips: '瀝乾水分後投放'
                },
                {
                    name: '骨頭',
                    category: '廚餘/生物垃圾',
                    tips: '放在廚餘桶中'
                },
                {
                    name: '茶葉渣',
                    category: '廚餘/生物垃圾',
                    tips: '瀝乾後投放'
                },
                {
                    name: '咖啡渣',
                    category: '廚餘/生物垃圾',
                    tips: '完全瀝乾後投放'
                },
                {
                    name: '落葉',
                    category: '廚餘/生物垃圾',
                    tips: '可投入生物垃圾'
                },
                {
                    name: '花朵',
                    category: '廚餘/生物垃圾',
                    tips: '謝謝的花朵可投放'
                },
                {
                    name: '玉米芯',
                    category: '廚餘/生物垃圾',
                    tips: '可投入廚餘桶'
                },
                {
                    name: '蛋殼',
                    category: '廚餘/生物垃圾',
                    tips: '洗淨後可投放'
                }
            ]
        },
        {
            id: 'general',
            name: '一般垃圾',
            icon: '🗑️',
            color: '#2196F3',
            description: '無法回收或堆肥的垃圾',
            items: [
                {
                    name: '塑膠袋',
                    category: '一般垃圾',
                    tips: '沒有回收標記的塑膠袋'
                },
                {
                    name: '紙尿褲',
                    category: '一般垃圾',
                    tips: '放入一般垃圾桶'
                },
                {
                    name: '衛生紙',
                    category: '一般垃圾',
                    tips: '污染的紙類屬一般垃圾'
                },
                {
                    name: '餐巾紙',
                    category: '一般垃圾',
                    tips: '沾污的紙類投放'
                },
                {
                    name: '膠布',
                    category: '一般垃圾',
                    tips: '無法回收的膠布廢料'
                },
                {
                    name: '陶瓷碟片',
                    category: '一般垃圾',
                    tips: '碎裂的陶瓷屬一般垃圾'
                },
                {
                    name: '貼紙',
                    category: '一般垃圾',
                    tips: '塑膠貼紙屬一般垃圾'
                },
                {
                    name: '鞋墊',
                    category: '一般垃圾',
                    tips: '磨損的鞋墊投放'
                },
                {
                    name: '玩具',
                    category: '一般垃圾',
                    tips: '損壞無法修復的玩具'
                },
                {
                    name: '筆芯',
                    category: '一般垃圾',
                    tips: '不可回收的筆芯'
                }
            ]
        },
        {
            id: 'hazardous',
            name: '有害垃圾',
            icon: '⚠️',
            color: '#F44336',
            description: '含有毒有害物質的垃圾，需特殊處理',
            items: [
                {
                    name: '電池',
                    category: '有害垃圾',
                    tips: '所有類型電池都屬有害垃圾'
                },
                {
                    name: '熒光燈',
                    category: '有害垃圾',
                    tips: '含汞，需小心放置，避免破損'
                },
                {
                    name: '油漆桶',
                    category: '有害垃圾',
                    tips: '有毒物質，需密封放置'
                },
                {
                    name: '農藥瓶',
                    category: '有害垃圾',
                    tips: '有毒，需安全處理'
                },
                {
                    name: '醫療廢棄物',
                    category: '有害垃圾',
                    tips: '針頭、注射器等需特殊處理'
                },
                {
                    name: '化妝品',
                    category: '有害垃圾',
                    tips: '過期的化妝品含有害物質'
                },
                {
                    name: '手機',
                    category: '有害垃圾',
                    tips: '電子廢棄物，需回收處理'
                },
                {
                    name: '電子產品',
                    category: '有害垃圾',
                    tips: '廢棄的電子設備需特殊回收'
                },
                {
                    name: '清潔劑',
                    category: '有害垃圾',
                    tips: '化學清潔劑屬有害物質'
                },
                {
                    name: '膠水',
                    category: '有害垃圾',
                    tips: '化學膠水含有害成分'
                }
            ]
        }
    ],

    // 搜尋資料庫
    searchDatabase: [],

    // 初始化搜尋資料庫
    init: function() {
        this.categories.forEach(category => {
            category.items.forEach(item => {
                this.searchDatabase.push({
                    ...item,
                    categoryId: category.id,
                    icon: category.icon,
                    color: category.color
                });
            });
        });
    },

    // 搜尋垃圾分類
    search: function(keyword) {
        if (!keyword) return [];
        
        const lowerKeyword = keyword.toLowerCase();
        return this.searchDatabase.filter(item => 
            item.name.includes(keyword) || 
            item.tips.includes(keyword)
        );
    },

    // 根據 ID 獲取分類
    getCategoryById: function(id) {
        return this.categories.find(cat => cat.id === id);
    },

    // 獲取所有分類統計
    getStats: function() {
        return {
            totalCategories: this.categories.length,
            totalItems: this.searchDatabase.length,
            categories: this.categories.map(cat => ({
                name: cat.name,
                count: cat.items.length
            }))
        };
    }
};

// 初始化搜尋資料庫
wasteData.init();
