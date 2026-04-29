import * as vscode from 'vscode';
import { ColorScheme, ColorDecorations, ThemeInfo } from '../models/types';

export interface ThemeSnapshot {
  colorTheme: string;
  decorations: ColorDecorations | undefined;
}

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
  async applyColorTheme(themeId: string): Promise<void> {
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
   * 保存当前主题状态的快照（用于预览恢复）
   */
  snapshotCurrentState(): ThemeSnapshot {
    const config = vscode.workspace.getConfiguration('workbench');
    return {
      colorTheme: config.get<string>('colorTheme', 'Default Dark+'),
      decorations: config.get<ColorDecorations>('colorCustomizations') ?? undefined
    };
  }

  /**
   * 从快照恢复主题状态
   */
  async restoreFromSnapshot(snapshot: ThemeSnapshot): Promise<void> {
    await this.applyColorTheme(snapshot.colorTheme);
    const config = vscode.workspace.getConfiguration('workbench');
    await config.update(
      'colorCustomizations',
      snapshot.decorations ?? undefined,
      vscode.ConfigurationTarget.Workspace
    );
  }

  /**
   * 仅应用装饰色（不改主题，用于颜色预览）
   */
  async applyDecorationsOnly(decorations: ColorDecorations): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');
    await config.update(
      'colorCustomizations',
      decorations,
      vscode.ConfigurationTarget.Workspace
    );
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
   * 内置主题保底 + 动态扫描已安装扩展贡献的主题
   */
  async getAvailableThemes(): Promise<ThemeInfo[]> {
    const themes: ThemeInfo[] = [];
    const seen = new Set<string>();

    // 1. 先加入 VSCode 内置主题（保底）
    const builtInThemes: ThemeInfo[] = [
      { id: 'Default Dark+', label: 'Dark+ (default dark)', type: 'vs-dark' },
      { id: 'Default Light+', label: 'Light+ (default light)', type: 'vs' },
      { id: 'Visual Studio Dark', label: 'Visual Studio Dark', type: 'vs-dark' },
      { id: 'Visual Studio Light', label: 'Visual Studio Light', type: 'vs' },
      { id: 'Abyss', label: 'Abyss', type: 'vs-dark' },
      { id: 'Kimbie Dark', label: 'Kimbie Dark', type: 'vs-dark' },
      { id: 'Monokai', label: 'Monokai', type: 'vs-dark' },
      { id: 'Monokai Dimmed', label: 'Monokai Dimmed', type: 'vs-dark' },
      { id: 'Quiet Light', label: 'Quiet Light', type: 'vs' },
      { id: 'Red', label: 'Red', type: 'vs-dark' },
      { id: 'Solarized Dark', label: 'Solarized Dark', type: 'vs-dark' },
      { id: 'Solarized Light', label: 'Solarized Light', type: 'vs' },
      { id: 'Tomorrow Night Blue', label: 'Tomorrow Night Blue', type: 'vs-dark' }
    ];

    for (const t of builtInThemes) {
      themes.push(t);
      seen.add(t.id);
    }

    // 2. 动态扫描已安装扩展贡献的主题（去重合并）
    for (const extension of vscode.extensions.all) {
      const contributes = extension.packageJSON?.contributes;
      if (contributes?.themes && Array.isArray(contributes.themes)) {
        for (const theme of contributes.themes) {
          const themeId = theme.id || theme.label;
          if (themeId && theme.label && !seen.has(themeId)) {
            seen.add(themeId);
            themes.push({
              id: themeId,
              label: theme.label,
              type: theme.uiTheme || 'vs-dark'
            });
          }
        }
      }
    }

    return themes;
  }
}
