// 默认数据
const DEFAULT_LINKS = [
    { name: 'google', url: 'https://www.google.com' },
    { name: 'github', url: 'https://github.com' },
    { name: 'ubuntu', url: 'https://ubuntu.com' }
];

const DEFAULT_MEMO = `# 备忘录
- [ ] 学习终端指令  
- [x] 配置新标签页  
**提示**: 双击编辑按钮修改`;

const DEFAULT_DEFAULT_SEARCH_ENGINE = "baidu"

// 默认主题
const DEFAULT_THEME = 'ubuntu';

// 存储键名（历史改用 session 存储）
const STORAGE_KEYS = {
    LINKS: 'ubuntu_links',
    MEMO: 'ubuntu_memo',
    BG_URL: 'ubuntu_bg_url',
    FONT_SIZE: 'ubuntu_font_size',
    HISTORY: 'ubuntu_cmd_history',   // 键名不变，但存入 session
    DEFAULT_SEARCH_ENGINE: 'ubuntu_default_search_engine',
    THEME: 'ubuntu_theme',  // 新增
    LANG: 'ubuntu_lang',                 // 当前语言代码
    LANG_PACKS: 'ubuntu_lang_packs'      // 所有已安装语言包对象 { 'zh_CN': {...}, 'en': {...} }
};


// 获取当前语言代码
async function getCurrentLang() {
    const result = await chrome.storage.local.get([STORAGE_KEYS.LANG]);
    return result[STORAGE_KEYS.LANG] || 'zh_CN';   // 默认中文
}

// 保存当前语言
async function setCurrentLang(langCode) {
    await chrome.storage.local.set({ [STORAGE_KEYS.LANG]: langCode });
}

// 获取所有语言包
async function getLangPacks() {
    const result = await chrome.storage.local.get([STORAGE_KEYS.LANG_PACKS]);
    return result[STORAGE_KEYS.LANG_PACKS] || {};
}

// 保存语言包（添加或更新一个）
async function saveLangPack(langCode, packData) {
    const packs = await getLangPacks();
    packs[langCode] = packData;
    await chrome.storage.local.set({ [STORAGE_KEYS.LANG_PACKS]: packs });
}

// 删除语言包
async function removeLangPack(langCode) {
    const packs = await getLangPacks();
    delete packs[langCode];
    await chrome.storage.local.set({ [STORAGE_KEYS.LANG_PACKS]: packs });
}

// 保存历史到 session 存储
async function saveCmdHistory(history) {
    // 只保留最近200条
    const trimmed = history.slice(-200);
    await chrome.storage.session.set({ [STORAGE_KEYS.HISTORY]: trimmed });
}

async function saveLinks(links) {
    await chrome.storage.local.set({ [STORAGE_KEYS.LINKS]: links });
}

async function saveMemo(content) {
    await chrome.storage.local.set({ [STORAGE_KEYS.MEMO]: content });
}

async function saveBgUrl(url) {
    await chrome.storage.local.set({ [STORAGE_KEYS.BG_URL]: url });
}

async function saveFontSize(size) {
    await chrome.storage.local.set({ [STORAGE_KEYS.FONT_SIZE]: size });
}

async function saveDefaultEngine(engine) {
    await chrome.storage.local.set({ [STORAGE_KEYS.DEFAULT_SEARCH_ENGINE]: engine });
}

// 新增保存主题函数
async function saveTheme(themeName) {
    await chrome.storage.local.set({ [STORAGE_KEYS.THEME]: themeName });
}

// 初始化/读取
async function loadSettings() {
    // 从 local 读取持久数据
    const localData = await chrome.storage.local.get([
        STORAGE_KEYS.LINKS,
        STORAGE_KEYS.MEMO,
        STORAGE_KEYS.BG_URL,
        STORAGE_KEYS.FONT_SIZE,
        STORAGE_KEYS.DEFAULT_SEARCH_ENGINE,
        STORAGE_KEYS.THEME   // 新增
    ]);

    // 从 session 读取历史
    const sessionData = await chrome.storage.session.get([STORAGE_KEYS.HISTORY]);

    const links = localData[STORAGE_KEYS.LINKS] || DEFAULT_LINKS;
    const memo = localData[STORAGE_KEYS.MEMO] || DEFAULT_MEMO;
    const bgUrl = localData[STORAGE_KEYS.BG_URL] || '';
    const fontSize = localData[STORAGE_KEYS.FONT_SIZE] || 16;
    const cmdHistory = sessionData[STORAGE_KEYS.HISTORY] || [];
    const defaultEngine = localData[STORAGE_KEYS.DEFAULT_SEARCH_ENGINE] || DEFAULT_DEFAULT_SEARCH_ENGINE;
    const theme = localData[STORAGE_KEYS.THEME] || DEFAULT_THEME;

    return { links, memo, bgUrl, fontSize, cmdHistory,defaultEngine,theme };
}