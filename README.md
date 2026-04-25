# Colorful Folder

![VSCode Version](https://img.shields.io/badge/VSCode-%3E%3D1.74.0-blue.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/denny-li-guang.colourful-code.svg)

**English** | [中文](#中文文档)

> Assign different color themes to workspace folders. Never get lost in multi-root workspaces again!

Working with multiple projects in a multi-root workspace? Keep forgetting which project you're editing? **Colorful Folder** solves this by giving each folder its own color theme — so you always know exactly where you are.

## Features

- **Per-Folder Themes** — Assign a unique color theme to each workspace folder
- **Auto-Switch** — Automatically switch themes based on the active file's folder
- **Three Configuration Modes** — Choose from preset schemes, custom color + theme, or quick UI-only config
- **Light & Dark Themes** — Full support for both light and dark color schemes with 21 built-in presets
- **Dynamic Theme Detection** — Automatically discovers all installed themes from extensions
- **Visual Presets** — Color icons and theme type indicators (Light / Dark) in preset picker
- **Easy Management** — Quickly view, apply, enable, disable, or remove folder themes via command palette
- **First-Run Guide** — Helpful prompt to set up your first folder color on install

## Installation

### From VSCode Marketplace

1. Open VSCode, press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
2. Search for `Colorful Folder`
3. Click Install

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/DennyLiSH/RH-VS-Colourful-Code/releases)
2. Open VSCode, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type `Extensions: Install from VSIX...`
4. Select the downloaded file

## Usage

### Commands

Press `Ctrl+Shift+P` to open the command palette:

| Command | Description |
|---------|-------------|
| `Set Folder Color Scheme` | Assign a color theme to a folder (preset / custom / quick) |
| `Remove Folder Color Scheme` | Remove a folder's theme mapping |
| `List Folder Color Schemes` | View all mappings, apply, enable/disable, or remove them |
| `Reset to Default Theme` | Restore your original VSCode theme |
| `Toggle Auto-Switch` | Enable/disable automatic theme switching |

### Setting a Folder Color Scheme

When you run **Set Folder Color Scheme**, you'll choose from three modes:

1. **Preset Scheme** — Pick from 21 built-in color presets (13 dark + 8 light). Each preset shows a color icon and theme type indicator.
2. **Custom Color** — Select any installed color theme, then pick a custom color. The theme applies instantly so you can preview before choosing the color.
3. **Quick Config** — Keep your current theme and only change the UI accent colors (title bar, activity bar, status bar, tabs, etc.).

### Managing Existing Schemes

Use **List Folder Color Schemes** to:
- See all configured folder-to-theme mappings with color previews
- Apply a scheme immediately
- Enable or disable a mapping without deleting it
- Remove a mapping entirely

## Requirements

- VSCode >= 1.74.0

## Extension Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `colourfulCode.autoSwitch` | boolean | `true` | Automatically switch color scheme based on the active file's folder |

## Before Uninstalling

Before uninstalling this extension, it's recommended to reset your theme first:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
2. Type `Colorful Folder: Reset to Default Theme`
3. Execute the command to restore your original theme
4. Then uninstall the extension

> **Note**: Due to VSCode extension limitations, extensions cannot automatically restore settings when uninstalled. If you uninstall directly without resetting, your theme settings may not be restored.

## Known Issues

None at this time. If you find any issues, please report them in [Issues](https://github.com/DennyLiSH/RH-VS-Colourful-Code/issues).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

[MIT](LICENSE)

---

# 中文文档

为不同的工作区文件夹设置不同的颜色方案，让你在多项目工作区中快速识别当前所在的项目。

## 功能特性

- **文件夹主题绑定** — 为每个工作区文件夹设置独立的颜色方案
- **自动切换** — 根据当前活动文件所在文件夹自动切换主题
- **三种配置模式** — 预设方案、自定义颜色+主题、快速 UI 配置
- **明暗主题全支持** — 内置 21 种预设配色（13 款暗色 + 8 款亮色）
- **动态主题检测** — 自动发现所有已安装扩展贡献的主题
- **可视化预设** — 预设列表显示颜色图标和主题类型标识（Light / Dark）
- **便捷管理** — 通过命令面板快速查看、应用、启用/禁用、移除文件夹主题
- **首次使用引导** — 安装后智能提示设置第一个文件夹颜色

## 安装

### 从 VSCode 扩展市场安装

1. 打开 VSCode，按 `Ctrl+Shift+X` 打开扩展面板
2. 搜索 `Colorful Folder`
3. 点击安装

### 从 VSIX 安装

1. 从 [Releases](https://github.com/DennyLiSH/RH-VS-Colourful-Code/releases) 下载 `.vsix` 文件
2. 在 VSCode 中按 `Ctrl+Shift+P` 打开命令面板
3. 输入 `Extensions: Install from VSIX...`
4. 选择下载的文件

## 使用方法

### 命令

按 `Ctrl+Shift+P` 打开命令面板：

| 命令 | 说明 |
|------|------|
| `Set Folder Color Scheme` | 为文件夹设置颜色方案（预设/自定义/快速） |
| `Remove Folder Color Scheme` | 移除文件夹的颜色方案 |
| `List Folder Color Schemes` | 列出所有方案，可应用、启用/禁用或移除 |
| `Reset to Default Theme` | 重置为默认主题 |
| `Toggle Auto-Switch` | 切换自动切换功能 |

### 设置文件夹颜色方案

执行 **Set Folder Color Scheme** 后，可选择三种模式：

1. **Preset Scheme（预设方案）** — 从 21 种内置配色中选择（13 款暗色 + 8 款亮色）。每个预设显示颜色图标和主题类型标识。
2. **Custom Color（自定义颜色）** — 选择任意已安装的主题，再挑选自定义颜色。主题会即时应用，方便你在选择颜色前预览效果。
3. **Quick Config（快速配置）** — 保持当前主题，仅修改 UI 强调色（标题栏、活动栏、状态栏、标签页等）。

### 管理已有方案

使用 **List Folder Color Schemes** 可以：
- 查看所有已配置的文件夹-主题映射及颜色预览
- 立即应用某个方案
- 启用或禁用某个映射（不删除）
- 彻底移除某个映射

## 要求

- VSCode >= 1.74.0

## 扩展设置

| 设置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `colourfulCode.autoSwitch` | 布尔值 | `true` | 根据活动文件所在文件夹自动切换颜色方案 |

## 卸载前注意事项

在卸载此扩展之前，建议先重置主题：

1. 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）打开命令面板
2. 输入 `Colorful Folder: Reset to Default Theme`
3. 执行命令后，主题将恢复为安装插件前的设置
4. 然后再卸载插件

> **注意**：由于 VSCode 扩展机制的限制，扩展在卸载时无法自动恢复设置。如果直接卸载，主题设置可能无法恢复。

## 已知问题

暂无已知问题。如发现问题，请在 [Issues](https://github.com/DennyLiSH/RH-VS-Colourful-Code/issues) 中反馈。

## 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)。

## 许可证

[MIT](LICENSE)
