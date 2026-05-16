# 🐧 TermTab 新标签页 · 终端风格插件
<p align="right">
  <a href="./README_EN.md">EN 英文</a>
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
  <img src="https://img.shields.io/github/downloads/phoenixhsien/repo/total" alt="Downloads">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
  <img src="https://img.shields.io/github/contributors/phoenixhsien/TermTab-newtab" alt="Contributors">
</p>


一个将 Chrome 新标签页转变为 TermTab 终端模拟器的扩展。通过输入 Linux 风格的指令，您可以高效地管理常用链接、搜索、备忘录、外观设置等。备忘录原生支持 Markdown 任务列表。

![TermTab New Tab 预览](/ImageForMD/TabKali.jpg)
![TermTab New Tab 预览](/ImageForMD/TabTheme.jpg)

## 📦 功能一览

- **🔗 智能链接管理**：通过指令添加、删除、列出常用网站，一键跳转。
- **🔍 快速搜索**：支持 Google、百度、Bing、DuckDuckGo 等多引擎搜索，可自定义默认引擎。
- **📝 备忘录（支持 Markdown）**：可编辑、实时渲染，完美支持 `- [ ]` 待办清单，点击复选框即可切换完成状态。
- **🌐 多语言切换**：内置中英文，支持通过命令安装、切换和卸载语言包，界面实时更新。
- **🎨 多主题切换**：内置 Ubuntu、Kali、Deepin、Debian、UOS、Kylin 六种 Linux 风格主题，一键切换。
- **🖼️ 自定义外观**：设置背景图片、调整终端字体大小。
- **📤 数据导出**：将常用链接导出为 JSON 文件备份。
- **🧹 历史与清屏**：清除命令历史记录，或清空终端屏幕。
- **💾 数据持久化**：所有设置、链接、备忘录自动保存至浏览器本地。

---

## 🚀 安装指南

### 1. 准备文件
确保您的扩展文件夹包含以下结构：
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

### 2. 加载到 Chrome
1. 打开 Chrome 浏览器，在地址栏输入 `chrome://extensions/` 并回车。
2. 开启右上角的 **“开发者模式”** 开关。
3. 点击 **“加载已解压的扩展程序”**，选择包含上述文件的 `TermTab-newtab` 文件夹。
4. 扩展加载成功后，打开一个新标签页即可体验。

---

## ⌨️ 终端命令手册

所有命令均在终端输入框中键入，按 `Enter` 执行。支持 `↑` / `↓` 键回溯历史命令。

### 🌐 网页浏览与搜索

| 命令                           | 说明                                                                                      | 示例                        |
|------------------------------|-----------------------------------------------------------------------------------------|---------------------------|
| `open <网址> [-t]`             | 在当前标签页打开指定网址（自动补全 `https://`） `-t`表示在新标签页打开                                             | `open github.com`         |
| `search -s <引擎>`               | 设置默认搜索引擎（google/baidu/bing/duckduckgo）                                                  | `search -s baidu`           |
| `search <关键词> [by <引擎>] [-t]` | 使用指定搜索引擎搜索关键词。默认使用 Google(可修改)。支持的引擎：`google`、`baidu`、`bing`、`duckduckgo`，`-t`表示在新标签页打开 | `search 乌班图 新标签页 by baidu` |
| `go <链接名称> [-t]`             | 快速打开已保存的常用链接，`-t`表示在新标签页打开                                                              | `go google`               |

### 📎 常用链接管理 (link)

| 命令 | 说明 | 示例 |
|------|------|------|
| `link list` | 列出所有已保存的常用链接 | `link list` |
| `link add <名称> <网址>` | 添加一个新的常用链接 | `link add drive https://drive.google.com` |
| `link remove <名称>` | 删除指定名称的常用链接 | `link remove drive` |
| `export links [文件名]` | 将所有常用链接导出为 JSON 文件。可指定文件名（支持子目录路径，如 `backup/links.json`，取决于下载设置） | `export links my_links.json` 或 `export links backup/TermTab_links` |

### 🖌️ 外观定制

| 命令               | 说明                   | 示例                                                                        |
|------------------|----------------------|---------------------------------------------------------------------------|
| `bg set <图片URL>` | 设置新标签页背景图片（支持网络图片链接） | `bg set https://images.pexels.com/photos/247676/pexels-photo-247676.jpeg` |
| `bg pick`        | 弹出文件选择器，选取本地图片作为背景   | `bg pick`                                                                 |
| `bg reset`       | 恢复为默认的渐变紫色背景         | `bg reset`                                                                |
| `bg remove`      | 去除背景图                | `bg remove`                                                               |
| `font size <数值>` | 调整终端基础字体大小（单位：像素）    | `font size 18`                                                            |

### 🎨 主题切换 (theme)

| 命令 | 说明                                           | 示例 |
|------|----------------------------------------------|------|
| `theme list` | 列出所有可用主题及当前主题                                | `theme list` |
| `theme set <主题名>` | 切换到指定主题（ubuntu/kali/deepin/debian/uos/kylin） | `theme set kali` |

### 📝 备忘录 (memo) - 支持 Markdown

备忘录显示在终端右侧面板，支持 **Markdown 语法**，尤其适合 `- [ ]` 任务清单。您也可以通过界面上的 ✏️ 按钮进行可视化编辑。

| 命令 | 说明 | 示例 |
|------|------|------|
| `memo` | 在终端中显示当前备忘录内容 | `memo` |
| `memo set <内容>` | 用新内容完全替换当前备忘录 | `memo set "# 购物清单\n- [ ] 牛奶"` |
| `memo append <内容>` | 在现有备忘录末尾追加一行文本 | `memo append "- [x] 完成报告"` |
| `memo clear` | 清空备忘录 | `memo clear` |

> **Markdown 备忘示例**：在编辑器中输入：
> ```markdown
> # 今日待办
> - [x] 查看邮件
> - [ ] 更新项目文档
> - [ ] 下午3点会议
> ```
> 保存后即可看到带复选框的渲染效果。

### 🧹 系统与历史

| 命令 | 说明 |
|------|------|
| `clear` | 清空终端屏幕（等同于 Linux 的 `clear` 命令） |
| `history clear` | 删除所有已保存的命令历史记录（按 `↑` 将不再显示旧命令） |
| `help` 或 `h` | 显示所有可用命令的帮助信息 |

---

### 🌐 语言切换命令 (`lang`)

| 命令 | 说明 |
|------|------|
| `lang list` | 列出所有已安装的语言包，当前使用的语言会标注“(当前)”。 |
| `lang set <代码>` | 切换界面语言（例如 `zh_CN` 为中文，`en` 为英文）。 |
| `lang install <URL>` | 通过远程 JSON 链接安装语言包。 |
| `lang pick` | 从本地选择 `.json` 语言包文件安装。 |
| `lang remove <代码>` | 删除用户安装的语言包（内置的 `en` 和 `zh_CN` 不可删除）。 |

**示例**

```bash
# 查看可用语言
lang list

# 切换到中文
lang set zh_CN

# 切换到英文
lang set en

# 从网址安装一个法语语言包
lang install https://example.com/fr.json

# 从本地文件安装
lang pick

# 删除一个自定义语言包
lang remove fr
```

---

## 🖱️ 图形化操作补充

- **备忘录编辑**：点击备忘录面板右上角的 **铅笔图标** 可打开编辑器，支持多行输入与实时预览。
- **聚焦输入框**：点击终端输出区域任意位置，即可自动聚焦到命令输入框。

---

## 🖼️ 主题壁纸来源

本项目内置的 Linux 风格主题背景图来源如下：

- **Ubuntu、Kali、Deepin、Debian、UOS** 主题壁纸：选自 [Unsplash](https://unsplash.com) 免版权图库，可自由用于商业及非商业用途。
- **Kylin（银河麒麟）** 主题壁纸：由 AI 工具（豆包）生成，为原创作品，与本项目采用相同许可证发布。

所有主题名称及设计仅为向对应操作系统致敬，与各发行版官方无关。各商标归其各自所有者所有。

## ❓ 常见问题

**Q：为什么输入 `open example.com` 后没有反应？**  
A：请检查扩展是否拥有 `tabs` 权限（已在 `manifest.json` 中声明）。若仍无效，可尝试重新加载扩展。

**Q：背景图设置后不显示？**  
A：请确保图片 URL 支持跨域访问，建议使用图床或网络公开图片链接。

**Q：为什么不能用 `bg set /path/to/image.jpg` 设置本地图片？**  
A：出于浏览器安全策略，扩展无法直接通过文件路径字符串读取用户磁盘文件。请使用 `bg pick` 命令，通过可视化文件选择器来选取本地图片。

**Q：备忘录的 Markdown 复选框可以点击吗？**  
A：备忘录用作文本展示，复选框为静态渲染。若需交互式勾选，请通过命令或编辑器修改文本内容（将 `- [ ]` 改为 `- [x]`）。
**已修改，可点击**

**Q：如何备份我的所有数据？**  
A：常用链接可通过 `export links` 导出为 JSON 文件。备忘录内容可手动复制备份。背景图、字体大小等设置目前需手动记录。

---

<!-- Star 历史曲线 -->
[![Star History Chart](https://api.star-history.com/svg?repos=phoenixhsien/TermTab-newtab&type=Date)](https://star-history.com/phoenixhsien/TermTab-newtab&Date)

## 📄 许可

本项目采用 Apache 2.0 协议，并附加 Commons Clause 限制商业销售。
<p align="center">
  <img src="https://img.shields.io/badge/license-Apache%202.0%20%2B%20Commons%20Clause-blue" alt="License">
</p>

**本项目中的主题名称和设计仅为向对应操作系统致敬，与各发行版官方无关。所有商标归其各自所有者所有。**

**享受您的 Linux 风格新标签页！** 🐧

