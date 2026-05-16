# 🐧 TermTab New Tab · Terminal Style Extension
<p align="right">
  <a href="./README.md">🇨🇳 中文</a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Chrome_Extension-4285F4?style=flat&logo=googlechrome&logoColor=white" alt="Chrome Extension">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/phoenixhsien/TermTab-newtab?style=social" alt="Stars">
  <img src="https://img.shields.io/github/forks/phoenixhsien/TermTab-newtab?style=social" alt="Forks">
  <img src="https://img.shields.io/github/license/phoenixhsien/TermTab-newtab" alt="License">
  <img src="https://img.shields.io/badge/license-Commons%20Clause-blue" alt="License">
  <img src="https://img.shields.io/github/downloads/phoenixhsien/TermTab-newtab/total" alt="Downloads">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
  <img src="https://img.shields.io/github/contributors/phoenixhsien/TermTab-newtab" alt="Contributors">
</p>

An extension that transforms the Chrome New Tab page into a TermTab terminal emulator. By typing Linux‑style commands, you can efficiently manage bookmarks, search, notes, appearance, and more. The memo panel natively supports Markdown task lists.

![TermTab New Tab Preview](/ImageForMD/TabKaliEn.jpg)
![TermTab New Tab Preview](/ImageForMD/TabThemeEn.jpg)
## 📦 Features

- **🔗 Smart Link Management**: Add, delete, and list your favorite websites; open them with a single command.
- **🔍 Quick Search**: Search with Google, Baidu, Bing, DuckDuckGo and more; customizable default engine.
- **📝 Memo (Markdown Supported)**: Editable, live‑rendered memo with clickable `- [ ]` checklists.
- **🌐 Multi‑Language Support**: Built‑in Chinese and English; install, switch, and remove language packs via commands.
- **🎨 Multiple Themes**: Six built‑in Linux‑style themes (Ubuntu, Kali, Deepin, Debian, UOS, Kylin) switchable with one command.
- **🖼️ Custom Appearance**: Set background images and adjust the terminal font size.
- **📤 Data Export**: Export your links as a JSON file for backup.
- **🧹 History & Clear Screen**: Clear command history or wipe the terminal screen.
- **💾 Persistent Storage**: All settings, links, and memos are automatically saved to the browser’s local storage.

---

## 🚀 Installation Guide
### 1. Prepare the Files
Make sure your extension folder has the following structure:
```text
TermTab-newtab/
├── manifest.json
├── newtab.html
├── README.md
├── README_EN.md
├── css/
│   └── style.css
├── icons/
│   ├── icon128.png
│   ├── icon16.png
│   └── icon48.png
├── ImageForMD/
│   ├── TabKali.jpg
│   ├── TabKaliEn.jpg
│   ├── TabTheme.jpg
│   └── TabThemeEn.jpg
├── js/
│   ├── lang-manager.js
│   ├── main.js
│   ├── storage.js
│   └── terminal.js
├── langs/
│   ├── en.json
│   └── zh_CN.json
├── lib/
│   └── marked.min.js
└── themes/
    ├── debian.jpg
    ├── deepin.jpg
    ├── kali.jpg
    ├── kylin.jpg
    ├── ubuntu.jpg
    └── uos.jpg
```

### 2. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top‑right corner.
3. Click **Load unpacked** and select the `TermTab-newtab` folder.
4. Once loaded, open a new tab to start using it.

---

## ⌨️ Terminal Command Reference

All commands are typed into the input field and executed with `Enter`. Use `↑` / `↓` to navigate command history.

### 🌐 Browsing & Search

| Command | Description | Example |
|---------|-------------|---------|
| `open <url> [-t]` | Open a URL in the current tab (automatically adds `https://`); `-t` opens in a new tab | `open github.com -t` |
| `search -s <engine>` | Set the default search engine (`google` / `baidu` / `bing` / `duckduckgo`) | `search -s baidu` |
| `search <keywords> [by <engine>] [-t]` | Search with the default or a specified engine; add `-t` to open results in a new tab | `search ubuntu new tab by google -t` |
| `go <name> [-t]` | Quickly open a saved bookmark; `-t` opens in a new tab | `go google -t` |

### 📎 Bookmark Management (link)

| Command | Description | Example |
|---------|-------------|---------|
| `link list` | List all saved bookmarks | `link list` |
| `link add <name> <url>` | Add a new bookmark | `link add drive https://drive.google.com` |
| `link remove <name>` | Remove a bookmark | `link remove drive` |
| `export links [filename]` | Export all bookmarks to a JSON file. You can specify a filename (supports subdirectories relative to the download folder) | `export links my_links.json` or `export links backup/TermTab_links` |

### 🖌️ Appearance

| Command | Description | Example |
|---------|-------------|---------|
| `bg set <image-url>` | Set the background image (supports web URLs) | `bg set https://images.pexels.com/photos/247676/pexels-photo-247676.jpeg` |
| `bg pick` | Open a file picker to select a local image as the background | `bg pick` |
| `bg reset` | Reset the background to the default theme gradient | `bg reset` |
| `bg remove` | Remove the background image, leaving only the theme’s solid/gradient background | `bg remove` |
| `font size <number>` | Adjust the base font size (in pixels) | `font size 18` |

### 🎨 Theme Switching (theme)

| Command | Description | Example |
|---------|-------------|---------|
| `theme list` | List all available themes and show the current one | `theme list` |
| `theme set <theme-name>` | Switch to a specific theme (`ubuntu` / `kali` / `deepin` / `debian` / `uos` / `kylin`) | `theme set kali` |

### 📝 Memo (Markdown supported)

The memo panel appears on the right side of the terminal. It supports **Markdown**, especially `- [ ]` task lists. You can also edit it visually by clicking the ✏️ button.

| Command | Description | Example |
|---------|-------------|---------|
| `memo` | Display the current memo content in the terminal | `memo` |
| `memo set <content>` | Replace the entire memo. Use `\n` for new lines | `memo set "# Shopping list\n- [ ] Milk"` |
| `memo append <content>` | Append text to the end of the memo | `memo append "- [x] Report completed"` |
| `memo clear` | Clear the memo | `memo clear` |

> **Markdown Example** – Type in the editor:
> ```markdown
> # Today’s Tasks
> - [x] Check emails
> - [ ] Update project docs
> - [ ] Meeting at 3pm
> ```
> After saving, you’ll see the rendered checklist with checkboxes.

### 🧹 System & History

| Command | Description |
|---------|-------------|
| `clear` | Clear the terminal screen (like the Linux `clear` command) |
| `history clear` | Delete all saved command history (pressing `↑` will no longer show old commands) |
| `help` or `h` | Display help for all available commands |

---

### 🌐 Language Switching Commands (`lang`)

| Command | Description |
|---------|-------------|
| `lang list` | List all installed language packs, highlighting the current one. |
| `lang set <code>` | Switch interface language (e.g., `zh_CN` for Chinese, `en` for English). |
| `lang install <URL>` | Install a language pack from a remote JSON URL. |
| `lang pick` | Select a local `.json` language pack file to install. |
| `lang remove <code>` | Remove a user-installed language pack (built-in `en` and `zh_CN` cannot be removed). |

**Examples**

```bash
# See available languages
lang list

# Switch to Chinese
lang set zh_CN

# Switch to English
lang set en

# Install a French language pack from a URL
lang install https://example.com/fr.json

# Install from local file
lang pick

# Remove a custom pack
lang remove fr
```

---

## 🖱️ Graphical Operations

- **Edit Memo**: Click the **pencil icon** in the top‑right corner of the memo panel to open the editor (multi‑line input with live preview).
- **Focus Input**: Click anywhere on the terminal output area to automatically focus the command input.

---

## 🖼️ Theme Wallpaper Credits

The built‑in Linux‑themed background images in this project originate from the following sources:

- **Ubuntu, Kali, Deepin, Debian, UOS** themes: Sourced from [Unsplash](https://unsplash.com), free for both commercial and non‑commercial use.
- **Kylin (Kylin OS)** theme: Generated by the AI tool Doubao and is an original work, released under the same license as this project.

All theme names and designs are merely a tribute to the respective operating systems and are not affiliated with or endorsed by the official distributions. All trademarks are the property of their respective owners.

## ❓ FAQ

**Q: Why does `open example.com` do nothing?**  
A: Make sure the extension has the `tabs` permission (it is declared in `manifest.json`). If it still doesn’t work, try reloading the extension.

**Q: The background image doesn’t show after setting it?**  
A: Ensure the image URL allows cross‑origin access. Using a public image hosting service or a direct image link is recommended.

**Q: Why can’t I use `bg set /path/to/image.jpg` to set a local image?**  
A: For security reasons, the extension cannot read a file from your disk by a plain path string. Use `bg pick` to choose a local image through the visual file picker.

**Q: Are the Markdown checkboxes clickable?**  
A: Yes, they are now interactive – you can click a checkbox to toggle a task as completed or not. The change is automatically saved.

**Q: How can I back up all my data?**  
A: Bookmarks can be exported via `export links`. Memo content can be copied manually. Background and font size settings currently need to be recorded manually.

---

<!-- Star History Chart -->
[![Star History Chart](https://api.star-history.com/svg?repos=phoenixhsien/TermTab-newtab&type=Date)](https://star-history.com/#phoenixhsien/TermTab-newtab&Date)

## 📄 License

This project is licensed under the Apache 2.0 License with the Commons Clause restriction on commercial sale.
<p align="center">
  <img src="https://img.shields.io/badge/license-Apache%202.0%20%2B%20Commons%20Clause-blue" alt="License">
</p>

**The theme names and designs in this project are merely a tribute to the corresponding operating systems and have no affiliation with the official distributions. All trademarks are the property of their respective owners.**

**Enjoy your Linux‑style New Tab!** 🐧