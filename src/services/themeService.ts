import * as vscode from 'vscode';
import { ColorScheme, ColorDecorations } from '../models/types';

export class ThemeService {
  private static instance: ThemeService | null = null;
  private currentAppliedFolder: string | null = null;
  private originalColorTheme: string | null = null;

  private constructor() {}

  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  /**
   * 重置单例实例（用于扩展卸载时清理）
   */
  static resetInstance(): void {
    ThemeService.instance = null;
  }

  /**
   * 保存当前主题（在扩展激活时调用）
   */
  saveOriginalTheme(): void {
    this.originalColorTheme = this.getCurrentTheme();
  }

  /**
   * 应用颜色方案
   */
  async applyColorScheme(scheme: ColorScheme, silent: boolean = false): Promise<void> {
    try {
      // 1. 应用整体颜色主题
      await this.applyColorTheme(scheme.colorTheme);

      // 2. 应用装饰色
      await this.applyDecorations(scheme.decorations);

      if (!silent) {
        vscode.window.showInformationMessage(
          `Applied color scheme: ${scheme.name || scheme.colorTheme}`
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(
        `Failed to apply color scheme: ${message}`
      );
      throw error;
    }
  }

  /**
   * 应用整体颜色主题
   */
  private async applyColorTheme(themeId: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');
    await config.update(
      'colorTheme',
      themeId,
      vscode.ConfigurationTarget.Global
    );
  }

  /**
   * 应用装饰色
   */
  private async applyDecorations(decorations: ColorDecorations): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');

    // 使用 Workspace 级别配置，让每个工作区有独立的颜色
    await config.update(
      'colorCustomizations',
      decorations,
      vscode.ConfigurationTarget.Workspace
    );
  }

  /**
   * 重置为默认颜色
   */
  async resetToDefault(): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');

    // 清空装饰色（Workspace 级别）
    await config.update(
      'colorCustomizations',
      undefined,
      vscode.ConfigurationTarget.Workspace
    );

    // 恢复原始主题（如果有保存）
    if (this.originalColorTheme) {
      await config.update(
        'colorTheme',
        this.originalColorTheme,
        vscode.ConfigurationTarget.Global
      );
    }

    this.currentAppliedFolder = null;
  }

  /**
   * 获取当前应用的颜色主题 ID
   */
  getCurrentTheme(): string {
    return vscode.workspace.getConfiguration('workbench').get('colorTheme', 'Default Dark+');
  }

  /**
   * 获取当前应用的文件夹路径
   */
  getCurrentAppliedFolder(): string | null {
    return this.currentAppliedFolder;
  }

  /**
   * 设置当前应用的文件夹路径
   */
  setCurrentAppliedFolder(folderPath: string | null): void {
    this.currentAppliedFolder = folderPath;
  }

  /**
   * 获取所有可用的颜色主题
   */
  async getAvailableThemes(): Promise<{ id: string; label: string }[]> {
    // 常见的内置主题和流行主题
    const builtInThemes = [
      { id: 'Default Dark+', label: 'Dark+ (default dark)' },
      { id: 'Default Light+', label: 'Light+ (default light)' },
      { id: 'Visual Studio Dark', label: 'Visual Studio Dark' },
      { id: 'Visual Studio Light', label: 'Visual Studio Light' },
      { id: 'Monokai', label: 'Monokai' },
      { id: 'Solarized Dark', label: 'Solarized Dark' },
      { id: 'Solarized Light', label: 'Solarized Light' },
      { id: 'One Dark Pro', label: 'One Dark Pro' },
      { id: 'Dracula', label: 'Dracula' },
      { id: 'GitHub Dark', label: 'GitHub Dark' },
      { id: 'GitHub Light', label: 'GitHub Light' },
      { id: 'Material Theme', label: 'Material Theme' },
      { id: 'Nord', label: 'Nord' },
      { id: 'Gruvbox', label: 'Gruvbox' }
    ];

    return builtInThemes;
  }
}
