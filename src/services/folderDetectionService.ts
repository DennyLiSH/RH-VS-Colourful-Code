import * as vscode from 'vscode';
import { ConfigManager } from './configManager';
import { ThemeService } from './themeService';
import { FolderThemeMapping } from '../models/types';

export class FolderDetectionService {
  private readonly configManager: ConfigManager;
  private readonly themeService: ThemeService;
  private disposables: vscode.Disposable[] = [];
  private lastActiveFolder: string | null = null;
  private isApplying: boolean = false;
  private suppressed: boolean = false;

  constructor(configManager: ConfigManager, themeService: ThemeService) {
    this.configManager = configManager;
    this.themeService = themeService;
  }

  /**
   * 初始化监听器
   */
  initialize(): void {
    // 监听活动编辑器变化
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(
        this.onActiveEditorChanged.bind(this)
      )
    );

    // 监听工作区文件夹变化
    this.disposables.push(
      vscode.workspace.onDidChangeWorkspaceFolders(
        this.onWorkspaceFoldersChanged.bind(this)
      )
    );

    // 初始化时检查当前编辑器
    if (vscode.window.activeTextEditor) {
      this.onActiveEditorChanged(vscode.window.activeTextEditor);
    } else {
      // 无活动编辑器时，检测工作区根文件夹并应用颜色
      this.applyRootFolderTheme();
    }
  }

  /**
   * 应用工作区根文件夹的主题（用于无活动编辑器时）
   */
  private applyRootFolderTheme(): void {
    const settings = this.configManager.getSettings();
    if (!settings.autoSwitch) {
      return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const rootFolder = workspaceFolders[0];
      const mapping = this.configManager.getFolderMapping(rootFolder.uri.fsPath);
      if (mapping && mapping.enabled) {
        this.lastActiveFolder = rootFolder.uri.fsPath;
        this.applyMapping(mapping);
      }
    }
  }

  /**
   * 活动编辑器变化处理
   */
  private async onActiveEditorChanged(editor: vscode.TextEditor | undefined): Promise<void> {
    if (!editor || this.isApplying || this.suppressed) {
      return;
    }

    const settings = this.configManager.getSettings();
    if (!settings.autoSwitch) {
      return;
    }

    const document = editor.document;
    const folder = vscode.workspace.getWorkspaceFolder(document.uri);

    if (!folder) {
      // 文件不属于任何工作区文件夹
      return;
    }

    const folderPath = folder.uri.fsPath;

    // 如果是同一个文件夹，不需要切换
    if (folderPath === this.lastActiveFolder) {
      return;
    }

    this.lastActiveFolder = folderPath;

    // 查找该文件夹的映射
    const mapping = this.configManager.getFolderMapping(folderPath);

    if (mapping && mapping.enabled) {
      await this.applyMapping(mapping);
    }
  }

  /**
   * 应用文件夹映射
   */
  private async applyMapping(mapping: FolderThemeMapping): Promise<void> {
    this.isApplying = true;
    try {
      await this.themeService.applyColorScheme(mapping.colorScheme, true);
      this.themeService.setCurrentAppliedFolder(mapping.folderPath);
    } finally {
      this.isApplying = false;
    }
  }

  /**
   * 工作区文件夹变化处理
   */
  private onWorkspaceFoldersChanged(event: vscode.WorkspaceFoldersChangeEvent): void {
    console.log('Workspace folders changed:', event);
  }

  /**
   * 获取当前活动文件所属的文件夹
   */
  getCurrentFolder(): vscode.WorkspaceFolder | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return undefined;
    }
    return vscode.workspace.getWorkspaceFolder(editor.document.uri);
  }

  /**
   * 手动触发当前文件夹的主题切换
   */
  async triggerCurrentFolderTheme(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await this.onActiveEditorChanged(editor);
    }
  }

  /**
   * 抑制自动切换（预览期间使用）
   */
  suppress(): void {
    this.suppressed = true;
  }

  /**
   * 恢复自动切换
   */
  resume(): void {
    this.suppressed = false;
  }

  /**
   * 重置最后活动文件夹（用于强制重新检测）
   */
  resetLastActiveFolder(): void {
    this.lastActiveFolder = null;
  }

  /**
   * 销毁服务
   */
  dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }
}
