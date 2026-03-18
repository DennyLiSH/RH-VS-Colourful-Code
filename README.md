# Colourful Code

![VSCode Version](https://img.shields.io/badge/VSCode-%3E%3D1.74.0-blue.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/denny-li-guang.colourful-code.svg)

**English** | [中文](#中文文档)

> Assign different color themes to workspace folders. Never get lost in multi-root workspaces again!

Working with multiple projects in a multi-root workspace? Keep forgetting which project you're editing? **Colourful Code** solves this by giving each folder its own color theme - so you always know exactly where you are.

## Features

- **Per-Folder Themes** - Assign a unique color theme to each workspace folder
- **Auto-Switch** - Auto-switch themes based on the active file's folder
- **Easy Management** - Quickly view, set, and remove folder themes via command palette

## Installation

### From VSCode Marketplace

1. Open VSCode, press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
2. Search for `Colourful Code`
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
| `Set Folder Colour Scheme` | Assign a color theme to the current folder |
| `Remove Folder Colour Scheme` | Remove the theme mapping for a folder |
| `List Folder Colour Schemes` | View all folder-theme mappings |
| `Reset to Default Theme` | Restore your original VSCode theme |
| `Toggle Auto-Switch` | Enable/disable automatic theme switching |

## Requirements

- VSCode >= 1.74.0

## Before Uninstalling

Before uninstalling this extension, it's recommended to reset your theme first:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
2. Type `ColourfulCode: Reset to Default Theme`
3. Execute the command to restore your original theme
4. Then uninstall the extension

> ⚠️ **Note**: Due to VSCode extension limitations, extensions cannot automatically restore settings when uninstalled. If you uninstall directly without resetting, your theme settings may not be restored.

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

- **文件夹主题绑定** - 为每个工作区文件夹设置独立的颜色方案
- **自动切换** - 根据当前活动文件所在文件夹自动切换主题
- **可视化管理** - 快速查看、设置和移除文件夹主题

## 安装

### 从 VSCode 扩展市场安装

1. 打开 VSCode，按 `Ctrl+Shift+X` 打开扩展面板
2. 搜索 `Colourful Code`
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
| `Set Folder Colour Scheme` | 为当前文件夹设置颜色方案 |
| `Remove Folder Colour Scheme` | 移除文件夹的颜色方案 |
| `List Folder Colour Schemes` | 列出所有文件夹的颜色方案 |
| `Reset to Default Theme` | 重置为默认主题 |
| `Toggle Auto-Switch` | 切换自动切换功能 |

## 要求

- VSCode >= 1.74.0

## 卸载前注意事项

在卸载此扩展之前，建议先重置主题：

1. 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）打开命令面板
2. 输入 `ColourfulCode: Reset to Default Theme`
3. 执行命令后，主题将恢复为安装插件前的设置
4. 然后再卸载插件

> ⚠️ **注意**：由于 VSCode 扩展机制的限制，扩展在卸载时无法自动恢复设置。如果直接卸载，主题设置可能无法恢复。

## 已知问题

暂无已知问题。如发现问题，请在 [Issues](https://github.com/DennyLiSH/RH-VS-Colourful-Code/issues) 中反馈。

## 许可证

[MIT](LICENSE)
