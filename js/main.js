let links, memoContent, bgUrl, fontSize, cmdHistory, defaultSearchEngine, currentTheme;
let langManager;
// 主题配置（各发行版的默认背景图与 CSS 类）
const themeConfig = {
    ubuntu: {
        name: 'Ubuntu',
        bgUrl: '../themes/ubuntu.jpg',
        cssClass: ''
    },
    kali: {
        name: 'Kali Linux',
        bgUrl: '../themes/kali.jpg',
        cssClass: 'theme-kali'
    },
    deepin: {
        name: 'Deepin',
        bgUrl: '../themes/deepin.jpg',
        cssClass: 'theme-deepin'
    },
    debian: {
        name: 'Debian',
        bgUrl: '../themes/debian.jpg',
        cssClass: 'theme-debian'
    },
    uos: {
        name: 'UOS',
        bgUrl: '../themes/uos.jpg',
        cssClass: 'theme-uos'
    },
    kylin: {
        name: 'Kylin',
        bgUrl: '../themes/kylin.jpg',
        cssClass: 'theme-kylin'
    }
};


(async function() {
    // 加载存储数据
    const settings = await loadSettings();
    links = settings.links;
    memoContent = settings.memo;
    bgUrl = settings.bgUrl;
    fontSize = settings.fontSize;
    cmdHistory = settings.cmdHistory;
    defaultSearchEngine = settings.defaultEngine;
    currentTheme = settings.theme || 'ubuntu';
    langManager = new LangManager();
    await langManager.init();

    // 立刻用当前语言覆盖所有界面文本
    refreshUI();

    // 注册语言切换后的自动刷新
    langManager.onChange(() => refreshUI());

    // DOM 元素
    const outputEl = document.getElementById('output');
    const inputEl = document.getElementById('cmdInput');
    const memoDisplay = document.getElementById('memoDisplay');
    const memoEditorDiv = document.getElementById('memoEditor');
    const memoTextarea = document.getElementById('memoTextarea');
    const editMemoBtn = document.getElementById('editMemoBtn');
    const saveMemoBtn = document.getElementById('saveMemoBtn');
    const cancelMemoBtn = document.getElementById('cancelMemoBtn');


    const initialHost = themeConfig[currentTheme].name.split(' ')[0].toLowerCase();
    const initialPrompt = `user@${initialHost}:~$`;
    // 初始化终端核心
    const terminal = new TerminalCore(outputEl, inputEl, {
        history: cmdHistory,
        links: links,
        prompt: initialPrompt,
        onCommand: (cmd) => executeCommand(cmd),
        onClearHistory: () => {}
    });
    terminal.onHistoryUpdate = async (newHistory) => {
        cmdHistory = newHistory;
        await saveCmdHistory(cmdHistory);
    };


    function refreshUI() {
        // 处理普通文本内容
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = langManager.t(key);
        });

        // 处理 placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (key) el.setAttribute('placeholder', langManager.t(key));
        });

        // 处理 title 属性
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.setAttribute('title', langManager.t(key));
        });
    }

    async function pickLangFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const pack = JSON.parse(event.target.result);
                        const langCode = file.name.replace('.json', '');
                        await saveLangPack(langCode, pack);
                        langManager.packs[langCode] = pack;
                        resolve(langCode);
                    } catch (err) {
                        reject(new Error('无效JSON格式'));
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    // ----- 辅助函数 -----
    function applyBackground(url) {
        document.body.style.backgroundImage = url ? `url("${url}")` : '';
    }
    async function pickLocalBackground() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('未选择文件'));
                    return;
                }
                const reader = new FileReader();
                reader.onload = async (event) => {
                    bgUrl = event.target.result;
                    applyBackground(bgUrl);
                    await saveBgUrl(bgUrl);
                    terminal.printSuccess(langManager.t('bg_pick_success', { filename: file.name }));
                    resolve();
                };
                reader.onerror = () => reject(new Error('读取文件失败'));
                reader.readAsDataURL(file);
            };
            input.click();
        });
    }
    function applyFontSize(size) {
        document.documentElement.style.setProperty('--base-font-size', size + 'px');
    }

    function applyTheme(themeName) {
        const config = themeConfig[themeName] || themeConfig.ubuntu;

        document.body.classList.remove(
            'theme-kali', 'theme-deepin', 'theme-debian', 'theme-uos', 'theme-kylin'
        );
        if (config.cssClass) {
            document.body.classList.add(config.cssClass);
        }

        if (!bgUrl) {
            applyBackground(config.bgUrl);
        } else {
            applyBackground(bgUrl);
        }

        const hostName = config.name.split(' ')[0].toLowerCase();
        const promptText = `user@${hostName}:~$`;
        const titleText = `user@${hostName}: ~/newtab`;

        const promptSpan = document.querySelector('.input-line .prompt');
        if (promptSpan) promptSpan.textContent = promptText;

        const titleSpan = document.querySelector('.terminal-header .window-title');
        if (titleSpan) titleSpan.textContent = titleText;

        if (terminal && typeof terminal.setPrompt === 'function') {
            terminal.setPrompt(promptText);
        }
        currentTheme = themeName;
    }

    function renderMemo(mdText) {
        memoDisplay.innerHTML = marked.parse(mdText);

        const checkboxes = memoDisplay.querySelectorAll('li input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
            if (checkbox.dataset.listenerAttached === 'true') return;
            checkbox.dataset.listenerAttached = 'true';

            checkbox.addEventListener('change', async (e) => {
                e.stopPropagation();

                const listItem = checkbox.closest('li');
                if (!listItem) return;

                const clone = listItem.cloneNode(true);
                clone.querySelector('input[type="checkbox"]')?.remove();
                const taskText = clone.textContent?.trim() || '';

                const isChecked = checkbox.checked;
                const markdownLine = isChecked ? `- [x] ${taskText}` : `- [ ] ${taskText}`;

                updateMemoLine(markdownLine, taskText);
                await saveMemo(memoContent);

                renderMemo(memoContent);
                const msg = isChecked ? langManager.t('task_completed') : langManager.t('task_uncompleted');
                terminal.printLine(`✓ ${msg}`, 'output');
            });
        });
    }

    // 应用初始样式
    applyTheme(currentTheme);
    applyBackground(bgUrl);
    applyFontSize(fontSize);
    renderMemo(memoContent);

    // 输出欢迎语
    terminal.printRaw(langManager.t('welcome_html'));

    // 辅助函数：更新备忘录对应行
    function updateMemoLine(newLine, taskText) {
        const lines = memoContent.split('\n');
        const targetIndex = lines.findIndex(line => {
            const match = line.match(/^-\s*\[([ x])]\s*(.+)$/);
            if (match) {
                const desc = match[2].trim();
                return desc === taskText;
            }
            return false;
        });

        if (targetIndex !== -1) {
            lines[targetIndex] = newLine;
        } else {
            console.warn('任务行未找到，不进行更新');
            return;
        }
        memoContent = lines.join('\n');
    }

    // 显示/隐藏编辑器
    function showMemoEditor(show) {
        if (show) {
            memoDisplay.style.display = 'none';
            memoEditorDiv.style.display = 'flex';
            memoTextarea.value = memoContent;
        } else {
            memoDisplay.style.display = 'block';
            memoEditorDiv.style.display = 'none';
        }
    }

    // ----- 命令执行 -----
    async function executeCommand(rawCmd) {
        terminal.printCommand(rawCmd);
        const tokens = parseCommand(rawCmd);
        if (tokens.length === 0) return;

        const cmd = tokens[0].toLowerCase();
        const args_0 = tokens.slice(1);

        const hasNewTabFlag = args_0.includes('-t') || args_0.includes('--new-tab');
        args = args_0.filter(arg_0 => arg_0 !== '-t' && arg_0 !== '--new-tab');

        try {
            switch (cmd) {
                case 'help':
                case 'h':
                    showHelp();
                    break;
                case 'clear':
                    terminal.clearOutput();
                    break;
                case 'open':
                case 'o':
                    if (!args[0]) throw new Error(langManager.t('open_usage'));
                    if (hasNewTabFlag) {
                        chrome.tabs.create({ url: ensureHttp(args[0]) });
                    } else {
                        chrome.tabs.update({ url: ensureHttp(args[0]) });
                    }
                    terminal.printSuccess(langManager.t('open_success', { url: args[0], newtab: hasNewTabFlag ? '(新标签页)' : '' }));
                    break;

                case 'search':
                case 's':
                    if (args.length === 0) throw new Error(langManager.t('search_usage'));

                    const setFlagIndex = args.findIndex(arg => arg === '-s');
                    if (setFlagIndex !== -1) {
                        const engine = args[setFlagIndex + 1]?.toLowerCase();
                        if (!engine) throw new Error(langManager.t('search_set_engine_usage'));
                        const validEngines = ['google', 'baidu', 'bing', 'duckduckgo'];
                        if (!validEngines.includes(engine)) {
                            throw new Error(langManager.t('search_unsupported_engine', { engines: validEngines.join(', ') }));
                        }
                        defaultSearchEngine = engine;
                        await saveDefaultEngine(engine);
                        terminal.printSuccess(langManager.t('search_engine_set', { engine }));
                        break;
                    }

                    let searchQuery = '';
                    let engine = defaultSearchEngine;

                    const byIndex = args.findIndex(arg => arg.toLowerCase() === 'by');
                    if (byIndex !== -1) {
                        searchQuery = args.slice(0, byIndex).join(' ');
                        const tempEngine = args.slice(byIndex + 1).join(' ').toLowerCase();
                        if (tempEngine) engine = tempEngine;
                    } else {
                        searchQuery = args.join(' ');
                    }

                    if (!searchQuery) throw new Error(langManager.t('search_no_keyword'));

                    const engines = {
                        google: 'https://www.google.com/search?q=',
                        baidu: 'https://www.baidu.com/s?wd=',
                        bing: 'https://www.bing.com/search?q=',
                        duckduckgo: 'https://duckduckgo.com/?q=',
                    };

                    const baseUrl = engines[engine];
                    if (!baseUrl) throw new Error(langManager.t('search_invalid_engine', { engine }));

                    const url = baseUrl + encodeURIComponent(searchQuery);
                    if (hasNewTabFlag) {
                        chrome.tabs.create({ url });
                    } else {
                        chrome.tabs.update({ url });
                    }
                    terminal.printSuccess(langManager.t('search_success', { engine, query: searchQuery, newtab: hasNewTabFlag ? '(新标签页)' : '' }));
                    break;

                case 'link':
                    await handleLinkCommand(args);
                    break;

                case 'go':
                    if (!args[0]) throw new Error(langManager.t('go_usage'));
                    const link = links.find(l => l.name.toLowerCase() === args[0].toLowerCase());
                    if (!link) throw new Error(langManager.t('go_not_found', { name: args[0] }));
                    if (hasNewTabFlag) {
                        chrome.tabs.create({ url: link.url });
                    } else {
                        chrome.tabs.update({ url: link.url });
                    }
                    terminal.printSuccess(langManager.t('go_success', { name: link.name, url: link.url, newtab: hasNewTabFlag ? '(新标签页)' : '' }));
                    break;

                case 'export':
                    if (args[0] === 'links') {
                        const filename = args.slice(1).join(' ') || null;
                        exportLinks(filename);
                    } else {
                        throw new Error(langManager.t('export_unknown'));
                    }
                    break;

                case 'bg':
                    await handleBgCommand(args);
                    break;

                case 'theme': {
                    const sub = args[0]?.toLowerCase();
                    if (!sub) throw new Error(langManager.t('theme_usage'));

                    if (sub === 'list') {
                        const themes = Object.keys(themeConfig).map(k => `${k} (${themeConfig[k].name})`).join(', ');
                        terminal.printLine(langManager.t('theme_list', { themes }));
                        terminal.printLine(langManager.t('theme_current', { theme: currentTheme, name: themeConfig[currentTheme].name }));
                    } else if (sub === 'set') {
                        const themeName = args[1]?.toLowerCase();
                        if (!themeName || !themeConfig[themeName]) {
                            throw new Error(langManager.t('theme_unknown', { themes: Object.keys(themeConfig).join(', ') }));
                        }
                        applyTheme(themeName);
                        await saveTheme(themeName);
                        terminal.printSuccess(langManager.t('theme_switched', { name: themeConfig[themeName].name }));
                    } else {
                        throw new Error(langManager.t('theme_usage'));
                    }
                    break;
                }

                case 'font':
                case 'text':
                    if (args[0] === 'size' && args[1]) {
                        const size = parseInt(args[1]);
                        if (isNaN(size)) throw new Error(langManager.t('font_size_nan'));
                        fontSize = size;
                        applyFontSize(fontSize);
                        await saveFontSize(fontSize);
                        terminal.printSuccess(langManager.t('font_size_set', { size }));
                    } else throw new Error(langManager.t('font_usage'));
                    break;

                case 'history':
                    if (args[0] === 'clear') {
                        terminal.clearHistory();
                        await saveCmdHistory([]);
                        terminal.printSuccess(langManager.t('history_cleared'));
                    } else {
                        terminal.printLine(langManager.t('history_count', { count: cmdHistory.length }));
                    }
                    break;

                case 'memo':
                    await handleMemoCommand(args);
                    break;

                case 'lang': {
                    const sub = args[0]?.toLowerCase();
                    if (sub === 'list') {
                        const langs = langManager.getAvailableLanguages();
                        terminal.printLine(langManager.t('lang_available'));
                        langs.forEach(l => terminal.printLine(langManager.t('lang_item', { code: l.code, name: l.name, current: l.code === langManager.currentLang ? ' (当前)' : '' })));
                    } else if (sub === 'set') {
                        const langCode = args[1];
                        if (!langCode) throw new Error(langManager.t('lang_set_usage'));
                        await langManager.setLang(langCode);
                        refreshUI();
                        terminal.printSuccess(langManager.t('lang_set_success', { name: langManager.t('lang_name') }));
                    } else if (sub === 'install') {
                        if (!args[1]) throw new Error(langManager.t('lang_install_usage'));
                        const code = await langManager.installFromUrl(args[1]);
                        terminal.printSuccess(langManager.t('lang_install_success', { code }));
                    } else if (sub === 'pick') {
                        try {
                            const langCode = await pickLangFile();
                            if (langCode) {
                                terminal.printSuccess(langManager.t('lang_install_success', { code: langCode }));
                            }
                        } catch (err) {
                            terminal.printError(err.message);
                        }
                    } else if (sub === 'remove') {
                        if (!args[1]) throw new Error(langManager.t('lang_remove_usage'));
                        await langManager.removeLang(args[1]);
                        refreshUI();
                        terminal.printSuccess(langManager.t('lang_remove_success', { code: args[1] }));
                    } else {
                        throw new Error(langManager.t('lang_usage'));
                    }
                    break;
                }

                default:
                    terminal.printError(langManager.t('command_unknown', { cmd }));
            }
        } catch (err) {
            terminal.printError(langManager.t('error_generic', { message: err.message }));
        }
    }

    function ensureHttp(url) {
        if (!/^https?:\/\//i.test(url)) return 'https://' + url;
        return url;
    }

    function showHelp() {
        terminal.printRaw(langManager.t('help_text'));
    }

    async function handleLinkCommand(args) {
        const sub = args[0]?.toLowerCase();
        if (sub === 'list' || !sub) {
            if (links.length === 0) terminal.printLine(langManager.t('link_list_empty'));
            else {
                terminal.printLine(langManager.t('link_list_title'));
                links.forEach((l, i) => terminal.printLine(langManager.t('link_item', { index: i+1, name: l.name, url: l.url })));
            }
        } else if (sub === 'add') {
            if (args.length < 3) throw new Error(langManager.t('link_usage'));
            const name = args[1];
            const url = ensureHttp(args[2]);
            if (links.find(l => l.name === name)) throw new Error(langManager.t('link_add_duplicate', { name }));
            links.push({ name, url });
            await saveLinks(links);
            terminal.setLinks(links);
            terminal.printSuccess(langManager.t('link_add_success', { name, url }));
        } else if (sub === 'remove' || sub === 'delete') {
            if (args.length < 2) throw new Error(langManager.t('link_usage'));
            const name = args[1];
            const index = links.findIndex(l => l.name === name);
            if (index === -1) throw new Error(langManager.t('link_remove_not_found', { name }));
            links.splice(index, 1);
            await saveLinks(links);
            terminal.setLinks(links);
            terminal.printSuccess(langManager.t('link_remove_success', { name }));
        } else {
            throw new Error(langManager.t('link_usage'));
        }
    }

    async function exportLinks(filenameArg) {
        const defaultFilename = `ubuntu_links_${Date.now()}.json`;
        let filename = filenameArg || defaultFilename;
        if (!filename.endsWith('.json')) filename += '.json';

        const dataStr = JSON.stringify(links, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const blobUrl = URL.createObjectURL(blob);

        try {
            await chrome.downloads.download({
                url: blobUrl,
                filename: filename,
                saveAs: false
            });
            terminal.printSuccess(langManager.t('export_success', { filename }));
        } catch (err) {
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename.split('/').pop() || 'links.json';
            a.click();
            terminal.printSuccess(langManager.t('export_success', { filename: a.download }));
        } finally {
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        }
    }

    async function handleBgCommand(args) {
        const sub = args[0]?.toLowerCase();
        if (sub === 'set') {
            if (!args[1]) throw new Error(langManager.t('bg_set_usage'));
            bgUrl = args[1];
            applyBackground(bgUrl);
            await saveBgUrl(bgUrl);
            terminal.printSuccess(langManager.t('bg_updated'));
        } else if (sub === 'pick') {
            try {
                await pickLocalBackground();
            } catch (err) {
                terminal.printError(err.message);
            }
        } else if (sub === 'reset') {
            bgUrl = '';
            applyBackground(themeConfig[currentTheme].bgUrl);
            await saveBgUrl('');
            terminal.printSuccess(langManager.t('bg_reset'));
        } else if (sub === 'remove') {
            bgUrl = '';
            applyBackground('');
            await saveBgUrl('');
            terminal.printSuccess(langManager.t('bg_remove'));
        } else {
            throw new Error(langManager.t('bg_usage'));
        }
    }

    async function handleMemoCommand(args) {
        const sub = args[0]?.toLowerCase();
        if (!sub) {
            terminal.printLine(langManager.t('memo_current'));
            terminal.printLine(memoContent);
        } else if (sub === 'set') {
            let newContent = args.slice(1).join(' ');
            if (!newContent) throw new Error(langManager.t('memo_set_no_content'));
            newContent = newContent.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            memoContent = newContent;
            await saveMemo(memoContent);
            renderMemo(memoContent);
            terminal.printSuccess(langManager.t('memo_updated'));
        } else if (sub === 'append') {
            let appendText = args.slice(1).join(' ');
            if (!appendText) throw new Error(langManager.t('memo_append_no_content'));
            appendText = appendText.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            memoContent += '\n' + appendText;
            await saveMemo(memoContent);
            renderMemo(memoContent);
            terminal.printSuccess(langManager.t('memo_appended'));
        } else if (sub === 'clear') {
            memoContent = '';
            await saveMemo(memoContent);
            renderMemo(memoContent);
            terminal.printSuccess(langManager.t('memo_cleared'));
        } else {
            throw new Error(langManager.t('memo_usage'));
        }
    }

    // ----- 备忘录UI交互 -----
    editMemoBtn.addEventListener('click', () => showMemoEditor(true));
    cancelMemoBtn.addEventListener('click', () => showMemoEditor(false));
    saveMemoBtn.addEventListener('click', async () => {
        memoContent = memoTextarea.value;
        await saveMemo(memoContent);
        renderMemo(memoContent);
        showMemoEditor(false);
        terminal.printSuccess(langManager.t('memo_saved'));
    });

    // 点击终端区域自动聚焦输入框
    outputEl.addEventListener('click', () => inputEl.focus());

    // ✅ 显示页面（此时主题已正确应用）
    document.body.style.visibility = 'visible';

})();