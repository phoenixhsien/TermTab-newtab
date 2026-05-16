// class LangManager {
//     constructor() {
//         this.currentLang = 'en';
//         this.packs = {};
//         this.listeners = [];  // 语言变更时通知更新
//     }
//
//     // 初始化：从 storage 加载
//     async init() {
//         this.currentLang = await getCurrentLang();
//         this.packs = await getLangPacks();
//         // 确保内置语言存在（从本地文件读取或硬编码）
//         if (!this.packs['en']) {
//             // 可以从 chrome.runtime.getURL('langs/en.json') 加载
//             const resp = await fetch(chrome.runtime.getURL('langs/en.json'));
//             this.packs['en'] = await resp.json();
//             await saveLangPack('en', this.packs['en']);
//         }
//         if (!this.packs['zh_CN']) {
//             const resp = await fetch(chrome.runtime.getURL('langs/zh_CN.json'));
//             this.packs['zh_CN'] = await resp.json();
//             await saveLangPack('zh_CN', this.packs['zh_CN']);
//         }
//     }
//
//     // 翻译函数
//     t(key, placeholders = {}) {
//         const pack = this.packs[this.currentLang] || this.packs['en'] || {};
//         let text = pack[key] || this.packs['en']?.[key] || key;
//         // 替换占位符 ${xxx}
//         for (const [k, v] of Object.entries(placeholders)) {
//             text = text.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), v);
//         }
//         return text;
//     }
//
//     // 切换语言
//     async setLang(langCode) {
//         if (this.packs[langCode]) {
//             this.currentLang = langCode;
//             await setCurrentLang(langCode);
//             this.notifyListeners();
//         } else {
//             throw new Error(`语言包 ${langCode} 不存在`);
//         }
//     }
//
//     // 注册更新回调
//     onChange(callback) {
//         this.listeners.push(callback);
//     }
//
//     notifyListeners() {
//         this.listeners.forEach(cb => cb());
//     }
//
//     // 获取所有可用语言列表
//     getAvailableLanguages() {
//         return Object.keys(this.packs).map(code => ({
//             code,
//             name: this.packs[code].lang_name || code
//         }));
//     }
//
//     // 安装语言包（从 URL 下载 JSON）
//     async installFromUrl(url) {
//         const resp = await fetch(url);
//         const pack = await resp.json();
//         if (!pack.lang_name) throw new Error('语言包格式错误');
//         const langCode = url.split('/').pop().replace('.json', '');
//         await saveLangPack(langCode, pack);
//         this.packs[langCode] = pack;
//         return langCode;
//     }
//
//     // 删除语言包
//     async removeLang(langCode) {
//         if (langCode === 'en' || langCode === 'zh_CN') throw new Error('不能删除内置语言');
//         if (this.currentLang === langCode) {
//             // 如果删的是当前语言，自动切回英文
//             await this.setLang('en');
//         }
//         await removeLangPack(langCode);
//         delete this.packs[langCode];
//     }
// }
class LangManager {
    constructor() {
        this.currentLang = 'en';
        this.packs = {};
        this.listeners = [];
    }

    async init() {
        // 1. 从 storage 读取上次设置的语言
        const langResult = await chrome.storage.local.get(['ubuntu_lang']);
        this.currentLang = langResult.ubuntu_lang || 'zh_CN';   // 默认中文

        // 2. 先从 storage 读取所有语言包（包括用户安装的自定义包）
        const packsResult = await chrome.storage.local.get(['ubuntu_lang_packs']);
        this.packs = packsResult.ubuntu_lang_packs || {};

        // 3. 强制重新加载内置语言包（en 和 zh_CN），保证内容最新
        const builtinLangs = ['en', 'zh_CN'];
        for (const lang of builtinLangs) {
            try {
                const url = chrome.runtime.getURL(`langs/${lang}.json`);
                const resp = await fetch(url);
                if (resp.ok) {
                    const pack = await resp.json();
                    this.packs[lang] = pack;                     // 更新到内存
                    await this.savePackToStorage(lang, pack);   // 更新到 storage
                } else {
                    console.warn(`内置语言包加载失败: ${lang}`);
                }
            } catch (err) {
                console.warn(`无法加载内置语言包 ${lang}:`, err);
            }
        }

        // 4. 确保当前语言至少有一个可用的包，否则回退到英文
        if (!this.packs[this.currentLang]) {
            this.currentLang = 'en';
            await chrome.storage.local.set({ ubuntu_lang: 'en' });
        }
    }

    // 将单个语言包保存到 storage
    async savePackToStorage(langCode, pack) {
        const result = await chrome.storage.local.get(['ubuntu_lang_packs']);
        const allPacks = result.ubuntu_lang_packs || {};
        allPacks[langCode] = pack;
        await chrome.storage.local.set({ ubuntu_lang_packs: allPacks });
    }

    // 翻译函数：支持 {variable} 占位符
    t(key, placeholders = {}) {
        const pack = this.packs[this.currentLang] || this.packs['en'] || {};
        let text = pack[key] || (this.packs['en']?.[key]) || key;
        // 替换占位符
        for (const [k, v] of Object.entries(placeholders)) {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
        return text;
    }

    // 切换语言
    async setLang(langCode) {
        if (this.packs[langCode]) {
            this.currentLang = langCode;
            await chrome.storage.local.set({ ubuntu_lang: langCode });
            this.notifyListeners();
        } else {
            throw new Error(`语言包 ${langCode} 不存在`);
        }
    }

    // 注册语言变更监听器
    onChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb());
    }

    // 获取所有可用语言列表
    getAvailableLanguages() {
        return Object.keys(this.packs).map(code => ({
            code,
            name: this.packs[code].lang_name || code
        }));
    }

    // 从 URL 安装语言包
    async installFromUrl(url) {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('下载语言包失败');
        const pack = await resp.json();
        if (!pack.lang_name) throw new Error('语言包格式错误');
        const langCode = url.split('/').pop().replace('.json', '');
        this.packs[langCode] = pack;
        await this.savePackToStorage(langCode, pack);
        return langCode;
    }

    // 删除语言包（不能删除内置的 en 和 zh_CN）
    async removeLang(langCode) {
        if (langCode === 'en' || langCode === 'zh_CN') {
            throw new Error('不能删除内置语言包');
        }
        if (this.currentLang === langCode) {
            await this.setLang('zh_CN');   // 如果删的是当前语言，切换到中文
        }
        delete this.packs[langCode];
        const result = await chrome.storage.local.get(['ubuntu_lang_packs']);
        const allPacks = result.ubuntu_lang_packs || {};
        delete allPacks[langCode];
        await chrome.storage.local.set({ ubuntu_lang_packs: allPacks });
    }
}