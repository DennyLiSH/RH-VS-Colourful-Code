import * as vscode from 'vscode';
import { ConfigManager } from '../services/configManager';
import { ThemeService } from '../services/themeService';

export class RemoveFolderThemeCommand {
  constructor(
    private configManager: ConfigManager,
    private themeService: ThemeService
  ) {}

  async execute(): Promise<void> {
    const mappings = this.configManager.getFolderMappings();

    if (mappings.length === 0) {
      vscode.window.showInformationMessage('No folder theme mappings configured.');
      return;
    }

    const picks = mappings.map(m => ({
      label: m.folderName,
      description: m.folderPath,
      detail: `Theme: ${m.colorScheme.name || m.colorScheme.colorTheme}`,
      folderPath: m.folderPath
    }));

    const selected = await vscode.window.showQuickPick(picks, {
      placeHolder: 'Select a folder mapping to remove'
    });

    if (!selected) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      `Remove color scheme for "${selected.label}"?`,
      'Yes', 'No'
    );

    if (confirm === 'Yes') {
      const removed = await this.configManager.removeFolderMapping(selected.folderPath);

      if (removed) {
        vscode.window.showInformationMessage(
          `Color scheme removed for "${selected.label}"`
        );

        // 如果移除的是当前应用的文件夹，重置主题
        if (this.themeService.getCurrentAppliedFolder() === selected.folderPath) {
          await this.themeService.resetToDefault();
        }
      }
    }
  }
}
