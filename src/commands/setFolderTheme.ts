import * as vscode from 'vscode';
import { ConfigManager } from '../services/configManager';
import { ThemeService } from '../services/themeService';
import { FolderThemeMapping, ColorScheme, ColorDecorations } from '../models/types';
import { ColorPicker } from '../ui/colorPicker';

export class SetFolderThemeCommand {
  private configManager: ConfigManager;
  private themeService: ThemeService;

  constructor(configManager: ConfigManager, themeService: ThemeService) {
    this.configManager = configManager;
    this.themeService = ThemeService.getInstance();
  }

  /**
   * 执行命令
   */
  async execute(): Promise<void> {
    // 1. 选择工作区文件夹
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      vscode.window.showWarningMessage('No workspace folders found. Please open a folder first.');
      return;
    }

    let targetFolder: vscode.WorkspaceFolder;

    if (folders.length === 1) {
      targetFolder = folders[0];
    } else {
      const picks = folders.map(f => ({
        label: f.name,
        description: f.uri.fsPath,
        folder: f
      }));

      const selected = await vscode.window.showQuickPick(picks, {
        placeHolder: 'Select a workspace folder to configure'
      });

      if (!selected) {
        return;
      }
      targetFolder = selected.folder;
    }

    // 2. 快速颜色配置
    const colorScheme = await this.quickColorConfiguration();

    if (!colorScheme) {
      return;
    }

    // 3. 保存映射
    const mapping: Omit<FolderThemeMapping, 'createdAt' | 'updatedAt'> = {
      folderPath: targetFolder.uri.fsPath,
      folderName: targetFolder.name,
      colorScheme,
      enabled: true
    };

    await this.configManager.setFolderMapping(mapping);

    // 4. 立即应用
    await this.themeService.applyColorScheme(colorScheme, true);

    vscode.window.showInformationMessage(
      `Colour scheme set for "${targetFolder.name}"`
    );
  }

  /**
   * 选择预设方案
   */
  private async selectPreset(): Promise<ColorScheme | undefined> {
    const presets = this.configManager.getPresetSchemes();

    const picks = presets.map(p => ({
      label: p.name,
      description: `Theme: ${p.colorScheme.colorTheme}`,
      preset: p
    }));

    const selected = await vscode.window.showQuickPick(picks, {
      placeHolder: 'Select a preset colour scheme'
    });

    return selected?.preset.colorScheme;
  }

  /**
   * 自定义配置
   */
  private async customConfiguration(): Promise<ColorScheme | undefined> {
    // 选择颜色主题
    const themes = await this.themeService.getAvailableThemes();

    const themePicks = themes.map(t => ({
      label: t.label,
      description: t.id,
      id: t.id
    }));

    const selectedTheme = await vscode.window.showQuickPick(themePicks, {
      placeHolder: 'Select a colour theme'
    });

    if (!selectedTheme) {
      return undefined;
    }

    // 选择主色调
    const primaryColor = await ColorPicker.show();

    if (!primaryColor) {
      return undefined;
    }

    // 生成装饰色
    const decorations = this.generateDecorations(primaryColor);

    return {
      colorTheme: selectedTheme.id,
      name: `Custom - ${primaryColor}`,
      decorations
    };
  }

  /**
   * 快速颜色配置
   */
  private async quickColorConfiguration(): Promise<ColorScheme | undefined> {
    // 只设置边框/标题栏颜色，保持当前主题
    const color = await ColorPicker.show();

    if (!color) {
      return undefined;
    }

    const currentTheme = this.themeService.getCurrentTheme();
    const decorations = this.generateDecorations(color);

    return {
      colorTheme: currentTheme,
      name: `Quick - ${color}`,
      decorations
    };
  }

  /**
   * 根据主色调生成装饰色配置
   */
  private generateDecorations(primaryColor: string): ColorDecorations {
    // 生成较深的背景色和较亮的强调色
    const darkerColor = this.darkenColor(primaryColor, 0.3);
    const lighterColor = this.lightenColor(primaryColor, 0.2);

    return {
      'titleBar.activeBackground': primaryColor,
      'titleBar.activeForeground': '#ffffff',
      'titleBar.inactiveBackground': darkerColor,
      'titleBar.inactiveForeground': '#cccccc',
      'activityBar.background': primaryColor,
      'activityBar.foreground': '#ffffff',
      'activityBar.activeBorder': lighterColor,
      'sideBar.background': darkerColor,
      'sideBar.foreground': '#ffffff',
      'sideBarTitle.foreground': '#ffffff',
      'statusBar.background': primaryColor,
      'statusBar.foreground': '#ffffff',
      'tab.activeBackground': lighterColor,
      'tab.activeForeground': '#ffffff',
      'tab.inactiveBackground': primaryColor,
      'tab.inactiveForeground': '#cccccc',
      'tab.border': lighterColor,
      'editorGroup.border': lighterColor,
      'editorGroupHeader.tabsBackground': darkerColor
    };
  }

  /**
   * 使颜色变暗
   */
  private darkenColor(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  /**
   * 使颜色变亮
   */
  private lightenColor(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
