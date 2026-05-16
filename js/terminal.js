class TerminalCore {
    constructor(outputElement, inputElement, options = {}) {
        this.outputEl = outputElement;
        this.inputEl = inputElement;
        this.history = options.history || [];
        this.historyIndex = -1;
        this.links = options.links || [];
        this.onCommand = options.onCommand || (() => {});
        this.onClearHistory = options.onClearHistory || (() => {});
        this.prompt = options.prompt || 'user@ubuntu:~$';  // 新增

        this.initEventListeners();
    }
    setPrompt(newPrompt) {
        this.prompt = newPrompt;
    }

    printCommand(cmd) {
        const line = document.createElement('div');
        line.className = 'command-line';
        line.innerHTML = `<span class="prompt-small">${this.escapeHtml(this.prompt)}</span> ${this.escapeHtml(cmd)}`;
        this.outputEl.appendChild(line);
    }
    initEventListeners() {
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.inputEl.value.trim();
                if (cmd) {
                    this.addToHistory(cmd);
                    this.onCommand(cmd);
                    this.inputEl.value = '';
                    this.historyIndex = -1;
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;
        if (direction === -1 && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
        } else if (direction === 1 && this.historyIndex > -1) {
            this.historyIndex--;
        }

        if (this.historyIndex >= 0) {
            this.inputEl.value = this.history[this.history.length - 1 - this.historyIndex];
        } else {
            this.inputEl.value = '';
        }
    }

    addToHistory(cmd) {
        this.history.push(cmd);
        if (this.history.length > 200) this.history.shift();
        // 通知外部保存
        if (this.onHistoryUpdate) this.onHistoryUpdate(this.history);
    }

    clearHistory() {
        this.history = [];
        this.historyIndex = -1;
        if (this.onClearHistory) this.onClearHistory();
    }

    printLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `${type}-line`;
        line.textContent = text;
        this.outputEl.appendChild(line);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    printError(text) {
        this.printLine(`❌ ${text}`, 'error');
    }

    printSuccess(text) {
        this.printLine(`✅ ${text}`, 'output');
    }

    printRaw(html) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = html;
        this.outputEl.appendChild(div);
    }

    escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    clearOutput() {
        this.outputEl.innerHTML = '';
    }

    setLinks(links) { this.links = links; }
}

// 命令解析器 (支持引号参数)
function parseCommand(input) {
    const tokens = [];
    let current = '';
    let quote = null;
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if ((ch === '"' || ch === "'") && quote === null) {
            quote = ch;
        } else if (ch === quote) {
            quote = null;
        } else if (ch === ' ' && quote === null) {
            if (current) { tokens.push(current); current = ''; }
        } else {
            current += ch;
        }
    }
    if (current) tokens.push(current);
    return tokens;
}