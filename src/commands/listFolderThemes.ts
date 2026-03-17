import * as vscode from 'vscode';
import { ConfigManager } from '../services/configManager';
import { ThemeService } from '../services/themeService';

export class ListFolderThemesCommand {
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

    const items = mappings.map(m => ({
      label: `${m.enabled ? '$(check)' : '$(circle-slash)'} ${m.folderName}`,
      description: m.colorScheme.name || m.colorScheme.colorTheme,
      detail: m.folderPath,
      mapping: m
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Configured folder theme mappings',
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (selected) {
      // 提供操作选项
      const actions = [
        { label: '$(play) Apply Now', action: 'apply' },
        { label: selected.mapping.enabled ? '$(circle-slash) Disable' : '$(check) Enable', action: 'toggle' },
        { label: '$(trash) Remove', action: 'remove' }
      ];

      const action = await vscode.window.showQuickPick(actions, {
        placeHolder: `Actions for "${selected.mapping.folderName}"`
      });

      if (action) {
        switch (action.action) {
          case 'toggle':
            await this.configManager.toggleFolderMapping(
              selected.mapping.folderPath,
              !selected.mapping.enabled
            );
            vscode.window.showInformationMessage(
              `${selected.mapping.folderName} ${selected.mapping.enabled ? 'disabled' : 'enabled'}`
            );
            break;
          case 'remove':
            const confirm = await vscode.window.showWarningMessage(
              `Remove color scheme for "${selected.mapping.folderName}"?`,
              'Yes', 'No'
            );
            if (confirm === 'Yes') {
              await this.configManager.removeFolderMapping(selected.mapping.folderPath);
              vscode.window.showInformationMessage(
                `Color scheme removed for "${selected.mapping.folderName}"`
              );
            }
            break;
          case 'apply':
            await this.themeService.applyColorScheme(selected.mapping.colorScheme, true);
            vscode.window.showInformationMessage(
              `Applied color scheme for "${selected.mapping.folderName}"`
            );
            break;
        }
      }
    }
  }
}
