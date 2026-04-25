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

    // 2. 选择配置方式
    const modePick = await vscode.window.showQuickPick([
      { label: '$(symbol-color) Preset Scheme', description: 'Choose from predefined schemes with theme hints', value: 'preset' },
      { label: '$(pencil) Custom Color', description: 'Pick a custom color and theme', value: 'custom' },
      { label: '$(rocket) Quick Config', description: 'Keep current theme, change UI colors only', value: 'quick' }
    ], { placeHolder: 'Select configuration mode' });

    if (!modePick) {
      return;
    }

    let colorScheme: ColorScheme | undefined;
    switch (modePick.value) {
      case 'preset':
        colorScheme = await this.selectPreset();
        break;
      case 'custom':
        colorScheme = await this.customConfiguration();
        break;
      case 'quick':
      default:
        colorScheme = await this.quickColorConfiguration();
        break;
    }

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
    this.themeService.setCurrentAppliedFolder(targetFolder.uri.fsPath);

    vscode.window.showInformationMessage(
      `Color scheme set for "${targetFolder.name}"`
    );
  }

  /**
   * 选择预设方案
   */
  private async selectPreset(): Promise<ColorScheme | undefined> {
    const presets = this.configManager.getPresetSchemes();

    const picks = presets.map(p => {
      const typeLabel = p.themeType === 'light' ? '☀️ Light' : p.themeType === 'dark' ? '🌙 Dark' : '💡 Both';
      const primaryColor = p.colorScheme.decorations['titleBar.activeBackground'] || '#888888';
      return {
        label: p.name,
        description: `${typeLabel} · Theme: ${p.colorScheme.colorTheme}`,
        iconPath: ColorPicker.createColorIcon(primaryColor),
        preset: p
      };
    });

    const selected = await vscode.window.showQuickPick(picks, {
      placeHolder: 'Select a preset color scheme'
    });

    return selected?.preset.colorScheme;
  }

  /**
   * 自定义配置
   */
  private async customConfiguration(): Promise<ColorScheme | undefined> {
    // 选择颜色主题
    const themes = await this.themeService.getAvailableThemes();

    const typeColorMap: Record<string, string> = {
      'vs': '#e8e8e8',
      'vs-dark': '#2d2d30',
      'hc-black': '#000000',
      'hc-light': '#ffffff'
    };

    const themePicks = themes.map(t => ({
      label: t.label,
      description: t.id,
      iconPath: ColorPicker.createColorIcon(typeColorMap[t.type] || '#888888'),
      id: t.id,
      type: t.type
    }));

    const selectedTheme = await vscode.window.showQuickPick(themePicks, {
      placeHolder: 'Select a color theme'
    });

    if (!selectedTheme) {
      return undefined;
    }

    // 立即应用选中的主题，让用户在选择颜色时能看到实际效果
    await this.themeService.applyColorTheme(selectedTheme.id);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 判断主题类型
    const themeType: 'light' | 'dark' = selectedTheme.type === 'vs' || selectedTheme.type === 'hc-light' ? 'light' : 'dark';

    // 选择主色调
    const primaryColor = await ColorPicker.show(themeType);

    if (!primaryColor) {
      return undefined;
    }

    // 生成装饰色
    const decorations = this.generateDecorations(primaryColor, themeType);

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
    const currentTheme = this.themeService.getCurrentTheme();

    // 判断当前主题类型
    const themes = await this.themeService.getAvailableThemes();
    const currentThemeInfo = themes.find(t => t.id === currentTheme);
    const themeType: 'light' | 'dark' = currentThemeInfo?.type === 'vs' || currentThemeInfo?.type === 'hc-light' ? 'light' : 'dark';

    const color = await ColorPicker.show(themeType);

    if (!color) {
      return undefined;
    }

    const decorations = this.generateDecorations(color, themeType);

    return {
      colorTheme: currentTheme,
      name: `Quick - ${color}`,
      decorations
    };
  }

  /**
   * 根据主色调生成装饰色配置
   * @param primaryColor 主色调
   * @param themeType 主题类型，决定生成 light 还是 dark 风格的装饰色
   */
  private generateDecorations(primaryColor: string, themeType: 'light' | 'dark' = 'dark'): ColorDecorations {
    if (themeType === 'light') {
      const borderColor = this.darkenColor(primaryColor, 0.1);
      const lighterBg = this.lightenColor(primaryColor, 0.3);

      return {
        'titleBar.activeBackground': primaryColor,
        'titleBar.activeForeground': '#1a1a1a',
        'titleBar.inactiveBackground': lighterBg,
        'titleBar.inactiveForeground': '#666666',
        'activityBar.background': primaryColor,
        'activityBar.foreground': '#1a1a1a',
        'activityBar.activeBorder': borderColor,
        'sideBar.background': lighterBg,
        'sideBar.foreground': '#1a1a1a',
        'sideBarTitle.foreground': '#1a1a1a',
        'statusBar.background': primaryColor,
        'statusBar.foreground': '#1a1a1a',
        'tab.activeBackground': lighterBg,
        'tab.activeForeground': '#1a1a1a',
        'tab.inactiveBackground': primaryColor,
        'tab.inactiveForeground': '#666666',
        'tab.border': borderColor,
        'editorGroup.border': borderColor,
        'editorGroupHeader.tabsBackground': lighterBg
      };
    }

    // Dark mode (existing logic)
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
